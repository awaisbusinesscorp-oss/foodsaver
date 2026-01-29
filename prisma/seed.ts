import { PrismaClient, Role, FoodType, ListingStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Create Users
    const donor1 = await prisma.user.upsert({
        where: { email: 'donor@foodsaver.org' },
        update: {},
        create: {
            email: 'donor@foodsaver.org',
            name: 'The Green Bistro',
            password: hashedPassword,
            role: Role.DONOR,
            phone: '+1 234-567-8901',
            address: '123 Gourmet Ave, Food City',
            latitude: 40.7128,
            longitude: -74.0060,
            verified: true,
        },
    });

    const donor2 = await prisma.user.upsert({
        where: { email: 'bakery@foodsaver.org' },
        update: {},
        create: {
            email: 'bakery@foodsaver.org',
            name: 'Old Town Bakery',
            password: hashedPassword,
            role: Role.DONOR,
            phone: '+1 234-567-8902',
            address: '456 Yeast Blvd, Bread Town',
            latitude: 40.7306,
            longitude: -73.9352,
            verified: true,
        },
    });

    const receiver1 = await prisma.user.upsert({
        where: { email: 'receiver@ngo.org' },
        update: {},
        create: {
            email: 'receiver@ngo.org',
            name: 'Hope NGO Shelter',
            password: hashedPassword,
            role: Role.RECEIVER,
            phone: '+1 234-567-8903',
            address: '789 Unity St, Community Ville',
            latitude: 40.7128,
            longitude: -74.0060,
            verified: true,
        },
    });

    const volunteer1 = await prisma.user.upsert({
        where: { email: 'volunteer@helper.com' },
        update: {},
        create: {
            email: 'volunteer@helper.com',
            name: 'Alex Helper',
            password: hashedPassword,
            role: Role.VOLUNTEER,
            phone: '+1 234-567-8904',
            verified: true,
        },
    });

    const admin = await prisma.user.upsert({
        where: { email: 'admin@foodsaver.org' },
        update: {},
        create: {
            email: 'admin@foodsaver.org',
            name: 'Super Admin',
            password: hashedPassword,
            role: Role.ADMIN,
            verified: true,
        },
    });

    // 2. Create Food Listings
    const listing1 = await prisma.foodListing.create({
        data: {
            donorId: donor1.id,
            title: 'Fresh Pasta & Garlic Bread',
            description: 'Italian pasta with tomato sauce and 10 sides of garlic bread. Prepared 2 hours ago.',
            foodType: FoodType.COOKED,
            quantity: 10,
            unit: 'portions',
            expiryTime: new Date(Date.now() + 1000 * 60 * 60 * 6), // 6 hours from now
            address: '123 Gourmet Ave, Food City',
            latitude: 40.7128,
            longitude: -74.0060,
            status: ListingStatus.AVAILABLE,
            images: {
                create: [
                    { url: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=800' }
                ]
            }
        },
    });

    const listing2 = await prisma.foodListing.create({
        data: {
            donorId: donor2.id,
            title: 'Assorted Pastries Box',
            description: 'Croissants, danishes and muffins. Perfectly safe but baked this morning.',
            foodType: FoodType.PACKAGED,
            quantity: 5,
            unit: 'boxes',
            expiryTime: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours from now
            address: '456 Yeast Blvd, Bread Town',
            latitude: 40.7306,
            longitude: -73.9352,
            status: ListingStatus.AVAILABLE,
            images: {
                create: [
                    { url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800' }
                ]
            }
        },
    });

    const listing3 = await prisma.foodListing.create({
        data: {
            donorId: donor1.id,
            title: 'Vegetable Salad Bowls',
            description: 'Fresh organic salads with vinaigrette dressing. 15 individual bowls.',
            foodType: FoodType.COOKED,
            quantity: 15,
            unit: 'bowls',
            expiryTime: new Date(Date.now() + 1000 * 60 * 60 * 4), // 4 hours from now
            address: '123 Gourmet Ave, Food City',
            latitude: 40.7128,
            longitude: -74.0060,
            status: ListingStatus.AVAILABLE,
        },
    });

    console.log('Seed data created successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
