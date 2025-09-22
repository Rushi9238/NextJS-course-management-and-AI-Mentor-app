import type { User, UserRole } from "./auth"

export interface UserProfile extends User {
  firstName: string
  lastName?: string
  name:string
  bio?: string
  mobileNumber?: string
  createdAt: string
  lastActive: string
  status: "active" | "inactive" | "suspended"
  coursesEnrolled?: number
  coursesCompleted?: number
  coursesCreated?: number
}

// Extended mock users with profile data
export const mockUserProfiles: UserProfile[] = [
  {
    "_id": "1",
    email: "admin@courseapp.com",
    name: "Admin User",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    bio: "Platform administrator with full system access",
    mobileNumber: "+1 (555) 123-4567",
    createdAt: "2024-01-01",
    lastActive: "2024-03-15",
    status: "active",
    coursesEnrolled: 0,
    coursesCompleted: 0,
    coursesCreated: 0,
  },
  {
    "_id": "2",
    email: "instructor@courseapp.com",
    name: "John Instructor",
    firstName: "John",
    lastName: "Instructor",
    role: "instructor",
    bio: "Experienced software developer and educator specializing in JavaScript and React",
    mobileNumber: "+1 (555) 234-5678",
    createdAt: "2024-01-15",
    lastActive: "2024-03-14",
    status: "active",
    coursesEnrolled: 2,
    coursesCompleted: 1,
    coursesCreated: 6,
  },
  {
    "_id": "3",
    email: "student@courseapp.com",
    name: "Jane Student",
    firstName: "Jane",
    lastName: "Student",
    role: "student",
    bio: "Aspiring web developer passionate about learning new technologies",
    mobileNumber: "+1 (555) 345-6789",
    createdAt: "2024-02-01",
    lastActive: "2024-03-15",
    status: "active",
    coursesEnrolled: 4,
    coursesCompleted: 2,
    coursesCreated: 0,
  },
  {
    "_id": "4",
    email: "sarah.designer@courseapp.com",
    name: "Sarah Designer",
    firstName: "Sarah",
    lastName: "Designer",
    role: "instructor",
    bio: "UI/UX designer with 8+ years of experience in creating user-centered designs",
    mobileNumber: "+1 (555) 456-7890",
    createdAt: "2024-01-20",
    lastActive: "2024-03-13",
    status: "active",
    coursesEnrolled: 1,
    coursesCompleted: 0,
    coursesCreated: 3,
  },
  {
    "_id": "5",
    email: "mike.student@courseapp.com",
    name: "Mike Johnson",
    firstName: "Mike",
    lastName: "Johnson",
    role: "student",
    bio: "Computer science student looking to enhance practical skills",
    mobileNumber: "+1 (555) 567-8901",
    createdAt: "2024-02-15",
    lastActive: "2024-03-10",
    status: "active",
    coursesEnrolled: 3,
    coursesCompleted: 1,
    coursesCreated: 0,
  },
  {
    "_id": "6",
    email: "inactive.user@courseapp.com",
    name: "Inactive User",
    firstName: "Inactive",
    lastName: "User",
    role: "student",
    bio: "User who has been inactive for a while",
    mobileNumber: "+1 (555) 678-9012",
    createdAt: "2024-01-10",
    lastActive: "2024-02-01",
    status: "inactive",
    coursesEnrolled: 1,
    coursesCompleted: 0,
    coursesCreated: 0,
  },
]

export const mockUsers = mockUserProfiles

// User management utilities
export const getUsersByRole = (role: UserRole): UserProfile[] => {
  return mockUserProfiles.filter((user) => user.role === role)
}

export const getUserStats = () => {
  const total = mockUserProfiles.length
  const active = mockUserProfiles.filter((u) => u.status === "active").length
  const students = mockUserProfiles.filter((u) => u.role === "student").length
  const instructors = mockUserProfiles.filter((u) => u.role === "instructor").length
  const admins = mockUserProfiles.filter((u) => u.role === "admin").length

  return { total, active, students, instructors, admins }
}

export const searchUsers = (query: string): UserProfile[] => {
  const lowercaseQuery = query.toLowerCase()
  return mockUserProfiles.filter(
    (user) =>
      user.name.toLowerCase().includes(lowercaseQuery) ||
      user.email.toLowerCase().includes(lowercaseQuery) ||
      user.firstName.toLowerCase().includes(lowercaseQuery)
  )
}
