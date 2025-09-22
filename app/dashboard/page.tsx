"use client"

import { useAuth } from "@/contexts/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, MessageSquare, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  const getStatsCards = () => {
    if (user?.role === "admin") {
      return [
        { title: "Total Courses", value: "24", icon: BookOpen, change: "+12%" },
        { title: "Active Users", value: "1,234", icon: Users, change: "+8%" },
        { title: "AI Interactions", value: "5,678", icon: MessageSquare, change: "+23%" },
        { title: "Completion Rate", value: "87%", icon: TrendingUp, change: "+5%" },
      ]
    } else if (user?.role === "instructor") {
      return [
        { title: "My Courses", value: "6", icon: BookOpen, change: "+2" },
        { title: "Students", value: "156", icon: Users, change: "+12" },
        { title: "AI Assists", value: "89", icon: MessageSquare, change: "+15" },
        { title: "Avg. Score", value: "92%", icon: TrendingUp, change: "+3%" },
      ]
    } else {
      return [
        { title: "Enrolled Courses", value: "4", icon: BookOpen, change: "+1" },
        { title: "Completed", value: "2", icon: TrendingUp, change: "+1" },
        { title: "AI Sessions", value: "23", icon: MessageSquare, change: "+7" },
        { title: "Progress", value: "68%", icon: TrendingUp, change: "+12%" },
      ]
    }
  }

  return (
    <DashboardLayout activeTab="dashboard">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground mt-2">
            {user?.role === "admin" && "Manage your educational platform"}
            {user?.role === "instructor" && "Track your courses and students"}
            {user?.role === "student" && "Continue your learning journey"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {getStatsCards().map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <Icon className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <p className="text-xs text-primary">{stat.change} from last month</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest course interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">JavaScript Fundamentals</p>
                    <p className="text-xs text-muted-foreground">Completed lesson 3</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">React Advanced Patterns</p>
                    <p className="text-xs text-muted-foreground">Started new module</p>
                  </div>
                </div>
                <Link href="/courses">
                  <Button variant="ghost" size="sm" className="w-full justify-between">
                    View all courses
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                AI Mentor
              </CardTitle>
              <CardDescription>Get instant help with your learning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm text-foreground mb-2">
                    Ready to help you learn! Ask me anything about your courses.
                  </p>
                  <Link href="/ai-mentor">
                    <button className="text-xs text-primary hover:underline">Start conversation →</button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
