"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import memberApi from "@/apis/memberApi"

const AuthContext = createContext(null)

export function AuthContextProvider({ children }) {
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)

  const refreshUsers = useCallback(async () => {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await memberApi.getUsers()
        setUsers(res.data)
        return
      } catch (err) {
        if (attempt === 2) {
          console.error("유저 목록 조회 실패 (3회 시도)", err)
          return
        }
        // DB cold start 대기: 1초 → 2초 간격으로 재시도
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)))
      }
    }
  }, [])

  useEffect(() => { refreshUsers() }, [refreshUsers])

  const deleteUser = useCallback(async (userId) => {
    await memberApi.deleteUser(userId)
    setUsers(prev => prev.filter(u => u.user_id !== userId))
    setCurrentUser(prev => prev?.user_id === userId ? null : prev)
  }, [])

  return (
    <AuthContext.Provider value={{
      users,
      currentUser,
      selectUser:   (user) => setCurrentUser(user),
      clearUser:    () => setCurrentUser(null),
      refreshUsers,
      deleteUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
