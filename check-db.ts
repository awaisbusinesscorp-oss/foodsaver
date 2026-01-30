import { prisma } from './lib/prisma.ts';

async function check() {
    const listings = await prisma.foodListing.findMany({
        include: { images: true, donor: true }
    });
    console.log('Listings:', JSON.stringify(listings, null, 2));

    const users = await prisma.user.findMany();
    console.log('Users:', JSON.stringify(users, null, 2));
}

check();
