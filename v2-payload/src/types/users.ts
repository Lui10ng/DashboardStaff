// Define Roles - use const for consistency
const USER_ROLES = {
  ADMIN: 'admin',
  ORGANIZER: 'organizer',
  ATTENDEE: 'attendee',
  CHECK_IN_STAFF: 'check-in-staff',
} as const;

type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export { USER_ROLES };
export type { UserRole };