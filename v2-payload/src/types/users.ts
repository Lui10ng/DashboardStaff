// Define Roles - use const for consistency
const PLATFORM_ROLES = {
  ADMIN: 'admin',
  ORGANIZER: 'organizer',
  ATTENDEE: 'attendee',
  CHECK_IN_STAFF: 'check-in-staff',
} as const

type UserRole = (typeof PLATFORM_ROLES)[keyof typeof PLATFORM_ROLES]

export { PLATFORM_ROLES }
export type { UserRole }
