import type { PlatformRole } from './users';

export interface Staff {
    id: string;
    name: string;
    email: string;
    clerkRoles: PlatformRole[];
    userStatus: 'active' | 'pending' | 'inactive';
    phone: string;
    createdAt: string;
    updatedAt: string;
    loginAttempts: number;
} 