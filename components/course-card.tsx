"use client"

import type { Course } from "@/lib/courses"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Users, Clock, BookOpen } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Image from 'next/image';

import placeholderImage from '../public/javascript-programming-course.png'

interface CourseCardProps {
  course: Course
  onEnroll?: (courseId: string) => void
  onEdit?: (courseId: string) => void
  showActions?: boolean
  enrolled?: boolean
}

export function CourseCard({ course, onEnroll, onEdit, showActions = true, enrolled = false }: CourseCardProps) {
  const { user } = useAuth()

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "Intermediate":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "Advanced":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const handleEnroll = () => {
    if (onEnroll) {
      onEnroll(course._id)
      // Show success message or redirect
      alert(`Successfully enrolled in ${course.title}!`)
    }
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors group">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          {/* Image */}
          <Image
            src={course.thumbnail || placeholderImage}
            alt={course.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-gray-700 opacity-20 z-0" />

          {/* Badge - Level */}
          <div className="absolute top-4 left-4 z-10">
            <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
          </div>

          {/* Badge - Price */}
          <div className="absolute top-4 right-4 z-10">
            <Badge variant="secondary" className="bg-background/80 text-foreground">
              ${course.price}
            </Badge>
          </div>
        </div>

      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <CardTitle className="text-lg line-clamp-2 text-balance">{course.title}</CardTitle>
            <CardDescription className="mt-2 line-clamp-2">{course.description}</CardDescription>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {course.enrolledCount || 11}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {course.duration}
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {(Math.random() * 4 + 1).toFixed(1)}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{course.instructor}</p>
              <p className="text-xs text-muted-foreground">{course.category}</p>
            </div>

            {showActions && (
              <div className="flex gap-2">
                {user?.role === "instructor" && course.createdBy._id === user._id && (
                  <Button variant="outline" size="sm" onClick={() => onEdit?.(course._id)}>
                    Edit
                  </Button>
                )}
                {user?.role === "student" && !enrolled && (
                  <Button size="sm" onClick={handleEnroll} className="bg-primary hover:bg-primary/90">
                    Enroll
                  </Button>
                )}
                {enrolled && (
                  <Button variant="outline" size="sm" className="border-primary/20 text-primary bg-transparent">
                    <BookOpen className="h-4 w-4 mr-1" />
                    Continue
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
