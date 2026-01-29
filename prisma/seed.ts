import { PrismaClient, Role, FoodType, ListingStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as bcrypt from 'bcryptjs';

// For seeding, we need direct database connection (not Accelerate)
const databaseUrl = process.env.DATABASE_URL || process.env.fs_DATABASE_URL || process.env.fs_POSTGRES_URL;

if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for seeding");
}

const pool = new pg.Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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

    // 2. Create 20 Food Listings
    const foodListings = [
        {
            donorId: donor1.id,
            title: 'Fresh Pasta & Garlic Bread',
            description: 'Italian pasta with tomato sauce and 10 sides of garlic bread. Prepared 2 hours ago.',
            foodType: FoodType.COOKED,
            quantity: 10,
            unit: 'portions',
            expiryHours: 6,
            address: '123 Gourmet Ave, Food City',
            image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: donor2.id,
            title: 'Assorted Pastries Box',
            description: 'Croissants, danishes and muffins. Perfectly safe but baked this morning.',
            foodType: FoodType.PACKAGED,
            quantity: 5,
            unit: 'boxes',
            expiryHours: 24,
            address: '456 Yeast Blvd, Bread Town',
            image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: donor1.id,
            title: 'Vegetable Salad Bowls',
            description: 'Fresh organic salads with vinaigrette dressing. 15 individual bowls.',
            foodType: FoodType.COOKED,
            quantity: 15,
            unit: 'bowls',
            expiryHours: 4,
            address: '123 Gourmet Ave, Food City',
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: donor2.id,
            title: 'Fresh Fruit Platter',
            description: 'Sliced melons, berries, and tropical fruits. Perfect for events.',
            foodType: FoodType.RAW,
            quantity: 3,
            unit: 'platters',
            expiryHours: 12,
            address: '456 Yeast Blvd, Bread Town',
            image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: donor1.id,
            title: 'Grilled Chicken Sandwiches',
            description: 'Healthy grilled chicken with lettuce and tomato. Made fresh today.',
            foodType: FoodType.COOKED,
            quantity: 20,
            unit: 'sandwiches',
            expiryHours: 8,
            address: '123 Gourmet Ave, Food City',
            image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: donor2.id,
            title: 'Fresh Orange Juice',
            description: 'Freshly squeezed orange juice. No preservatives added.',
            foodType: FoodType.BEVERAGES,
            quantity: 10,
            unit: 'liters',
            expiryHours: 24,
            address: '456 Yeast Blvd, Bread Town',
            image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: donor1.id,
            title: 'Butter Croissants',
            description: 'Flaky French butter croissants. Baked fresh this morning.',
            foodType: FoodType.PACKAGED,
            quantity: 24,
            unit: 'pieces',
            expiryHours: 48,
            address: '123 Gourmet Ave, Food City',
            image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: donor2.id,
            title: 'Vegetable Stir Fry',
            description: 'Mixed vegetables stir fried with soy sauce and ginger.',
            foodType: FoodType.COOKED,
            quantity: 8,
            unit: 'portions',
            expiryHours: 5,
            address: '456 Yeast Blvd, Bread Town',
            image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: donor1.id,
            title: 'Organic Milk Cartons',
            description: 'Fresh organic whole milk. Best before date approaching.',
            foodType: FoodType.BEVERAGES,
            quantity: 12,
            unit: 'cartons',
            expiryHours: 72,
            address: '123 Gourmet Ave, Food City',
            image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: donor2.id,
            title: 'Sushi Platter Combo',
            description: 'Assorted sushi rolls including California, spicy tuna, and salmon.',
            foodType: FoodType.COOKED,
            quantity: 4,
            unit: 'platters',
            expiryHours: 6,
            address: '456 Yeast Blvd, Bread Town',
            image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: donor1.id,
            title: 'Fresh Baked Bread Loaves',
            description: 'Whole wheat and sourdough bread loaves. Perfect for families.',
            foodType: FoodType.PACKAGED,
            quantity: 15,
            unit: 'loaves',
            expiryHours: 48,
            address: '123 Gourmet Ave, Food City',
            image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: donor2.id,
            title: 'Pizza Slices Box',
            description: 'Assorted pizza slices - pepperoni, margherita, and veggie.',
            foodType: FoodType.COOKED,
            quantity: 30,
            unit: 'slices',
            expiryHours: 4,
            address: '456 Yeast Blvd, Bread Town',
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: donor1.id,
            title: 'Canned Soup Collection',
            description: 'Variety of canned soups - tomato, chicken noodle, and minestrone.',
            foodType: FoodType.PACKAGED,
            quantity: 24,
            unit: 'cans',
            expiryHours: 720,
            address: '123 Gourmet Ave, Food City',
            image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: donor2.id,
            title: 'Fresh Vegetables Box',
            description: 'Mixed fresh vegetables - carrots, broccoli, peppers, and zucchini.',
            foodType: FoodType.RAW,
            quantity: 5,
            unit: 'boxes',
            expiryHours: 96,
            address: '456 Yeast Blvd, Bread Town',
            image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: donor1.id,
            title: 'Chocolate Chip Cookies',
            description: 'Homemade chocolate chip cookies. Soft and chewy!',
            foodType: FoodType.PACKAGED,
            quantity: 50,
            unit: 'cookies',
            expiryHours: 72,
            address: '123 Gourmet Ave, Food City',
            image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: donor2.id,
            title: 'Iced Coffee Bottles',
            description: 'Cold brew coffee bottles, ready to drink.',
            foodType: FoodType.BEVERAGES,
            quantity: 20,
            unit: 'bottles',
            expiryHours: 168,
            address: '456 Yeast Blvd, Bread Town',
            image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: donor1.id,
            title: 'Quinoa Buddha Bowls',
            description: 'Healthy quinoa bowls with roasted vegetables and tahini dressing.',
            foodType: FoodType.COOKED,
            quantity: 12,
            unit: 'bowls',
            expiryHours: 6,
            address: '123 Gourmet Ave, Food City',
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: donor2.id,
            title: 'Fresh Eggs Carton',
            description: 'Farm fresh organic eggs. Brown and white mixed.',
            foodType: FoodType.RAW,
            quantity: 10,
            unit: 'dozens',
            expiryHours: 336,
            address: '456 Yeast Blvd, Bread Town',
            image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: donor1.id,
            title: 'Chicken Biryani',
            description: 'Aromatic basmati rice with tender chicken pieces and spices.',
            foodType: FoodType.COOKED,
            quantity: 25,
            unit: 'portions',
            expiryHours: 8,
            address: '123 Gourmet Ave, Food City',
            image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: donor2.id,
            title: 'Greek Yogurt Cups',
            description: 'Creamy Greek yogurt with honey. Individual serving cups.',
            foodType: FoodType.PACKAGED,
            quantity: 30,
            unit: 'cups',
            expiryHours: 120,
            address: '456 Yeast Blvd, Bread Town',
            image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=800'
        },
    ];

    // Create all listings
    for (const listing of foodListings) {
        await prisma.foodListing.create({
            data: {
                donorId: listing.donorId,
                title: listing.title,
                description: listing.description,
                foodType: listing.foodType,
                quantity: listing.quantity,
                unit: listing.unit,
                expiryTime: new Date(Date.now() + 1000 * 60 * 60 * listing.expiryHours),
                address: listing.address,
                latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
                longitude: -74.0060 + (Math.random() - 0.5) * 0.1,
                status: ListingStatus.AVAILABLE,
                images: listing.image ? {
                    create: [{ url: listing.image }]
                } : undefined
            },
        });
    }

    console.log('Seed data created successfully! Added 20 food listings.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
