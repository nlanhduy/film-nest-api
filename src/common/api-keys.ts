import { Role } from './enum'

export const CLIENT_API_KEYS = {
  CLIENT_ADMIN_KEY_ABC123: { name: 'Client A', role: Role.Admin },
  CLIENT_SUPER_KEY_DEF456: { name: 'Client B', role: Role.SuperAdmin },
  CLIENT_VIEW_KEY_GHI789: { name: 'Client C', role: Role.Viewer },
} as const
