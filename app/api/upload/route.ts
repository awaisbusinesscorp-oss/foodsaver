import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ message: "No file provided" }, { status: 400 });
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString("base64");
        const mimeType = file.type;
        const dataUrl = `data:${mimeType};base64,${base64}`;

        // Check if Cloudinary is configured
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (cloudName && apiKey && apiSecret) {
            // Upload to Cloudinary
            const cloudinaryFormData = new FormData();
            cloudinaryFormData.append("file", dataUrl);
            cloudinaryFormData.append("upload_preset", "foodsaver");
            cloudinaryFormData.append("api_key", apiKey);

            const cloudinaryRes = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: "POST",
                    body: cloudinaryFormData,
                }
            );

            if (cloudinaryRes.ok) {
                const cloudinaryData = await cloudinaryRes.json();
                return NextResponse.json({
                    url: cloudinaryData.secure_url,
                    success: true
                });
            }
        }

        // If Cloudinary isn't configured or fails, return base64 data URL
        // This will work but images will be stored in the database
        return NextResponse.json({
            url: dataUrl,
            success: true,
            note: "Using base64 encoding. Configure Cloudinary for better performance."
        });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ message: "Failed to upload image" }, { status: 500 });
    }
}
