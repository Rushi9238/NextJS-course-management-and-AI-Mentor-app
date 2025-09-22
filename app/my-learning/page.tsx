"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { EnrollmentCard } from "@/components/enrollment-card"
import { EnrollmentStats } from "@/components/enrollment-stats"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getEnrollmentsByUser, getEnrollmentStats } from "@/lib/enrollments"
import { Search, Filter, BookOpen, Trophy, Clock } from "lucide-react"

export default function MyLearningPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  if (!user) {
    return (
      <DashboardLayout activeTab="my-learning">
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <p className="text-lg mb-2">Please sign in</p>
            <p className="text-sm">You need to be signed in to view your learning progress</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Only students should see this page
  if (user.role !== "student") {
    return (
      <DashboardLayout activeTab="my-learning">
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <p className="text-lg mb-2">Access Denied</p>
            <p className="text-sm">This page is only available for students</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const enrollments = getEnrollmentsByUser(user._id)
  const stats = getEnrollmentStats(user._id)

  // Filter enrollments
  const filteredEnrollments = enrollments.filter((enrollment) => {
    const matchesSearch =
      searchTerm === "" ||
      enrollment.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.instructor.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === "all" || enrollment.status === selectedStatus

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && enrollment.status === "active") ||
      (activeTab === "completed" && enrollment.status === "completed")

    return matchesSearch && matchesStatus && matchesTab
  })

  const handleContinueLearning = (enrollmentId: string) => {
    console.log("Continue learning:", enrollmentId)
    // In a real app, this would navigate to the course content
  }

  const handleViewCertificate = (enrollmentId: string) => {
    console.log("View certificate:", enrollmentId)
    // In a real app, this would show/download the certificate
  }

  return (
    <DashboardLayout activeTab="my-learning">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Learning</h1>
          <p className="text-muted-foreground mt-2">Track your progress and continue your learning journey</p>
        </div>

        {/* Learning Statistics */}
        <EnrollmentStats stats={stats} />

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="dropped">Dropped</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Course Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              All Courses ({enrollments.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              In Progress ({stats.inProgress})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Completed ({stats.completed})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {/* Results Summary */}
            <div className="flex items-center gap-2 mb-6">
              <Badge variant="secondary">
                {filteredEnrollments.length} course{filteredEnrollments.length !== 1 ? "s" : ""}
              </Badge>
              {searchTerm && <Badge variant="outline">Search: "{searchTerm}"</Badge>}
              {selectedStatus !== "all" && <Badge variant="outline">Status: {selectedStatus}</Badge>}
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEnrollments.map((enrollment) => (
                <EnrollmentCard
                  key={enrollment.id}
                  enrollment={enrollment}
                  onContinue={handleContinueLearning}
                  onViewCertificate={handleViewCertificate}
                />
              ))}
            </div>

            {filteredEnrollments.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No courses found</p>
                  <p className="text-sm mb-4">
                    {searchTerm || selectedStatus !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "Start your learning journey by enrolling in a course"}
                  </p>
                  {!searchTerm && selectedStatus === "all" && (
                    <Button onClick={() => (window.location.href = "/courses")}>Browse Courses</Button>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
