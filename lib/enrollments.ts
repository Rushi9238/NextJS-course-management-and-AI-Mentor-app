import type { Enrollment } from "./courses"

// Extended enrollment interface with progress tracking
export interface EnrollmentWithProgress extends Enrollment {
  courseName: string
  courseDescription: string
  instructor: string
  thumbnail: string
  totalLessons: number
  completedLessons: number
  lastAccessedLesson?: string
  timeSpent: number // in minutes
  certificateEarned: boolean
  enrollmentDate: string
  completionDate?: string
}

// Mock enrollment data with progress
export const mockEnrollmentsWithProgress: EnrollmentWithProgress[] = [
  {
    id: "1",
    userId: "3",
    courseId: "1",
    enrolledAt: "2024-01-25",
    progress: 65,
    completedLessons: ["1", "2"],
    status: "active",
    courseName: "JavaScript Fundamentals",
    courseDescription: "Learn the basics of JavaScript programming from scratch",
    instructor: "John Instructor",
    thumbnail: "/javascript-programming-course.png",
    totalLessons: 12,
    completedLessons: 8,
    lastAccessedLesson: "Variables and Functions",
    timeSpent: 480, // 8 hours
    certificateEarned: false,
    enrollmentDate: "2024-01-25",
  },
  {
    id: "2",
    userId: "3",
    courseId: "2",
    enrolledAt: "2024-02-10",
    progress: 30,
    completedLessons: [],
    status: "active",
    courseName: "React Advanced Patterns",
    courseDescription: "Master advanced React patterns and best practices",
    instructor: "John Instructor",
    thumbnail: "/react-advanced-programming.jpg",
    totalLessons: 20,
    completedLessons: 6,
    lastAccessedLesson: "Higher-Order Components",
    timeSpent: 240, // 4 hours
    certificateEarned: false,
    enrollmentDate: "2024-02-10",
  },
  {
    id: "3",
    userId: "5",
    courseId: "1",
    enrolledAt: "2024-02-01",
    progress: 100,
    completedLessons: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    status: "completed",
    courseName: "JavaScript Fundamentals",
    courseDescription: "Learn the basics of JavaScript programming from scratch",
    instructor: "John Instructor",
    thumbnail: "/javascript-programming-course.png",
    totalLessons: 12,
    completedLessons: 12,
    lastAccessedLesson: "Final Project",
    timeSpent: 720, // 12 hours
    certificateEarned: true,
    enrollmentDate: "2024-02-01",
    completionDate: "2024-03-01",
  },
  {
    id: "4",
    userId: "5",
    courseId: "3",
    enrolledAt: "2024-02-15",
    progress: 45,
    completedLessons: ["1", "2", "3"],
    status: "active",
    courseName: "UI/UX Design Principles",
    courseDescription: "Learn the fundamentals of user interface and user experience design",
    instructor: "Sarah Designer",
    thumbnail: "/ui-ux-design-course.png",
    totalLessons: 10,
    completedLessons: 4,
    lastAccessedLesson: "Color Theory",
    timeSpent: 180, // 3 hours
    certificateEarned: false,
    enrollmentDate: "2024-02-15",
  },
]

// Enrollment management utilities
export const getEnrollmentsByUser = (userId: string): EnrollmentWithProgress[] => {
  return mockEnrollmentsWithProgress.filter((enrollment) => enrollment.userId === userId)
}

export const getEnrollmentsByCourse = (courseId: string): EnrollmentWithProgress[] => {
  return mockEnrollmentsWithProgress.filter((enrollment) => enrollment.courseId === courseId)
}

export const getEnrollmentStats = (userId: string) => {
  const userEnrollments = getEnrollmentsByUser(userId)
  const totalEnrolled = userEnrollments.length
  const completed = userEnrollments.filter((e) => e.status === "completed").length
  const inProgress = userEnrollments.filter((e) => e.status === "active").length
  const totalTimeSpent = userEnrollments.reduce((sum, e) => sum + e.timeSpent, 0)
  const certificatesEarned = userEnrollments.filter((e) => e.certificateEarned).length

  return {
    totalEnrolled,
    completed,
    inProgress,
    totalTimeSpent,
    certificatesEarned,
    averageProgress:
      totalEnrolled > 0 ? Math.round(userEnrollments.reduce((sum, e) => sum + e.progress, 0) / totalEnrolled) : 0,
  }
}

export const createEnrollment = (userId: string, courseId: string): EnrollmentWithProgress => {
  // Mock enrollment creation - in real app, this would call an API
  const newEnrollment: EnrollmentWithProgress = {
    id: Date.now().toString(),
    userId,
    courseId,
    enrolledAt: new Date().toISOString().split("T")[0],
    progress: 0,
    completedLessons: [],
    status: "active",
    courseName: "New Course",
    courseDescription: "Course description",
    instructor: "Instructor",
    thumbnail: "/placeholder.svg",
    totalLessons: 10,
    completedLessons: 0,
    timeSpent: 0,
    certificateEarned: false,
    enrollmentDate: new Date().toISOString().split("T")[0],
  }

  mockEnrollmentsWithProgress.push(newEnrollment)
  return newEnrollment
}
