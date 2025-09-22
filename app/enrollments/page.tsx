"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Search, Users, BookOpen, Award, Clock } from "lucide-react"
import { mockEnrollmentsWithProgress } from "@/lib/enrollments"
import { mockUsers } from "@/lib/users"
import { mockCourses } from "@/lib/courses"
import { useAuth } from "@/contexts/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function EnrollmentsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "completed" | "dropped">("all")

  // Get all enrollments with user and course details
  const enrichedEnrollments = useMemo(() => {
    return mockEnrollmentsWithProgress.map((enrollment) => {
      const student = mockUsers.find((u) => u.id === enrollment.userId)
      const course = mockCourses.find((c) => c.id === enrollment.courseId)
      return {
        ...enrollment,
        student,
        course,
      }
    })
  }, [])

  // Filter enrollments based on search and status
  const filteredEnrollments = useMemo(() => {
    return enrichedEnrollments.filter((enrollment) => {
      const matchesSearch =
        enrollment.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.student?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.courseName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || enrollment.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [enrichedEnrollments, searchTerm, statusFilter])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalEnrollments = enrichedEnrollments.length
    const activeEnrollments = enrichedEnrollments.filter((e) => e.status === "active").length
    const completedEnrollments = enrichedEnrollments.filter((e) => e.status === "completed").length
    const totalCertificates = enrichedEnrollments.filter((e) => e.certificateEarned).length
    const averageProgress =
      totalEnrollments > 0
        ? Math.round(enrichedEnrollments.reduce((sum, e) => sum + e.progress, 0) / totalEnrollments)
        : 0

    return {
      totalEnrollments,
      activeEnrollments,
      completedEnrollments,
      totalCertificates,
      averageProgress,
    }
  }, [enrichedEnrollments])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "active":
        return "bg-blue-500"
      case "dropped":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Enrollments</h1>
          <p className="text-muted-foreground">Track student progress across all courses</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEnrollments}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.activeEnrollments}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completedEnrollments}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificates</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.totalCertificates}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageProgress}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search students or courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("active")}
            >
              Active
            </Button>
            <Button
              variant={statusFilter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("completed")}
            >
              Completed
            </Button>
          </div>
        </div>

        {/* Enrollments List */}
        <div className="grid gap-4">
          {filteredEnrollments.map((enrollment) => (
            <Card key={enrollment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Student Info */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={enrollment.student?.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {enrollment.student?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground truncate">{enrollment.student?.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{enrollment.student?.email}</p>
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">{enrollment.courseName}</h4>
                    <p className="text-sm text-muted-foreground">Instructor: {enrollment.instructor}</p>
                  </div>

                  {/* Progress */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-muted-foreground">{enrollment.progress}%</span>
                    </div>
                    <Progress value={enrollment.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {enrollment.completedLessons}/{enrollment.totalLessons} lessons
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getStatusColor(enrollment.status)}>{enrollment.status}</Badge>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatTime(enrollment.timeSpent)}</p>
                      <p className="text-xs text-muted-foreground">Time spent</p>
                    </div>
                    {enrollment.certificateEarned && (
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                        <Award className="h-3 w-3 mr-1" />
                        Certified
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Additional Details */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Enrolled:</span>
                      <p className="font-medium">{enrollment.enrollmentDate}</p>
                    </div>
                    {enrollment.completionDate && (
                      <div>
                        <span className="text-muted-foreground">Completed:</span>
                        <p className="font-medium">{enrollment.completionDate}</p>
                      </div>
                    )}
                    {enrollment.lastAccessedLesson && (
                      <div>
                        <span className="text-muted-foreground">Last Lesson:</span>
                        <p className="font-medium truncate">{enrollment.lastAccessedLesson}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">Student ID:</span>
                      <p className="font-medium">{enrollment.student?.id}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEnrollments.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No enrollments found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No students have enrolled in courses yet"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
