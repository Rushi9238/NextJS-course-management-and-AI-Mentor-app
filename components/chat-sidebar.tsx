"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Plus, MessageSquare, Clock, BookOpen, MoreVertical } from "lucide-react"
import { type ChatSession, getChatSessionsByUser } from "@/lib/ai-mentor"
import { useAuth } from "@/contexts/auth-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import axios from "axios"

interface ChatSidebarProps {
  selectedSessionId?: string
  onSessionSelect: (sessionId: string) => void
  onNewChat: () => void
}

interface Session{
  _id:string,
  prompt:string,
  response:string,
  createdAt:string
}

export function ChatSidebar({ selectedSessionId, onSessionSelect, onNewChat }: ChatSidebarProps) {
  const { user } = useAuth()
  // const [sessions] = useState<ChatSession[]>(user ? getChatSessionsByUser(user._id) : [])
  const [sessions,setSessions]=useState<Session[]>([])

  useEffect(()=>{
    getUserSessionChat()
  },[])

  const getUserSessionChat= async()=>{
    try {
      const response=await axios.get(`/api/chat?userId=${user?._id}`)
      if(response.data.status){
        setSessions(response.data.history)
      }
    } catch (error) {
      console.log(error)
    }
  }


  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Today"
    if (diffDays === 2) return "Yesterday"
    if (diffDays <= 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const handleArchiveSession = (sessionId: string) => {
    console.log("Archive session:", sessionId)
    // In a real app, this would update the session status
  }

  const handleDeleteSession = (sessionId: string) => {
    console.log("Delete session:", sessionId)
    // In a real app, this would delete the session
  }

  return (
    <div className="w-80 border-r border-border/50 bg-card/30 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Chat History</h2>
          <Button onClick={onNewChat} size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageSquare className="h-4 w-4" />
          <span>
            {sessions.length} conversation{sessions.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {sessions.length === 0 ? (
            <div className="text-center py-8 px-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground mb-2">No conversations yet</p>
              <p className="text-xs text-muted-foreground">Start a new chat to get help with your courses</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.map((session) => (
                <div
                  key={session._id}
                  className={`group relative rounded-lg border transition-colors cursor-pointer ${
                    selectedSessionId === session._id
                      ? "bg-primary/10 border-primary/20 text-primary"
                      : "bg-card/50 border-border/50 hover:bg-card/70 text-foreground"
                  }`}
                  onClick={() => onSessionSelect(session._id)}
                >
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-medium text-sm line-clamp-2 text-balance">{session.prompt}</h3>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleArchiveSession(session._id)}>Archive</DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteSession(session._id)}
                            className="text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Clock className="h-3 w-3" />
                      {formatDate(session.createdAt)}
                      <span>•</span>
                      <span>
                        {session.response.length} message{session.response.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* {session.courseId && (
                      <div className="flex items-center gap-1">
                        <Badge variant="secondary" className="text-xs">
                          <BookOpen className="h-3 w-3 mr-1" />
                          Course Context
                        </Badge>
                      </div>
                    )} */}

                    {/* {session.response.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        {session.response[session.response.length - 1].content}
                      </p>
                    )} */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
