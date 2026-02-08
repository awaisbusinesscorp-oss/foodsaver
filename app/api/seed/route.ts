import { NextRequest, NextResponse } from 'next/server';
import * as bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

// Lazy import prisma to avoid build-time initialization
const getPrisma = async () => {
    const { prisma } = await import('@/lib/prisma');
    return prisma;
};

// Free food images from Unsplash
const FOOD_IMAGES: Record<string, string> = {
    'Chicken Biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800',
    'Beef Nihari': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
    'Karahi Gosht': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d6?w=800',
    'Haleem': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
    'Chicken Tikka': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800',
    'Fresh Chapati/Roti': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
    'Daal Chawal': 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800',
    'Pakoras and Samosas': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',
    'Basmati Rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800',
    'Flour (Atta)': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800',
    'Fresh Vegetables': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
    'Chicken (Fresh)': 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=800',
    'Milk (Fresh)': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800',
    'Packaged Biscuits': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800',
    'Tea Packages': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800',
    'Cooking Oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800',
    'Soft Drinks': 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=800',
    'Fruit Juice': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800',
    'Dates (Khajoor)': 'https://images.unsplash.com/photo-1591102972305-213abaa76d6f?w=800',
    'Qeema Naan': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
};

export async function POST(_req: NextRequest) {
    try {
        console.log('🇵🇰 Starting Pakistani food seeding...');

        const prisma = await getPrisma();

        // Create a donor user if not exists
        const donorEmail = 'donor.pk@foodsaver.com';
        let donor = await prisma.user.findUnique({ where: { email: donorEmail } });

        if (!donor) {
            const hashedPassword = await bcrypt.hash('password123', 10);
            donor = await prisma.user.create({
                data: {
                    email: donorEmail,
                    password: hashedPassword,
                    name: 'Ahmed Khan',
                    role: 'DONOR',
                    phone: '+92-300-1234567',
                    address: 'F-7 Markaz, Islamabad',
                    latitude: 33.7215,
                    longitude: 73.0433,
                    rating: 4.8,
                },
            });
        }

        // Create a receiver user for testing
        const receiverEmail = 'receiver.pk@foodsaver.com';
        let receiver = await prisma.user.findUnique({ where: { email: receiverEmail } });

        if (!receiver) {
            const hashedPassword = await bcrypt.hash('password123', 10);
            receiver = await prisma.user.create({
                data: {
                    email: receiverEmail,
                    password: hashedPassword,
                    name: 'Fatima Ali',
                    role: 'RECEIVER',
                    phone: '+92-321-9876543',
                    address: 'DHA Phase 6, Karachi',
                    latitude: 24.8138,
                    longitude: 67.0630,
                    rating: 4.5,
                },
            });
        }

        const pakistaniListings = [
            {
                title: 'Chicken Biryani',
                description: 'Fresh homemade chicken biryani with raita. Serves 10-15 people. Made today morning.',
                foodType: 'COOKED',
                quantity: 15,
                unit: 'servings',
                expiryTime: new Date(Date.now() + 8 * 60 * 60 * 1000),
                address: 'Gulshan-e-Iqbal Block 13-D, Karachi',
                latitude: 24.9209,
                longitude: 67.0924,
            },
            {
                title: 'Beef Nihari',
                description: 'Authentic Lahori nihari with naan. Perfect for breakfast. Enough for 20 people.',
                foodType: 'COOKED',
                quantity: 20,
                unit: 'servings',
                expiryTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
                address: 'Anarkali Bazaar, Lahore',
                latitude: 31.5656,
                longitude: 74.3242,
            },
            {
                title: 'Karahi Gosht',
                description: 'Spicy mutton karahi freshly prepared. Best consumed within 4 hours.',
                foodType: 'COOKED',
                quantity: 10,
                unit: 'servings',
                expiryTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
                address: 'Saddar Town, Rawalpindi',
                latitude: 33.5973,
                longitude: 73.0479,
            },
            {
                title: 'Haleem',
                description: 'Traditional Ramadan haleem made with beef and lentils. Family recipe.',
                foodType: 'COOKED',
                quantity: 25,
                unit: 'servings',
                expiryTime: new Date(Date.now() + 12 * 60 * 60 * 1000),
                address: 'Nazimabad Block 5, Karachi',
                latitude: 24.9253,
                longitude: 67.0351,
            },
            {
                title: 'Chicken Tikka',
                description: 'BBQ chicken tikka with mint chutney. Wedding leftover, excellent quality.',
                foodType: 'COOKED',
                quantity: 30,
                unit: 'pieces',
                expiryTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
                address: 'DHA Phase 5, Lahore',
                latitude: 31.4715,
                longitude: 74.3912,
            },
            {
                title: 'Fresh Chapati/Roti',
                description: 'Freshly made whole wheat rotis. 50 pieces available from restaurant surplus.',
                foodType: 'COOKED',
                quantity: 50,
                unit: 'pieces',
                expiryTime: new Date(Date.now() + 10 * 60 * 60 * 1000),
                address: 'Blue Area, Islamabad',
                latitude: 33.7181,
                longitude: 73.0776,
            },
            {
                title: 'Daal Chawal',
                description: 'Yellow lentils with steamed rice. Simple and nutritious. For 15 people.',
                foodType: 'COOKED',
                quantity: 15,
                unit: 'servings',
                expiryTime: new Date(Date.now() + 8 * 60 * 60 * 1000),
                address: 'Civil Lines, Faisalabad',
                latitude: 31.4187,
                longitude: 73.0791,
            },
            {
                title: 'Pakoras and Samosas',
                description: 'Assorted pakoras and beef samosas. Great for iftar or evening snacks.',
                foodType: 'COOKED',
                quantity: 100,
                unit: 'pieces',
                expiryTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
                address: 'Johar Town, Lahore',
                latitude: 31.4667,
                longitude: 74.2694,
            },
            {
                title: 'Basmati Rice',
                description: 'Premium quality 10kg basmati rice bag. Sealed and unused.',
                foodType: 'RAW',
                quantity: 10,
                unit: 'kg',
                expiryTime: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                address: 'Satellite Town, Rawalpindi',
                latitude: 33.6007,
                longitude: 73.0679,
            },
            {
                title: 'Flour (Atta)',
                description: 'Chakki fresh atta, 20kg bag. Perfect for making rotis.',
                foodType: 'RAW',
                quantity: 20,
                unit: 'kg',
                expiryTime: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
                address: 'Clifton Block 5, Karachi',
                latitude: 24.8138,
                longitude: 67.0299,
            },
            {
                title: 'Fresh Vegetables',
                description: 'Mixed vegetables: tomatoes, onions, potatoes, and green chilies. Farm fresh.',
                foodType: 'RAW',
                quantity: 15,
                unit: 'kg',
                expiryTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
                address: 'I-8 Markaz, Islamabad',
                latitude: 33.6689,
                longitude: 73.0749,
            },
            {
                title: 'Chicken (Fresh)',
                description: 'Fresh chicken, halal. 5kg from local farm. Needs to be cooked today.',
                foodType: 'RAW',
                quantity: 5,
                unit: 'kg',
                expiryTime: new Date(Date.now() + 12 * 60 * 60 * 1000),
                address: 'Model Town, Lahore',
                latitude: 31.4847,
                longitude: 74.3232,
            },
            {
                title: 'Milk (Fresh)',
                description: 'Fresh buffalo milk, 10 liters. Delivered this morning.',
                foodType: 'BEVERAGES',
                quantity: 10,
                unit: 'liters',
                expiryTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
                address: 'Cantt Area, Multan',
                latitude: 30.1984,
                longitude: 71.4687,
            },
            {
                title: 'Packaged Biscuits',
                description: 'Sooper biscuits family packs. 20 packs available. Expiry 6 months away.',
                foodType: 'PACKAGED',
                quantity: 20,
                unit: 'packs',
                expiryTime: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
                address: 'Saddar, Peshawar',
                latitude: 34.0151,
                longitude: 71.5249,
            },
            {
                title: 'Tea Packages',
                description: 'Tapal Danedar tea, 500g packs. 10 packs available.',
                foodType: 'PACKAGED',
                quantity: 10,
                unit: 'packs',
                expiryTime: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                address: 'North Nazimabad, Karachi',
                latitude: 24.9289,
                longitude: 67.0330,
            },
            {
                title: 'Cooking Oil',
                description: 'Dalda cooking oil, 5 liter bottles. 8 bottles available.',
                foodType: 'PACKAGED',
                quantity: 8,
                unit: 'bottles',
                expiryTime: new Date(Date.now() + 270 * 24 * 60 * 60 * 1000),
                address: 'Bahria Town Phase 4, Islamabad',
                latitude: 33.5226,
                longitude: 72.9784,
            },
            {
                title: 'Soft Drinks',
                description: 'Coca Cola and Sprite bottles. 24 bottles (1.5L each) from event.',
                foodType: 'BEVERAGES',
                quantity: 24,
                unit: 'bottles',
                expiryTime: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                address: 'Mall Road, Murree',
                latitude: 33.9070,
                longitude: 73.3943,
            },
            {
                title: 'Fruit Juice',
                description: 'Shezan mixed fruit juice packs. 30 tetra packs available.',
                foodType: 'BEVERAGES',
                quantity: 30,
                unit: 'packs',
                expiryTime: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
                address: 'Gulberg III, Lahore',
                latitude: 31.5089,
                longitude: 74.3507,
            },
            {
                title: 'Dates (Khajoor)',
                description: 'Premium Ajwa dates from Madinah. 5kg box. Perfect for Ramadan.',
                foodType: 'PACKAGED',
                quantity: 5,
                unit: 'kg',
                expiryTime: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                address: 'F-10 Markaz, Islamabad',
                latitude: 33.6969,
                longitude: 73.0155,
            },
            {
                title: 'Qeema Naan',
                description: 'Freshly baked qeema naans from bakery. 40 pieces available.',
                foodType: 'COOKED',
                quantity: 40,
                unit: 'pieces',
                expiryTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
                address: 'Liberty Market, Lahore',
                latitude: 31.5204,
                longitude: 74.3587,
            },
        ];

        // Delete existing listings from this donor to avoid duplicates
        await prisma.foodListing.deleteMany({
            where: { donorId: donor.id }
        });

        for (const listing of pakistaniListings) {
            const imageUrl = FOOD_IMAGES[listing.title];

            await prisma.foodListing.create({
                data: {
                    ...listing,
                    foodType: listing.foodType as 'COOKED' | 'RAW' | 'PACKAGED' | 'BEVERAGES',
                    donorId: donor.id,
                    status: 'AVAILABLE',
                    images: imageUrl ? {
                        create: [{ url: imageUrl }]
                    } : undefined
                },
            });
        }

        return NextResponse.json({
            success: true,
            message: `✅ Successfully seeded ${pakistaniListings.length} Pakistani food listings with images!`,
            locations: 'Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Murree',
            testAccounts: {
                donor: { email: donorEmail, password: 'password123' },
                receiver: { email: receiverEmail, password: 'password123' }
            }
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Seed error:', error);
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}
