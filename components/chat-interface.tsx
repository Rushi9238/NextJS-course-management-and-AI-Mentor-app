"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Sparkles, BookOpen, Clock } from "lucide-react"
import { type ChatMessage, generateAIResponse, getSuggestedPrompts } from "@/lib/ai-mentor"
import { useAuth } from "@/contexts/auth-context"
import axios from "axios"

interface ChatInterfaceProps {
  sessionId?: string
  courseId?: string
  initialMessages?: ChatMessage[]
  onMessageSent?: (message: ChatMessage) => void
}

export function ChatInterface({ sessionId, courseId, initialMessages = [], onMessageSent }: ChatInterfaceProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const suggestedPrompts = getSuggestedPrompts(courseId)

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date().toISOString(),
      courseContext: courseId ? "Current Course" : undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      // Generate AI response
      // const aiResponse = await generateAIResponse(content, { courseId })
      const payload={
        prompt:content
      }
      const aiResponse:any = await axios.post('/api/chat',payload,{
         withCredentials: true
      })
//       const aiResponse = {
//     "response": "Optimizing React component performance involves a multi-pronged approach focusing on minimizing re-renders, efficiently managing state, and optimizing the rendering process itself. Here's a breakdown of key strategies:\n\n**1. Prevent Unnecessary Re-renders:**\n\n* **`useMemo` and `useCallback`:** These Hooks are crucial for memoizing expensive computations and callbacks.  `useMemo` returns a memoized value, only recalculating when dependencies change. `useCallback` returns a memoized callback, preventing unnecessary recreations and thus re-renders of child components.\n\n```javascript\nimport React, { useMemo, useCallback, useState } from 'react';\n\nfunction MyComponent() {\n  const [count, setCount] = useState(0);\n  const [name, setName] = useState('');\n\n  // Memoize the expensive calculation\n  const expensiveCalculation = useMemo(() => {\n    // Simulate an expensive operation\n    let result = 0;\n    for (let i = 0; i < 1000000; i++) {\n      result += i;\n    }\n    return result;\n  }, []); // Empty dependency array means it only calculates once\n\n  // Memoize the callback\n  const handleClick = useCallback(() => {\n    setCount(count + 1);\n  }, [count]); // Dependency array includes count, recalculates only when count changes\n\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <p>Result: {expensiveCalculation}</p>\n      <button onClick={handleClick}>Increment</button>\n      <input type=\"text\" value={name} onChange={e => setName(e.target.value)} />\n      {/* Child components will receive the memoized handleClick */}\n      <ChildComponent handleClick={handleClick} />\n    </div>\n  );\n}\n\nfunction ChildComponent({ handleClick }) {\n    return <button onClick={handleClick}>Increment from Child</button>\n}\n```\n\n* **`React.memo`:** This higher-order component memoizes the component itself. It prevents re-rendering if the props haven't changed using a shallow comparison.  Use this judiciously; it adds overhead.\n\n```javascript\nconst MemoizedComponent = React.memo(MyComponent);\n```\n\n* **Pure Components:**  A legacy approach (generally replaced by `React.memo`),  `React.PureComponent` performs a shallow comparison of props and state.  It's less flexible than `React.memo`.\n\n* **Conditional Rendering:** Only render components when necessary.  Use conditional statements (`if`, `&&`, ternary operator) to avoid rendering unnecessary parts of the UI.\n\n* **Keys for Lists:**  When rendering lists, provide unique `key` props to each item. This helps React efficiently update the list by identifying changes and reusing existing elements.\n\n**2. Optimize State Management:**\n\n* **Avoid unnecessary state updates:**  Only update state when absolutely necessary.  Batch state updates when possible to minimize re-renders.  Consider using libraries like Redux, Zustand, Jotai, or Recoil for complex state management, offering better performance and predictability in larger applications.\n\n* **Immutable updates:**  When updating state, create new objects or arrays instead of modifying existing ones directly. This helps React detect changes more efficiently.  Use spread syntax (`...`) or libraries like Immer to achieve this.\n\n**3. Optimize Rendering Process:**\n\n* **Virtualization:** For large lists, consider using virtualization libraries like `react-window` or `react-virtualized`. These libraries only render the visible items, significantly improving performance.\n\n* **Code splitting:** Break down your application into smaller chunks that are loaded on demand. This reduces the initial load time and improves the perceived performance.  Webpack and other bundlers facilitate this.\n\n* **Lazy Loading:** Load components only when needed, using dynamic imports (`import()`).  This improves initial load time.\n\n* **Profiling:** Use React's Profiler tool or browser developer tools (like Chrome's performance profiler) to identify performance bottlenecks in your application. This will pinpoint which components are causing re-renders and help you prioritize optimization efforts.\n\n**4. Optimize Images:**\n\n* **Use optimized image formats:** Consider using WebP, AVIF, or other modern formats for better compression and quality.\n\n* **Lazy loading images:** Only load images when they are visible in the viewport.  This improves initial load time and reduces bandwidth consumption.\n\n* **Image optimization tools:** Utilize tools to compress and optimize images before deployment.\n\n\n**Example of Lazy Loading:**\n\n```javascript\nconst MyComponent = React.lazy(() => import('./MyComponent'));\n\nfunction App() {\n  return (\n    <div>\n      <React.Suspense fallback={<div>Loading...</div>}>\n        <MyComponent />\n      </React.Suspense>\n    </div>\n  );\n}\n```\n\nBy systematically applying these strategies, you can significantly improve the performance of your React components, leading to a smoother and more responsive user experience. Remember to profile your application to identify specific areas for optimization.\n"
// }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse.data.response,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Notify parent component
      onMessageSent?.(assistantMessage)
    } catch (error) {
      console.error("Error generating AI response:", error)

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage(inputValue)
  }

  const handleSuggestedPrompt = (prompt: string) => {
    handleSendMessage(prompt)
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-full overflow-scroll">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border/50">
        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
          <Bot className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">AI Mentor</h3>
          <p className="text-xs text-muted-foreground">
            {courseId ? "Course-specific assistance" : "General learning support"}
          </p>
        </div>
        <div className="ml-auto">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <Sparkles className="h-3 w-3 mr-1" />
            Online
          </Badge>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4" >
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 inline-block mb-4">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Welcome to your AI Mentor!</h4>
              <p className="text-muted-foreground mb-4">
                I'm here to help you with your learning journey. Ask me anything about your courses!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto">
                {suggestedPrompts.slice(0, 4).map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestedPrompt(prompt)}
                    className="text-xs h-auto py-2 px-3 text-left whitespace-normal"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div className={`max-w-[80%] ${message.role === "user" ? "order-first" : ""}`}>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-muted/50 text-foreground"
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>

                  {message.courseContext && (
                    <div className="flex items-center gap-1 mt-2 pt-2 border-t border-border/20">
                      <BookOpen className="h-3 w-3 opacity-60" />
                      <span className="text-xs opacity-60">{message.courseContext}</span>
                    </div>
                  )}
                </div>

                <div
                  className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <Clock className="h-3 w-3" />
                  {formatTime(message.timestamp)}
                </div>
              </div>

              {message.role === "user" && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8 mt-1">
                <AvatarFallback className="bg-primary/10 text-primary">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted/50 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                  <span className="text-xs text-muted-foreground">AI Mentor is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border/50">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything about your courses..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={!inputValue.trim() || isLoading} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>

        <p className="text-xs text-muted-foreground mt-2 text-center">
          AI Mentor can make mistakes. Verify important information with your course materials.
        </p>
      </div>
    </div>
  )
}
