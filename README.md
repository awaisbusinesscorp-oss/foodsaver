# FoodSaver

A comprehensive food waste management platform connecting food donors with receivers through volunteer-driven pickup and delivery.

## Features

- 🍽️ **Food Listings** - Donors can list surplus food with photos, quantity, and expiry time
- 📍 **Location-based Discovery** - Find nearby food donations on an interactive map
- 🔄 **Donation Management** - Request, accept, and track donations in real-time
- 🚚 **Volunteer System** - Coordinate pickups and deliveries
- 🔔 **Notifications** - Real-time alerts for donations and updates
- ⭐ **Ratings & Reviews** - Build trust through feedback
- 📊 **Impact Tracking** - See your contribution to reducing food waste
- 🛡️ **Safety Features** - Food safety guidelines and quality controls

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Auth**: NextAuth.js
- **Maps**: Leaflet
- **Real-time**: Socket.io

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

## Documentation

- [Implementation Plan](./docs/IMPLEMENTATION_PLAN.md)
- [Task List](./docs/TASKS.md)

## License

MIT
