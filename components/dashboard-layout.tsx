"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import {
  GraduationCap,
  BookOpen,
  Users,
  Settings,
  LogOut,
  MessageSquare,
  BarChart3,
  User,
  GraduationCapIcon,
  Menu,
  X,
  UserCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface DashboardLayoutProps {
  children: ReactNode
  activeTab?: string
}

export function DashboardLayout({ children, activeTab }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router=useRouter()

  const getNavigationItems = () => {
    const baseItems = [
      { id: "dashboard", label: "Dashboard", icon: BarChart3, href: "/dashboard" },
      { id: "courses", label: "Courses", icon: BookOpen, href: "/courses" },
    ]

    if (user?.role === "student") {
      baseItems.push({ id: "my-learning", label: "My Learning", icon: GraduationCapIcon, href: "/my-learning" })
    }

    baseItems.push({ id: "ai-mentor", label: "AI Mentor", icon: MessageSquare, href: "/ai-mentor" })

    if (user?.role === "admin") {
      baseItems.push(
        { id: "users", label: "Users", icon: Users, href: "/users" },
        { id: "enrollments", label: "Enrollments", icon: UserCheck, href: "/enrollments" },
        { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
      )
    } else if (user?.role === "instructor") {
      baseItems.push(
        { id: "users", label: "Students", icon: Users, href: "/users" },
        { id: "enrollments", label: "Enrollments", icon: UserCheck, href: "/enrollments" },
      )
    }

    return baseItems
  }

  const handleLogout=()=>{
    const respoanse =  logout()
    router.push('/login')
  }

  return (
    <div className=" bg-background ">
      <div className="flex h-screen ">
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        <aside
          className={cn(
            "fixed lg:static inset-y-0 left-0 z-50 w-64 min-h-screen  border-r border-border/50 backdrop-blur-sm transform transition-transform duration-200 ease-in-out lg:transform-none",
            isMobileMenuOpen ? "translate-x-0 bg-white" : "-translate-x-full lg:translate-x-0 bg-card/30",
          )}
        >
          <div className="lg:hidden absolute top-4 right-4">
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">EduMentor AI</h1>
                <p className="text-xs text-muted-foreground">Learning Platform</p>
              </div>
            </div>

            <nav className="space-y-2">
              {getNavigationItems().map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.id} href={item.href}>
                    <button
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                        activeTab === item.id
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="absolute bottom-0 left-0 right-0 w-64 p-4 border-t border-border/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </aside>

        <main className="flex-1 lg:ml-0  overflow-auto">
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-border/50 bg-card/30 backdrop-blur-sm">
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">EduMentor AI</span>
            </div>
            <div className="w-8" /> {/* Spacer for centering */}
          </div>

          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
