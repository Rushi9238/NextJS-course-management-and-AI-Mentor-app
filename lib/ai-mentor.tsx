"use client"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  courseContext?: string
  lessonContext?: string
}

export interface ChatSession {
  id: string
  userId: string
  title: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
  courseId?: string
  status: "active" | "archived"
}

// Mock chat sessions
export const mockChatSessions: ChatSession[] = [
  {
    id: "1",
    userId: "3",
    title: "JavaScript Variables Help",
    messages: [
      {
        id: "1",
        role: "user",
        content: "Can you explain the difference between let, const, and var in JavaScript?",
        timestamp: "2024-03-15T10:30:00Z",
        courseContext: "JavaScript Fundamentals",
        lessonContext: "Variables and Data Types",
      },
      {
        id: "2",
        role: "assistant",
        content:
          'Great question! Let me explain the key differences between these three ways to declare variables in JavaScript:\n\n**var:**\n- Function-scoped or globally-scoped\n- Can be redeclared and updated\n- Hoisted to the top of their scope\n- Can lead to unexpected behavior\n\n**let:**\n- Block-scoped\n- Can be updated but not redeclared in the same scope\n- Not hoisted (temporal dead zone)\n- Modern and preferred for variables that change\n\n**const:**\n- Block-scoped\n- Cannot be updated or redeclared\n- Must be initialized when declared\n- Use for values that won\'t change\n\nExample:\n```javascript\nconst name = "John"; // Won\'t change\nlet age = 25; // Might change\nvar oldStyle = "avoid"; // Avoid using\n```\n\nWould you like me to explain any of these concepts in more detail?',
        timestamp: "2024-03-15T10:30:30Z",
      },
    ],
    createdAt: "2024-03-15T10:30:00Z",
    updatedAt: "2024-03-15T10:30:30Z",
    courseId: "1",
    status: "active",
  },
  {
    id: "2",
    userId: "3",
    title: "React Components Question",
    messages: [
      {
        id: "3",
        role: "user",
        content: "What's the difference between functional and class components in React?",
        timestamp: "2024-03-14T15:20:00Z",
        courseContext: "React Advanced Patterns",
      },
      {
        id: "4",
        role: "assistant",
        content:
          "Excellent question! Here are the main differences:\n\n**Functional Components:**\n- Simpler syntax\n- Use React Hooks for state and lifecycle\n- Better performance\n- Easier to test\n- Modern React approach\n\n**Class Components:**\n- More verbose syntax\n- Use this.state and lifecycle methods\n- Legacy approach (still supported)\n- More complex\n\nExample of functional component:\n```jsx\nfunction Welcome({ name }) {\n  const [count, setCount] = useState(0);\n  \n  return <h1>Hello, {name}!</h1>;\n}\n```\n\nFunctional components with hooks are now the recommended approach. Are you working on converting class components to functional ones?",
        timestamp: "2024-03-14T15:20:45Z",
      },
    ],
    createdAt: "2024-03-14T15:20:00Z",
    updatedAt: "2024-03-14T15:20:45Z",
    courseId: "2",
    status: "active",
  },
]

// AI Mentor utilities
export const getChatSessionsByUser = (userId: string): ChatSession[] => {
  return mockChatSessions.filter((session) => session.userId === userId)
}

export const createChatSession = (userId: string, title: string, courseId?: string): ChatSession => {
  const newSession: ChatSession = {
    id: Date.now().toString(),
    userId,
    title,
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    courseId,
    status: "active",
  }

  mockChatSessions.push(newSession)
  return newSession
}

export const addMessageToSession = (sessionId: string, message: Omit<ChatMessage, "id" | "timestamp">): ChatMessage => {
  const session = mockChatSessions.find((s) => s.id === sessionId)
  if (!session) throw new Error("Session not found")

  const newMessage: ChatMessage = {
    ...message,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
  }

  session.messages.push(newMessage)
  session.updatedAt = new Date().toISOString()

  return newMessage
}

// Mock AI response generation
export const generateAIResponse = async (
  userMessage: string,
  context?: { courseId?: string; lessonId?: string },
): Promise<string> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

  // Mock responses based on keywords
  const message = userMessage.toLowerCase()

  if (message.includes("javascript") || message.includes("js")) {
    return `Great question about JavaScript! Based on your current progress in the JavaScript Fundamentals course, I can help you understand this concept better.\n\nJavaScript is a versatile programming language that's essential for web development. ${message.includes("variable") ? "Variables are containers for storing data values. You can declare them using let, const, or var." : message.includes("function") ? "Functions are reusable blocks of code that perform specific tasks. You can define them using function declarations, expressions, or arrow functions." : "Let me know what specific aspect you'd like to explore!"}\n\nWould you like me to provide some code examples or explain any related concepts?`
  }

  if (message.includes("react")) {
    return `Excellent React question! React is a powerful library for building user interfaces.\n\n${message.includes("component") ? "Components are the building blocks of React applications. They let you split the UI into independent, reusable pieces." : message.includes("hook") ? "Hooks are functions that let you use state and other React features in functional components." : "React follows a component-based architecture that makes building complex UIs manageable."}\n\nBased on your enrollment in the React Advanced Patterns course, I can provide more specific guidance. What would you like to dive deeper into?`
  }

  if (message.includes("design") || message.includes("ui") || message.includes("ux")) {
    return `Great design question! User experience and interface design are crucial for creating successful applications.\n\n${message.includes("color") ? "Color theory is fundamental in design. Colors can evoke emotions, create hierarchy, and improve usability." : message.includes("layout") ? "Layout design involves organizing elements to create visual hierarchy and guide user attention." : "Good design balances aesthetics with functionality to create intuitive user experiences."}\n\nSince you're studying UI/UX Design Principles, I can help you apply these concepts to your projects. What specific design challenge are you working on?`
  }

  // Generic helpful response
  return `I'm here to help with your learning journey! Based on your question, I can provide guidance and explanations tailored to your current courses.\n\nCould you provide a bit more context about what you're trying to understand or accomplish? This will help me give you more specific and useful assistance.\n\nI can help with:\n- Explaining concepts from your enrolled courses\n- Providing code examples and best practices\n- Suggesting learning resources\n- Answering questions about assignments\n- Clarifying difficult topics\n\nWhat would you like to explore?`
}

// Suggested prompts for different contexts
export const getSuggestedPrompts = (courseId?: string) => {
  const generalPrompts = [
    "How can I improve my coding skills?",
    "What should I focus on next in my learning?",
    "Can you recommend some practice exercises?",
    "How do I stay motivated while learning?",
  ]

  if (courseId === "1") {
    // JavaScript Fundamentals
    return [
      "Explain JavaScript closures with examples",
      "What are the different data types in JavaScript?",
      "How do I handle errors in JavaScript?",
      "What's the difference between == and === in JavaScript?",
    ]
  }

  if (courseId === "2") {
    // React Advanced Patterns
    return [
      "How do I optimize React component performance?",
      "Explain the useEffect hook with examples",
      "What are React design patterns I should know?",
      "How do I manage state in large React applications?",
    ]
  }

  if (courseId === "3") {
    // UI/UX Design
    return [
      "What are the principles of good UI design?",
      "How do I choose the right color palette?",
      "What's the difference between UI and UX?",
      "How do I create accessible designs?",
    ]
  }

  return generalPrompts
}
