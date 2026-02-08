// Shared type definitions for the FoodSaver application

// Session user with role
export interface SessionUser {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: 'DONOR' | 'RECEIVER' | 'VOLUNTEER' | 'ADMIN';
    latitude?: number;
    longitude?: number;
}

// Food listing type
export interface FoodListing {
    id: string;
    title: string;
    description?: string | null;
    foodType: 'COOKED' | 'RAW' | 'PACKAGED' | 'BEVERAGES';
    quantity: number;
    unit: string;
    expiryTime: Date | string;
    pickupStart?: Date | string | null;
    pickupEnd?: Date | string | null;
    address: string;
    latitude?: number | null;
    longitude?: number | null;
    status: 'AVAILABLE' | 'RESERVED' | 'CLAIMED' | 'EXPIRED';
    donorId: string;
    uniqueId?: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    images?: FoodImage[];
    donor?: UserBasic;
}

// Food image type
export interface FoodImage {
    id: string;
    url: string;
    listingId: string;
}

// Basic user info
export interface UserBasic {
    id: string;
    name: string | null;
    email?: string | null;
    phone?: string | null;
    rating?: number | null;
    address?: string | null;
    latitude?: number | null;
    longitude?: number | null;
}

// Full user type
export interface User extends UserBasic {
    role: 'DONOR' | 'RECEIVER' | 'VOLUNTEER' | 'ADMIN';
    createdAt: Date | string;
    updatedAt: Date | string;
}

// Donation request type
export interface DonationRequest {
    id: string;
    listingId: string;
    receiverId: string;
    requestedQty: number;
    notes?: string | null;
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'PICKED_UP' | 'DELIVERED' | 'CANCELLED';
    createdAt: Date | string;
    updatedAt: Date | string;
    listing?: FoodListing;
    receiver?: UserBasic;
}

// Report type
export interface Report {
    id: string;
    reporterId: string;
    listingId?: string | null;
    targetUserId?: string | null;
    type: string;
    description: string;
    status: 'PENDING' | 'REVIEWED' | 'RESOLVED';
    createdAt: Date | string;
    reporter?: UserBasic;
    listing?: FoodListing;
    targetUser?: UserBasic;
}

// Volunteer assignment type
export interface VolunteerAssignment {
    id: string;
    requestId: string;
    volunteerId: string;
    status: 'ASSIGNED' | 'PICKED_UP' | 'DELIVERED';
    pickupTime?: Date | string | null;
    deliveryTime?: Date | string | null;
    currentLat?: number | null;
    currentLng?: number | null;
    request?: DonationRequest;
    volunteer?: UserBasic;
}

// Notification type
export interface Notification {
    id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: Date | string;
}

// Stats types
export interface UserStats {
    meals: number;
    kg: number;
    people: number;
    carbon: number;
    weeklyActivity: number[];
}

export interface AdminStats {
    totalUsers: number;
    totalListings: number;
    totalDonations: number;
    totalVolunteers: number;
}
