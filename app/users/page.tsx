"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { UserCard } from "@/components/user-card"
import { UserForm } from "@/components/user-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockUserProfiles, getUserStats, type UserProfile } from "@/lib/users"
import { Plus, Search, Filter, Users, UserCheck, GraduationCap, Shield, UserSearch } from "lucide-react"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"

export default function UsersPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null)

  const [userList, setUserList] = useState<UserProfile[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)


  useEffect(() => {
    getUserList()
  }, [])

  const countList = useMemo(() => {
    if (userList.length > 0) {
      const total = userList.length
      const activeUser = userList.filter((u) => u.status == 'active').length
      const studentCount = userList.filter((u) => u.role == 'student').length
      const instructorCount = userList.filter((u) => u.role === 'instructor').length
      const adminCount = userList.filter((u) => u.role === "admin").length

      return { total, activeUser, studentCount, instructorCount, adminCount }
    }
    return null
  }, [userList])


  // Call User list API
  const getUserList = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get('/api/user', {
        withCredentials: true
      })
      if (response.data.status) {
        setUserList(response.data.data)
      }
      else {

      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Check permissions
  if (user?.role !== "admin" && user?.role !== "instructor") {
    return (
      <DashboardLayout activeTab="users">
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <p className="text-lg mb-2">Access Denied</p>
            <p className="text-sm">You don't have permission to view this page</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Get users based on role
  const getUsers = () => {
    if (user?.role === "instructor") {
      // Instructors can only see students
      return mockUserProfiles.filter((u) => u.role === "student")
    }
    return mockUserProfiles // Admins see all users
  }

  // Filter users
  const filteredUsers = userList.filter((userProfile) => {
    const matchesSearch =
      searchTerm === "" ||
      userProfile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userProfile.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || userProfile.role === selectedRole
    const matchesStatus = selectedStatus === "all" || userProfile.status === selectedStatus

    return matchesSearch && matchesRole && matchesStatus
  })

  const stats = getUserStats()

  const handleEditUser = (userId: string) => {
    const userToEdit = userList.find((u) => u._id === userId)
    if (userToEdit) {
      setEditingUser(userToEdit)
      setShowForm(true)
    }
  }

  const handleViewProfile = (userId: string) => {
    console.log("Viewing profile for user:", userId)
  }

  const handleChangeStatus = async(userId: string, status: string) => {
    console.log("Changing status for user:", userId, "to:", status)
    try {
      const payload:any={
        "_id":userId,
        status
      }
        const response = await axios.delete('/api/user', {
          data: payload,
          withCredentials: true
        })
         if (response.data.status) {
          setUserList((prev: any) => (
            prev.map((user: any) => (
              user._id === userId ? response.data.data : user
            ))
          ))
        }

    } catch (error) {
      console.log(error)
    }
  }

  const handleSaveUser = async (userData: Partial<UserProfile>) => {

    try {
      let response: any
      if (userData._id) {
        response = await axios.put('/api/user', userData, {
          withCredentials: true
        })

        if (response.data.status) {
          setUserList((prev: any) => (
            prev.map((user: any) => (
              user._id === userData._id ? response.data.data : user
            ))
          ))
        }

      } else {
        const payload = {
          name: userData.name,
          email: userData.email,
          mobileNumber: userData.mobileNumber,
          role: userData.role,
          status: userData.status
        }
        response = await axios.post('api/user', payload)

        if (response.data.status) {
          setUserList((prev)=>[...prev,response.data.data])
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setShowForm(false)
      setEditingUser(null)
    }
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingUser(null)
  }

  return (
    <DashboardLayout activeTab="users">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {user?.role === "admin" ? "User Management" : "My Students"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {user?.role === "admin"
                ? "Manage all platform users and their permissions"
                : "View and manage your enrolled students"}
            </p>
          </div>

          {user?.role === "admin" && (
            <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          )}
        </div>

        {user?.role === "admin" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{countList && countList.total}</div>
                <p className="text-xs text-primary">{countList && countList.activeUser} active</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Students</CardTitle>
                <GraduationCap className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{countList && countList.studentCount}</div>
                <p className="text-xs text-muted-foreground">Learning on platform</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Instructors</CardTitle>
                <UserCheck className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{countList && countList.instructorCount}</div>
                <p className="text-xs text-muted-foreground">Teaching courses</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Admins</CardTitle>
                <Shield className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{countList && countList.adminCount}</div>
                <p className="text-xs text-muted-foreground">Managing platform</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            {user?.role === "admin" && (
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                  <SelectItem value="instructor">Instructors</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
            )}

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
          </Badge>
          {searchTerm && <Badge variant="outline">Search: "{searchTerm}"</Badge>}
          {selectedRole !== "all" && <Badge variant="outline">Role: {selectedRole}</Badge>}
          {selectedStatus !== "all" && <Badge variant="outline">Status: {selectedStatus}</Badge>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredUsers.map((userProfile) => (
            <UserCard
              key={userProfile._id}
              user={userProfile}
              onEdit={handleEditUser}
              onViewProfile={handleViewProfile}
              onChangeStatus={handleChangeStatus}
              showActions={user?.role === "admin"}
            />
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <p className="text-lg mb-2">No users found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          </div>
        )}
      </div>

      {showForm && <UserForm user={editingUser} onSave={handleSaveUser} onCancel={handleCancelForm} />}
    </DashboardLayout>
  )
}
