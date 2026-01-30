# 🇵🇰 Pakistani Food Seeding Guide

## Quick Setup

Once your database is configured, you can easily add 20 Pakistani food listings to populate your FoodSaver app.

### Method 1: API Endpoint (Recommended)

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Call the seed endpoint:**
   ```bash
   curl -X POST http://localhost:3000/api/seed
   ```

   Or visit in your browser:
   ```
   http://localhost:3000/api/seed
   ```

### Method 2: Using the Script Directly

```bash
npx tsx prisma/seed-pakistani-foods.ts
```

## What Gets Added?

✅ **20 Authentic Pakistani Food Listings:**
- Chicken Biryani (Karachi)
- Beef Nihari (Lahore)
- Karahi Gosht (Rawalpindi)
- Haleem (Karachi)
- Chicken Tikka (Lahore)
- Fresh Chapati/Roti (Islamabad)
- Daal Chawal (Faisalabad)
- Pakoras & Samosas (Lahore)
- Basmati Rice (Rawalpindi)
- Flour/Atta (Karachi)
- Fresh Vegetables (Islamabad)
- Fresh Chicken (Lahore)
- Fresh Milk (Multan)
- Packaged Biscuits (Peshawar)
- Tea Packages (Karachi)
- Cooking Oil (Islamabad)
- Soft Drinks (Murree)
- Fruit Juice (Lahore)
- Dates/Khajoor (Islamabad)
- Qeema Naan (Lahore)

## 📍 Cities Covered
- Karachi
- Lahore  
- Islamabad
- Rawalpindi
- Faisalabad
- Multan
- Peshawar
- Murree

## 🔐 Test Donor Account

After seeding, you can login with:
- **Email:** donor.pk@foodsaver.com
- **Password:** password123

This account owns all 20 food listings.

## Response Example

```json
{
  "success": true,
  "message": "✅ Successfully seeded 20 Pakistani food listings!",
  "locations": "Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Murree",
  "donorEmail": "donor.pk@foodsaver.com",
  "donorPassword": "password123"
}
```

## Notes

- All listings have realistic Pakistani addresses with actual coordinates
- Food types include: COOKED, RAW, PACKAGED, BEVERAGES
- Expiry times are set appropriately for each food type
- The seed endpoint can be called multiple times (it won't duplicate the donor user)
