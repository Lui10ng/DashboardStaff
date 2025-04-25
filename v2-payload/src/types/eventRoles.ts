// Define the possible roles a user can have for a specific event
export const EVENT_ROLES = {
  MANAGER: 'manager',
  EDITOR: 'editor',
  VIEWER: 'viewer',
} as const

export type EventRole = (typeof EVENT_ROLES)[keyof typeof EVENT_ROLES]
