"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { type User, type AuthState, authenticateUser } from "@/lib/auth"
import axios from 'axios';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  signUp: (name:string,email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE" }
  | { type: "LOGOUT" }

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true }
    case "LOGIN_SUCCESS":
      return { user: action.payload, isLoading: false }
    case "LOGIN_FAILURE":
      return { user: null, isLoading: false }
    case "LOGOUT":
      return { user: null, isLoading: false }
    default:
      return state
  }
}

const setUserCookie = (user: User | null) => {
  if (user) {
    document.cookie = `user=${JSON.stringify(user)}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
  } else {
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: false,
  })

  useEffect(() => {
    const savedUser = localStorage.getItem("courseapp_user")
    if (savedUser) {
      const user = JSON.parse(savedUser)
      dispatch({ type: "LOGIN_SUCCESS", payload: user })
      setUserCookie(user)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" })

    try {
      const payload={email,password}
      const response= await axios.post('/api/auth/login',payload);
      if(response.data.status){
        const user:User= response.data.data.user
        localStorage.setItem("courseapp_user", JSON.stringify(user))
        setUserCookie(user)
        dispatch({ type: "LOGIN_SUCCESS", payload: user })
        return true
      }else{
        dispatch({ type: "LOGIN_FAILURE" })
        return false
      }
      
    } catch (error) {
      console.error(error)
      return false;
    }
  }

  const signUp = async (name:string,email: string, password: string): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" })

    try {
      const payload={name,email,password}
      const response= await axios.post('/api/auth/resister',payload);
      if(response.data.status){
        const user:User= response.data.data.user
        localStorage.setItem("courseapp_user", JSON.stringify(user))
        setUserCookie(user)
        dispatch({ type: "LOGIN_SUCCESS", payload: user })
        return true
      }else{
        dispatch({ type: "LOGIN_FAILURE" })
        return false
      }
      
    } catch (error) {
      console.error(error)
      return false;
    }
  }

  // const signUp= async()

  const logout = () => {
    localStorage.removeItem("courseapp_user")
    setUserCookie(null)
    dispatch({ type: "LOGOUT" })
  }

  return <AuthContext.Provider value={{ ...state, login, logout,signUp }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
