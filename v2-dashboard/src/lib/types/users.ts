export const PLATFORM_ROLES = {
    ADMIN: 'admin',
    ORGANIZER: 'organizer',
    ATTENDEE: 'attendee',
    CHECK_IN_STAFF: 'check-in-staff'
} as const;

export type PlatformRole = typeof PLATFORM_ROLES[keyof typeof PLATFORM_ROLES];

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    clerkRoles: PlatformRole[];
    userStatus: 'active' | 'pending' | 'inactive';
    createdAt: string;
    updatedAt: string;
    loginAttempts: number;
} 