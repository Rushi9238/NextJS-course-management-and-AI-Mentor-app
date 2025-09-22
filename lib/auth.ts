export type UserRole = "student" | "instructor" | "admin"

export interface User {
  "_id": string
  email: string
  name: string
  role: UserRole
  avatar?: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
}

// Mock users for demonstration
export const mockUsers: User[] = [
  {
    "_id": "1",
    email: "admin@courseapp.com",
    name: "Admin User",
    role: "admin",
  },
  {
    "_id": "2",
    email: "instructor@courseapp.com",
    name: "John Instructor",
    role: "instructor",
  },
  {
    "_id": "3",
    email: "student@courseapp.com",
    name: "Jane Student",
    role: "student",
  },
]

// Authentication utilities
export const authenticateUser = (email: string, password: string): User | null => {
  // Simple mock authentication
  const user = mockUsers.find((u) => u.email === email)
  return password === "password" ? user || null : null
}

export const hasPermission = (user: User | null, requiredRole: UserRole): boolean => {
  if (!user) return false

  const roleHierarchy = { student: 0, instructor: 1, admin: 2 }
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
}
