"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CourseCard } from "@/components/course-card"
import { CourseForm } from "@/components/course-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { mockCourses, getCoursesByInstructor, getEnrolledCourses, type Course } from "@/lib/courses"
import { Plus, Search, Filter } from "lucide-react"
import axios from "axios"

export default function CoursesPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [showForm, setShowForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)

  const [courseList, setCourseList] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    getCourseList()
  }, [])

  const getCourseList = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get('/api/courses', {
        withCredentials: true
      })
      if (response.data.status) {
        setCourseList(response.data.data)
      }
      else {

      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Get courses based on user role
  const getCourses = () => {
    if (user?.role === "instructor") {
      return getCoursesByInstructor(user._id)
    } else if (user?.role === "student") {
      return mockCourses // All available courses for students
    } else {
      return mockCourses // All courses for admin
    }
  }

  const getEnrolledCourseIds = () => {
    if (user?.role === "student") {
      return getEnrolledCourses(user._id).map((course) => course._id)
    }
    return []
  }

  // Filter courses
  const filteredCourses = courseList.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel

    return matchesSearch && matchesCategory && matchesLevel
  })

  const categories = Array.from(new Set(mockCourses.map((course) => course.category)))
  const enrolledCourseIds = getEnrolledCourseIds()

  const handleEnroll = (courseId: string) => {
    // Mock enrollment - in real app, this would call an API
    console.log("Enrolling in course:", courseId)
  }

  const handleEditCourse = (courseId: string) => {
    const course = courseList.find((c) => c._id === courseId)
    if (course) {
      setEditingCourse(course)
      setShowForm(true)
    }
  }

  const handleSaveCourse = async (courseData: Partial<Course>) => {
    // Mock save - in real app, this would call an API
    console.log("Saving course:", courseData)

    try {
      let response: any
      if (courseData._id) {
        response = await axios.put('/api/courses', courseData, {
          withCredentials: true
        })

        if (response.data.status) {
           getCourseList()
        }

      } else {
        const payload = {
          "title": courseData.title,
          "category":courseData.category,
          "description": courseData.description,
          "level": courseData.level,
          "price": courseData.price,
          "duration":courseData.duration
        }
        response = await axios.post('api/courses', payload)

        if (response.data.status) {
          getCourseList()
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setShowForm(false)
      setEditingCourse(null)
    }
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingCourse(null)
  }

  return (
    <DashboardLayout activeTab="courses">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {user?.role === "instructor" && "My Courses"}
              {user?.role === "student" && "Available Courses"}
              {user?.role === "admin" && "All Courses"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {user?.role === "instructor" && "Manage and create your courses"}
              {user?.role === "student" && "Discover and enroll in new courses"}
              {user?.role === "admin" && "Manage all platform courses"}
            </p>
          </div>

          {user?.role === "instructor" && (
            <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Course
            </Button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            {/* <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""}
          </Badge>
          {searchTerm && <Badge variant="outline">Search: "{searchTerm}"</Badge>}
          {selectedCategory !== "all" && <Badge variant="outline">Category: {selectedCategory}</Badge>}
          {selectedLevel !== "all" && <Badge variant="outline">Level: {selectedLevel}</Badge>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              onEnroll={handleEnroll}
              onEdit={handleEditCourse}
              enrolled={enrolledCourseIds.includes(course._id)}
            />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <p className="text-lg mb-2">No courses found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          </div>
        )}
      </div>

      {showForm && <CourseForm course={editingCourse} onSave={handleSaveCourse} onCancel={handleCancelForm} />}
    </DashboardLayout>
  )
}
