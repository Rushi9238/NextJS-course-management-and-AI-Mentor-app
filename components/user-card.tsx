"use client"

import type { UserProfile } from "@/lib/users"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mail, Phone, Calendar, Activity, BookOpen, Trophy, Edit, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEffect, useRef, useState } from "react"

interface UserCardProps {
  user: UserProfile
  onEdit?: (userId: string) => void
  onViewProfile?: (userId: string) => void
  onChangeStatus?: (userId: string, status: "active" | "inactive" | "suspended") => void
  showActions?: boolean
}

export function UserCard({ user, onEdit, onViewProfile, onChangeStatus, showActions = true }: UserCardProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "instructor":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "student":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "inactive":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "suspended":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{user.name}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Mail className="h-3 w-3" />
                {user.email}
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
            <Badge className={getStatusColor(user.status)}>{user.status}</Badge>


            {showActions && (
              <CustomDropdown
                user={user}
                onEdit={onEdit}
                onViewProfile={onViewProfile}
                onChangeStatus={onChangeStatus}
              />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {user.bio && <p className="text-sm text-muted-foreground line-clamp-2">{user.bio}</p>}

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {user.mobileNumber && (
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {user.mobileNumber}
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Joined {new Date(user.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Active {new Date().toLocaleDateString()}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-primary mb-1">
              <BookOpen className="h-4 w-4" />
              <span className="font-semibold">{user.coursesEnrolled || 0}</span>
            </div>
            <p className="text-xs text-muted-foreground">Enrolled</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-primary mb-1">
              <Trophy className="h-4 w-4" />
              <span className="font-semibold">{user.coursesCompleted || 0}</span>
            </div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>

          {user.role === "instructor" && (
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <Edit className="h-4 w-4" />
                <span className="font-semibold">{user.coursesCreated || 0}</span>
              </div>
              <p className="text-xs text-muted-foreground">Created</p>
            </div>
          )}

          {user.role === "student" && (
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <Activity className="h-4 w-4" />
                <span className="font-semibold">
                  {user.coursesEnrolled ? Math.round(((user.coursesCompleted || 0) / user.coursesEnrolled) * 100) : 0}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Progress</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function CustomDropdown({ user, onEdit, onViewProfile, onChangeStatus }: any) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="p-2 rounded hover:bg-gray-100"
        onClick={() => setOpen((o) => !o)}
        aria-label="More"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => { setOpen(false); onViewProfile?.(user._id) }}
          >
            View Profile
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
            onClick={() => { setOpen(false); onEdit?.(user._id) }}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit User
          </button>
          {user.status === "active" && (
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => { setOpen(false); onChangeStatus?.(user._id, "suspended") }}
            >
              Suspend User
            </button>
          )}
          {user.status === "suspended" && (
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => { setOpen(false); onChangeStatus?.(user._id, "active") }}
            >
              Activate User
            </button>
          )}
        </div>
      )}
    </div>
  )
}
