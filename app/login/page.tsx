"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, GraduationCap } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from 'axios'

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Prevent the default form submission
    setError("")
    console.log(email, password)

    const success = await login(email, password)
    if (success) {
      router.push("/dashboard")
    } else {
      setError("Invalid email or password")
    }
  }

  const handleDemoLogin = async(demoEmail: string, demoPassword: string) => {
     const success = await login(demoEmail, demoPassword)
    if (success) {
      router.push("/dashboard")
    } else {
      setError("Invalid email or password")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">EduMentor AI</h1>
          <p className="text-muted-foreground mt-2">The intelligent platform for modern learning</p>
        </div>
        

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign in</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access your courses</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>
              {error && <div className="text-destructive text-sm text-center">{error}</div>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/50">
              <p className="text-sm text-muted-foreground mb-2">Demo credentials:</p>
              <div className="text-xs space-y-1 text-muted-foreground">
                <div>
                  <div>Admin: admin@courseapp.com / password</div>
                  <Button
                    onClick={() => {
                      setEmail("admin@courseapp.com")
                      setPassword("password")
                      handleDemoLogin("admin@courseapp.com", "password")
                    }}
                    className="cursor-pointer w-full mt-2"
                    variant="outline"
                  >
                    Login with Admin
                  </Button>
                </div>
                <div>
                  <div>Instructor: instructor@courseapp.com / password</div>
                  <Button
                    onClick={() => {
                      setEmail("instructor@courseapp.com");
                      setPassword("password");
                      handleDemoLogin("instructor@courseapp.com", "password")
                    }}
                    className=" w-full mt-2 cursor-pointer"
                    variant="outline"
                  >
                    Login with Instructor
                  </Button>
                </div>
                <div>
                  <div>Student: student@courseapp.com / password</div>
                  <Button
                    onClick={() => {
                      setEmail("student@courseapp.com");
                      setPassword("password");
                      handleDemoLogin("student@courseapp.com", "password")
                    }}
                    className=" w-full mt-2 cursor-pointer"
                    variant="outline"
                  >
                    Login with Student
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
