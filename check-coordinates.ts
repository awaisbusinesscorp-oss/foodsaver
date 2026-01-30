import { config } from 'dotenv';
config();

import { prisma } from './lib/prisma';


async function checkCoordinates() {
    console.log('🔍 Checking for listings with null or invalid coordinates...\n');

    try {
        // Check for null coordinates
        const nullCoords = await prisma.foodListing.findMany({
            where: {
                OR: [
                    { latitude: null },
                    { longitude: null }
                ]
            },
            select: {
                id: true,
                title: true,
                latitude: true,
                longitude: true,
                status: true
            }
        });

        console.log(`📊 Found ${nullCoords.length} listing(s) with null coordinates:\n`);
        nullCoords.forEach((listing, idx) => {
            console.log(`${idx + 1}. [${listing.id}] ${listing.title}`);
            console.log(`   Status: ${listing.status}`);
            console.log(`   Coordinates: lat=${listing.latitude}, lng=${listing.longitude}\n`);
        });

        // Check for zero coordinates
        const zeroCoords = await prisma.foodListing.findMany({
            where: {
                OR: [
                    { latitude: 0 },
                    { longitude: 0 }
                ]
            },
            select: {
                id: true,
                title: true,
                latitude: true,
                longitude: true,
                status: true
            }
        });

        console.log(`📊 Found ${zeroCoords.length} listing(s) with zero coordinates:\n`);
        zeroCoords.forEach((listing, idx) => {
            console.log(`${idx + 1}. [${listing.id}] ${listing.title}`);
            console.log(`   Status: ${listing.status}`);
            console.log(`   Coordinates: lat=${listing.latitude}, lng=${listing.longitude}\n`);
        });

        // Get total count
        const total = await prisma.foodListing.count();
        const valid = total - nullCoords.length - zeroCoords.length;

        console.log('📈 Summary:');
        console.log(`   Total listings: ${total}`);
        console.log(`   Valid coordinates: ${valid}`);
        console.log(`   Null coordinates: ${nullCoords.length}`);
        console.log(`   Zero coordinates: ${zeroCoords.length}`);

        if (nullCoords.length > 0 || zeroCoords.length > 0) {
            console.log('\n⚠️  Some listings have invalid coordinates!');
            console.log('✅ However, the application is now safe - maps will use fallback locations.');
        } else {
            console.log('\n✅ All listings have valid coordinates!');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkCoordinates();
