export interface Course {
  _id: string
  title: string
  description: string
  instructor: string
  createdBy:{
    _id:string
    name:string
    email:string
    role:string
  }
  category: string
  level: "Beginner" | "Intermediate" | "Advanced"
  duration: string
  price: number
  thumbnail?: string
  enrolledCount: number
  rating: number
  createdAt: string
  updatedAt: string
  modules: CourseModule[]
}

export interface CourseModule {
  id: string
  title: string
  description: string
  duration: string
  order: number
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  title: string
  content: string
  type: "video" | "text" | "quiz" | "assignment"
  duration: string
  order: number
}

export interface Enrollment {
  id: string
  userId: string
  courseId: string
  enrolledAt: string
  progress: number
  completedLessons: string[]
  status: "active" | "completed" | "dropped"
}

// Mock course data
export const mockCourses: Course[] = [
  // {
  //   id: "1",
  //   title: "JavaScript Fundamentals",
  //   description:
  //     "Learn the basics of JavaScript programming from scratch. Perfect for beginners who want to start their web development journey.",
  //   instructor: "John Instructor",
  //   instructorId: "2",
  //   category: "Programming",
  //   level: "Beginner",
  //   duration: "8 weeks",
  //   price: 99,
  //   thumbnail: "/javascript-programming-course.png",
  //   enrolledCount: 234,
  //   rating: 4.8,
  //   status: "published",
  //   createdAt: "2024-01-15",
  //   updatedAt: "2024-01-20",
  //   modules: [
  //     {
  //       id: "1",
  //       title: "Introduction to JavaScript",
  //       description: "Basic concepts and syntax",
  //       duration: "2 weeks",
  //       order: 1,
  //       lessons: [
  //         {
  //           id: "1",
  //           title: "What is JavaScript?",
  //           content: "Introduction to JavaScript and its uses",
  //           type: "video",
  //           duration: "15 min",
  //           order: 1,
  //         },
  //         {
  //           id: "2",
  //           title: "Variables and Data Types",
  //           content: "Understanding variables and basic data types",
  //           type: "video",
  //           duration: "20 min",
  //           order: 2,
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: "2",
  //   title: "React Advanced Patterns",
  //   description: "Master advanced React patterns and best practices for building scalable applications.",
  //   instructor: "John Instructor",
  //   instructorId: "2",
  //   category: "Programming",
  //   level: "Advanced",
  //   duration: "12 weeks",
  //   price: 199,
  //   thumbnail: "/react-advanced-programming.jpg",
  //   enrolledCount: 156,
  //   rating: 4.9,
  //   status: "published",
  //   createdAt: "2024-02-01",
  //   updatedAt: "2024-02-05",
  //   modules: [],
  // },
  // {
  //   id: "3",
  //   title: "UI/UX Design Principles",
  //   description: "Learn the fundamentals of user interface and user experience design.",
  //   instructor: "Sarah Designer",
  //   instructorId: "4",
  //   category: "Design",
  //   level: "Intermediate",
  //   duration: "6 weeks",
  //   price: 149,
  //   thumbnail: "/ui-ux-design-course.png",
  //   enrolledCount: 89,
  //   rating: 4.7,
  //   status: "published",
  //   createdAt: "2024-01-20",
  //   updatedAt: "2024-01-25",
  //   modules: [],
  // },
]

// Mock enrollments
export const mockEnrollments: Enrollment[] = [
  {
    id: "1",
    userId: "3",
    courseId: "1",
    enrolledAt: "2024-01-25",
    progress: 65,
    completedLessons: ["1", "2"],
    status: "active",
  },
  {
    id: "2",
    userId: "3",
    courseId: "2",
    enrolledAt: "2024-02-10",
    progress: 30,
    completedLessons: [],
    status: "active",
  },
]

// Course management utilities
export const getCoursesByInstructor = (instructorId: string): Course[] => {
  return mockCourses.filter((course) => course.createdBy._id === instructorId)
}

export const getEnrollmentsByUser = (userId: string): Enrollment[] => {
  return mockEnrollments.filter((enrollment) => enrollment.userId === userId)
}

export const getEnrolledCourses = (userId: string): Course[] => {
  const userEnrollments = getEnrollmentsByUser(userId)
  return mockCourses.filter((course) => userEnrollments.some((enrollment) => enrollment.courseId === course._id))
}
