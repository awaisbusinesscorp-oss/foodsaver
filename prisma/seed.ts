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

    // Lahore coordinates: 31.5204, 74.3587

    // ========== DONORS ==========
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

    // Lahore Donors
    const lahoreDonor1 = await prisma.user.upsert({
        where: { email: 'karachi.biryani@foodsaver.pk' },
        update: {},
        create: {
            email: 'karachi.biryani@foodsaver.pk',
            name: 'Karachi Biryani House',
            password: hashedPassword,
            role: Role.DONOR,
            phone: '+92 321-1234567',
            address: 'MM Alam Road, Gulberg III, Lahore',
            latitude: 31.5103,
            longitude: 74.3411,
            verified: true,
            rating: 4.8,
        },
    });

    const lahoreDonor2 = await prisma.user.upsert({
        where: { email: 'food.street@foodsaver.pk' },
        update: {},
        create: {
            email: 'food.street@foodsaver.pk',
            name: 'Gawalmandi Food Street',
            password: hashedPassword,
            role: Role.DONOR,
            phone: '+92 322-2345678',
            address: 'Food Street, Gawalmandi, Lahore',
            latitude: 31.5655,
            longitude: 74.3141,
            verified: true,
            rating: 4.6,
        },
    });

    const lahoreDonor3 = await prisma.user.upsert({
        where: { email: 'butt.karahi@foodsaver.pk' },
        update: {},
        create: {
            email: 'butt.karahi@foodsaver.pk',
            name: 'Butt Karahi Tikka',
            password: hashedPassword,
            role: Role.DONOR,
            phone: '+92 323-3456789',
            address: 'Lakshmi Chowk, Lahore',
            latitude: 31.5546,
            longitude: 74.3232,
            verified: true,
            rating: 4.9,
        },
    });

    const lahoreDonor4 = await prisma.user.upsert({
        where: { email: 'andaaz.restaurant@foodsaver.pk' },
        update: {},
        create: {
            email: 'andaaz.restaurant@foodsaver.pk',
            name: 'Andaaz Restaurant',
            password: hashedPassword,
            role: Role.DONOR,
            phone: '+92 324-4567890',
            address: 'Liberty Market, Lahore',
            latitude: 31.5127,
            longitude: 74.3455,
            verified: true,
            rating: 4.5,
        },
    });

    const lahoreDonor5 = await prisma.user.upsert({
        where: { email: 'shezan.bakery@foodsaver.pk' },
        update: {},
        create: {
            email: 'shezan.bakery@foodsaver.pk',
            name: 'Shezan Bakery',
            password: hashedPassword,
            role: Role.DONOR,
            phone: '+92 325-5678901',
            address: 'Model Town, Lahore',
            latitude: 31.4826,
            longitude: 74.3239,
            verified: true,
            rating: 4.7,
        },
    });

    // ========== RECEIVERS ==========
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

    // Lahore Receivers
    const lahoreReceiver1 = await prisma.user.upsert({
        where: { email: 'edhi.lahore@receiver.pk' },
        update: {},
        create: {
            email: 'edhi.lahore@receiver.pk',
            name: 'Edhi Foundation Lahore',
            password: hashedPassword,
            role: Role.RECEIVER,
            phone: '+92 326-6789012',
            address: 'Edhi Center, Empress Road, Lahore',
            latitude: 31.5497,
            longitude: 74.3436,
            verified: true,
        },
    });

    const lahoreReceiver2 = await prisma.user.upsert({
        where: { email: 'saylani.lahore@receiver.pk' },
        update: {},
        create: {
            email: 'saylani.lahore@receiver.pk',
            name: 'Saylani Welfare Trust',
            password: hashedPassword,
            role: Role.RECEIVER,
            phone: '+92 327-7890123',
            address: 'Jail Road, Lahore',
            latitude: 31.5312,
            longitude: 74.3154,
            verified: true,
        },
    });

    const lahoreReceiver3 = await prisma.user.upsert({
        where: { email: 'rizq.lahore@receiver.pk' },
        update: {},
        create: {
            email: 'rizq.lahore@receiver.pk',
            name: 'Rizq Trust Lahore',
            password: hashedPassword,
            role: Role.RECEIVER,
            phone: '+92 328-8901234',
            address: 'DHA Phase 5, Lahore',
            latitude: 31.4697,
            longitude: 74.4021,
            verified: true,
        },
    });

    // ========== VOLUNTEERS/RIDERS ==========
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

    // Lahore Volunteers/Riders
    const lahoreVolunteer1 = await prisma.user.upsert({
        where: { email: 'ahmed.rider@volunteer.pk' },
        update: {},
        create: {
            email: 'ahmed.rider@volunteer.pk',
            name: 'Ahmed Khan',
            password: hashedPassword,
            role: Role.VOLUNTEER,
            phone: '+92 329-9012345',
            address: 'Johar Town, Lahore',
            latitude: 31.4697,
            longitude: 74.2728,
            verified: true,
            rating: 4.9,
        },
    });

    const lahoreVolunteer2 = await prisma.user.upsert({
        where: { email: 'ali.rider@volunteer.pk' },
        update: {},
        create: {
            email: 'ali.rider@volunteer.pk',
            name: 'Ali Raza',
            password: hashedPassword,
            role: Role.VOLUNTEER,
            phone: '+92 330-0123456',
            address: 'Iqbal Town, Lahore',
            latitude: 31.4945,
            longitude: 74.2825,
            verified: true,
            rating: 4.7,
        },
    });

    const lahoreVolunteer3 = await prisma.user.upsert({
        where: { email: 'usman.rider@volunteer.pk' },
        update: {},
        create: {
            email: 'usman.rider@volunteer.pk',
            name: 'Usman Ali',
            password: hashedPassword,
            role: Role.VOLUNTEER,
            phone: '+92 331-1234567',
            address: 'Garden Town, Lahore',
            latitude: 31.5083,
            longitude: 74.3214,
            verified: true,
            rating: 4.8,
        },
    });

    const lahoreVolunteer4 = await prisma.user.upsert({
        where: { email: 'bilal.rider@volunteer.pk' },
        update: {},
        create: {
            email: 'bilal.rider@volunteer.pk',
            name: 'Bilal Ahmed',
            password: hashedPassword,
            role: Role.VOLUNTEER,
            phone: '+92 332-2345678',
            address: 'Faisal Town, Lahore',
            latitude: 31.4826,
            longitude: 74.3127,
            verified: true,
            rating: 4.6,
        },
    });

    const lahoreVolunteer5 = await prisma.user.upsert({
        where: { email: 'hamza.rider@volunteer.pk' },
        update: {},
        create: {
            email: 'hamza.rider@volunteer.pk',
            name: 'Hamza Sheikh',
            password: hashedPassword,
            role: Role.VOLUNTEER,
            phone: '+92 333-3456789',
            address: 'Gulshan-e-Ravi, Lahore',
            latitude: 31.5445,
            longitude: 74.3521,
            verified: true,
            rating: 4.5,
        },
    });

    // ========== ADMIN ==========
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

    // ========== PAKISTANI FOOD LISTINGS (LAHORE) ==========
    const pakistaniFoodListings = [
        {
            donorId: lahoreDonor1.id,
            title: 'Chicken Biryani - 30 Portions',
            description: 'Authentic Karachi-style biryani with tender chicken, aromatic basmati rice, and special spices. Freshly prepared for a wedding event.',
            foodType: FoodType.COOKED,
            quantity: 30,
            unit: 'portions',
            expiryHours: 6,
            address: 'MM Alam Road, Gulberg III, Lahore',
            latitude: 31.5103,
            longitude: 74.3411,
            image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: lahoreDonor2.id,
            title: 'Seekh Kebabs & Naan',
            description: 'Juicy beef seekh kebabs with fresh tandoori naan. Perfect for iftar or dinner.',
            foodType: FoodType.COOKED,
            quantity: 25,
            unit: 'servings',
            expiryHours: 4,
            address: 'Food Street, Gawalmandi, Lahore',
            latitude: 31.5655,
            longitude: 74.3141,
            image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: lahoreDonor3.id,
            title: 'Mutton Karahi - Large Pot',
            description: 'Famous Butt Karahi with fresh mutton, tomatoes, and green chilies. Cooked in traditional style.',
            foodType: FoodType.COOKED,
            quantity: 20,
            unit: 'portions',
            expiryHours: 5,
            address: 'Lakshmi Chowk, Lahore',
            latitude: 31.5546,
            longitude: 74.3232,
            image: 'https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: lahoreDonor4.id,
            title: 'Nihari with Naan',
            description: 'Slow-cooked beef nihari with bone marrow, served with fresh kulcha naan. Traditional breakfast dish.',
            foodType: FoodType.COOKED,
            quantity: 15,
            unit: 'bowls',
            expiryHours: 8,
            address: 'Liberty Market, Lahore',
            latitude: 31.5127,
            longitude: 74.3455,
            image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: lahoreDonor5.id,
            title: 'Fresh Sheermal & Puri',
            description: 'Sweet sheermal bread and crispy puris. Perfect for breakfast with halwa.',
            foodType: FoodType.PACKAGED,
            quantity: 50,
            unit: 'pieces',
            expiryHours: 24,
            address: 'Model Town, Lahore',
            latitude: 31.4826,
            longitude: 74.3239,
            image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: lahoreDonor1.id,
            title: 'Haleem - Special Recipe',
            description: 'Rich and creamy haleem made with wheat, lentils, and tender beef. Garnished with fried onions and ginger.',
            foodType: FoodType.COOKED,
            quantity: 20,
            unit: 'bowls',
            expiryHours: 6,
            address: 'MM Alam Road, Gulberg III, Lahore',
            latitude: 31.5103,
            longitude: 74.3411,
            image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: lahoreDonor2.id,
            title: 'Chicken Tikka Platter',
            description: 'Marinated chicken tikka boti with mint chutney and fresh salad. Charcoal grilled to perfection.',
            foodType: FoodType.COOKED,
            quantity: 40,
            unit: 'pieces',
            expiryHours: 4,
            address: 'Food Street, Gawalmandi, Lahore',
            latitude: 31.5655,
            longitude: 74.3141,
            image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: lahoreDonor3.id,
            title: 'Aloo Paratha & Lassi',
            description: 'Traditional stuffed potato parathas with fresh sweet lassi. Authentic Lahori breakfast.',
            foodType: FoodType.COOKED,
            quantity: 30,
            unit: 'servings',
            expiryHours: 3,
            address: 'Lakshmi Chowk, Lahore',
            latitude: 31.5546,
            longitude: 74.3232,
            image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: lahoreDonor4.id,
            title: 'Daal Chawal - Family Pack',
            description: 'Yellow daal tadka with steamed basmati rice. Comfort food for the whole family.',
            foodType: FoodType.COOKED,
            quantity: 25,
            unit: 'portions',
            expiryHours: 6,
            address: 'Liberty Market, Lahore',
            latitude: 31.5127,
            longitude: 74.3455,
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: lahoreDonor5.id,
            title: 'Gulab Jamun & Jalebi',
            description: 'Fresh gulab jamun and crispy jalebi. Traditional Pakistani sweets.',
            foodType: FoodType.PACKAGED,
            quantity: 60,
            unit: 'pieces',
            expiryHours: 48,
            address: 'Model Town, Lahore',
            latitude: 31.4826,
            longitude: 74.3239,
            image: 'https://images.unsplash.com/photo-1666190050371-df434faec966?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: lahoreDonor1.id,
            title: 'Chapli Kebab & Roti',
            description: 'Peshawar-style chapli kebabs made with minced beef and special spices. Served with fresh roti.',
            foodType: FoodType.COOKED,
            quantity: 20,
            unit: 'servings',
            expiryHours: 4,
            address: 'MM Alam Road, Gulberg III, Lahore',
            latitude: 31.5103,
            longitude: 74.3411,
            image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: lahoreDonor2.id,
            title: 'Paya (Trotters Curry)',
            description: 'Traditional slow-cooked paya with rich gravy. Best served with fresh naan.',
            foodType: FoodType.COOKED,
            quantity: 15,
            unit: 'bowls',
            expiryHours: 8,
            address: 'Food Street, Gawalmandi, Lahore',
            latitude: 31.5655,
            longitude: 74.3141,
            image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: lahoreDonor3.id,
            title: 'Samosas & Pakoras',
            description: 'Crispy vegetable samosas and mixed pakoras. Perfect evening snacks with chutney.',
            foodType: FoodType.COOKED,
            quantity: 100,
            unit: 'pieces',
            expiryHours: 6,
            address: 'Lakshmi Chowk, Lahore',
            latitude: 31.5546,
            longitude: 74.3232,
            image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: lahoreDonor4.id,
            title: 'Chicken Pulao',
            description: 'Fragrant chicken pulao with whole spices and fried onions. Light and flavorful.',
            foodType: FoodType.COOKED,
            quantity: 25,
            unit: 'portions',
            expiryHours: 5,
            address: 'Liberty Market, Lahore',
            latitude: 31.5127,
            longitude: 74.3455,
            image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: lahoreDonor5.id,
            title: 'Fresh Rooh Afza Drink',
            description: 'Chilled Rooh Afza sherbet bottles. Perfect summer refreshment.',
            foodType: FoodType.BEVERAGES,
            quantity: 30,
            unit: 'bottles',
            expiryHours: 48,
            address: 'Model Town, Lahore',
            latitude: 31.4826,
            longitude: 74.3239,
            image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: lahoreDonor1.id,
            title: 'Qeema Naan',
            description: 'Fresh naan stuffed with spiced minced meat. Popular street food.',
            foodType: FoodType.COOKED,
            quantity: 35,
            unit: 'pieces',
            expiryHours: 4,
            address: 'MM Alam Road, Gulberg III, Lahore',
            latitude: 31.5103,
            longitude: 74.3411,
            image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: lahoreDonor2.id,
            title: 'Korma & Rice',
            description: 'Chicken korma with rich yogurt-based gravy. Served with fragrant rice.',
            foodType: FoodType.COOKED,
            quantity: 20,
            unit: 'portions',
            expiryHours: 6,
            address: 'Food Street, Gawalmandi, Lahore',
            latitude: 31.5655,
            longitude: 74.3141,
            image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: lahoreDonor3.id,
            title: 'Chana Chaat',
            description: 'Spicy chickpea chaat with onions, tomatoes, and tangy tamarind chutney.',
            foodType: FoodType.COOKED,
            quantity: 40,
            unit: 'plates',
            expiryHours: 3,
            address: 'Lakshmi Chowk, Lahore',
            latitude: 31.5546,
            longitude: 74.3232,
            image: 'https://images.unsplash.com/photo-1626132647523-66c6e0b85cec?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: lahoreDonor4.id,
            title: 'Kheer (Rice Pudding)',
            description: 'Creamy rice kheer with cardamom, pistachios, and almonds. Traditional dessert.',
            foodType: FoodType.COOKED,
            quantity: 25,
            unit: 'bowls',
            expiryHours: 24,
            address: 'Liberty Market, Lahore',
            latitude: 31.5127,
            longitude: 74.3455,
            image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=800'
        },
        {
            donorId: lahoreDonor5.id,
            title: 'Fresh Mangoes',
            description: 'Sweet Chaunsa mangoes from Punjab. Ripe and ready to eat.',
            foodType: FoodType.RAW,
            quantity: 50,
            unit: 'kg',
            expiryHours: 72,
            address: 'Model Town, Lahore',
            latitude: 31.4826,
            longitude: 74.3239,
            image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=800'
        },
    ];

    // Create all international listings
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

    // Create all Pakistani listings (Lahore)
    for (const listing of pakistaniFoodListings) {
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
                latitude: listing.latitude + (Math.random() - 0.5) * 0.02,
                longitude: listing.longitude + (Math.random() - 0.5) * 0.02,
                status: ListingStatus.AVAILABLE,
                images: listing.image ? {
                    create: [{ url: listing.image }]
                } : undefined
            },
        });
    }

    console.log('Seed data created successfully!');
    console.log('- 20 international food listings');
    console.log('- 20 Pakistani food listings (Lahore)');
    console.log('- 5 Lahore donors, 3 receivers, 5 volunteers/riders');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
