"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ChatInterface } from "@/components/chat-interface"
import { ChatSidebar } from "@/components/chat-sidebar"
import { Card } from "@/components/ui/card"
import { getChatSessionsByUser, createChatSession, type ChatSession } from "@/lib/ai-mentor"
import { Bot, Sparkles, BookOpen, MessageSquare } from "lucide-react"

export default function AIMentorPage() {
  const { user } = useAuth()
  const [selectedSessionId, setSelectedSessionId] = useState<string | undefined>()
  const [sessions, setSessions] = useState<ChatSession[]>(user ? getChatSessionsByUser(user._id) : [])

  if (!user) {
    return (
      <DashboardLayout activeTab="ai-mentor">
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <p className="text-lg mb-2">Please sign in</p>
            <p className="text-sm">You need to be signed in to use the AI Mentor</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const selectedSession = sessions.find((s) => s.id === selectedSessionId)

  const handleNewChat = () => {
    const newSession = createChatSession(user._id, "New Conversation")
    setSessions((prev) => [newSession, ...prev])
    setSelectedSessionId(newSession.id)
  }

  const handleSessionSelect = (sessionId: string) => {
    setSelectedSessionId(sessionId)
  }

  const handleMessageSent = () => {
    // Refresh sessions to get updated message count
    setSessions(getChatSessionsByUser(user._id))
  }

  return (
    <DashboardLayout activeTab="ai-mentor">
      <div className="h-[calc(100vh-2rem)] flex flex-col">
        {/* Page Header */}
        <div className="mb-1">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">AI Mentor</h1>
              <p className="text-muted-foreground">Get personalized help with your learning journey</p>
            </div>
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="flex-1 flex rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
          {/* Chat Sidebar */}
          <ChatSidebar
            selectedSessionId={selectedSessionId}
            onSessionSelect={handleSessionSelect}
            onNewChat={handleNewChat}
          />

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedSession ? (
              <ChatInterface
                sessionId={selectedSession.id}
                courseId={"2"}
                initialMessages={selectedSession.messages}
                onMessageSent={handleMessageSent}
              />
            ) : (
              /* Welcome Screen */
              <div className="flex-1 flex items-center justify-center p-2">
                <div className="text-center max-w-md">
                  <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 inline-block mb-2">
                    <Bot className="h-12 w-12 text-primary" />
                  </div>

                  <h2 className="text-2xl font-bold text-foreground mb-4">Welcome to AI Mentor</h2>

                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Your personal AI assistant for learning. Get instant help with course content, coding questions, and
                    study guidance tailored to your enrolled courses.
                  </p>

                  {/* Features */}
                  <div className="grid grid-cols-1 gap-4 mb-2">
                    <Card className="p-4 bg-card/50 border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="p-1 rounded-lg bg-primary/10">
                          <BookOpen className="h-4 w-4 text-primary" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-medium text-foreground">Course-Specific Help</h3>
                          <p className="text-xs text-muted-foreground">Get answers tailored to your enrolled courses</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-2 bg-card/50 border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="p-1 rounded-lg bg-primary/10">
                          <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-medium text-foreground">Instant Responses</h3>
                          <p className="text-xs text-muted-foreground">Get immediate help 24/7 with your questions</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-2 bg-card/50 border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <MessageSquare className="h-4 w-4 text-primary" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-medium text-foreground">Conversation History</h3>
                          <p className="text-xs text-muted-foreground">Access your previous conversations anytime</p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Start a new conversation to begin getting help with your studies
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
