"use client"

import type { EnrollmentWithProgress } from "@/lib/enrollments"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, Trophy, Play, Calendar, User } from "lucide-react"

interface EnrollmentCardProps {
  enrollment: EnrollmentWithProgress
  onContinue?: (enrollmentId: string) => void
  onViewCertificate?: (enrollmentId: string) => void
  showInstructor?: boolean
}

export function EnrollmentCard({
  enrollment,
  onContinue,
  onViewCertificate,
  showInstructor = true,
}: EnrollmentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "active":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "dropped":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors group">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={enrollment.thumbnail || "/placeholder.svg"}
            alt={enrollment.courseName}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <Badge className={getStatusColor(enrollment.status)}>{enrollment.status}</Badge>
          </div>
          <div className="absolute top-4 right-4">
            {enrollment.certificateEarned && (
              <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                <Trophy className="h-3 w-3 mr-1" />
                Certified
              </Badge>
            )}
          </div>
          {enrollment.progress > 0 && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-background/80 backdrop-blur-sm rounded-lg p-2">
                <div className="flex items-center justify-between text-xs text-foreground mb-1">
                  <span>Progress</span>
                  <span>{enrollment.progress}%</span>
                </div>
                <Progress value={enrollment.progress} className="h-2" />
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <CardTitle className="text-lg line-clamp-2 text-balance">{enrollment.courseName}</CardTitle>
            <CardDescription className="mt-2 line-clamp-2">{enrollment.courseDescription}</CardDescription>
          </div>

          {showInstructor && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              {enrollment.instructor}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>
                {enrollment.completedLessons}/{enrollment.totalLessons} lessons
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{formatTime(enrollment.timeSpent)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Enrolled {new Date(enrollment.enrollmentDate).toLocaleDateString()}</span>
            </div>
            {enrollment.completionDate && (
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                <span>Completed {new Date(enrollment.completionDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {enrollment.lastAccessedLesson && enrollment.status === "active" && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Last accessed:</p>
              <p className="text-sm font-medium text-foreground">{enrollment.lastAccessedLesson}</p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {enrollment.status === "active" && (
              <Button onClick={() => onContinue?.(enrollment.id)} className="flex-1">
                <Play className="h-4 w-4 mr-2" />
                Continue Learning
              </Button>
            )}
            {enrollment.status === "completed" && (
              <Button onClick={() => onContinue?.(enrollment.id)} variant="outline" className="flex-1">
                <BookOpen className="h-4 w-4 mr-2" />
                Review Course
              </Button>
            )}
            {enrollment.certificateEarned && (
              <Button onClick={() => onViewCertificate?.(enrollment.id)} variant="outline">
                <Trophy className="h-4 w-4 mr-2" />
                Certificate
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
