import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { JWT } from "next-auth/jwt";

// Extended user type with role
interface UserWithRole {
    id: string;
    email: string | null;
    name: string | null;
    role: string;
}

// Extended JWT with role
interface JWTWithRole extends JWT {
    id?: string;
    role?: string;
}

// Extended session user
interface SessionUserWithRole {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id?: string;
    role?: string;
}

// Lazy import prisma to avoid build-time initialization issues
const getPrisma = async () => {
    const { prisma } = await import("./prisma");
    return prisma;
};

// Build auth providers array conditionally
const providers: NextAuthOptions["providers"] = [
    CredentialsProvider({
        name: "Credentials",
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) return null;

            const prisma = await getPrisma();
            const user = await prisma.user.findUnique({
                where: { email: credentials.email },
            });

            if (!user || !user.password) return null;

            const isPasswordValid = await compare(
                credentials.password,
                user.password
            );

            if (!isPasswordValid) return null;

            return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            };
        },
    }),
];

// Only add Google provider if credentials are configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    );
}

export const authOptions: NextAuthOptions = {
    providers,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const jwtToken = token as JWTWithRole;
                const userWithRole = user as UserWithRole;
                jwtToken.id = userWithRole.id;
                jwtToken.role = userWithRole.role;
                return jwtToken;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                const jwtToken = token as JWTWithRole;
                const sessionUser = session.user as SessionUserWithRole;
                sessionUser.id = jwtToken.id;
                sessionUser.role = jwtToken.role;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
