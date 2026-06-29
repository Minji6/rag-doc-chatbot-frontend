"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import memberApi from "@/apis/memberApi"
import { forgetUserTitles } from "@/utils/conversationStore"

const AuthContext = createContext(null)

export function AuthContextProvider({ children }) {
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)

  const refreshUsers = useCallback(async () => {
    try {
      const res = await memberApi.getUsers()
      setUsers(res.data)
    } catch (err) {
      console.error("유저 목록 조회 실패", err)
    }
  }, [])

  useEffect(() => { refreshUsers() }, [refreshUsers])

  const deleteUser = useCallback(async (userId) => {
    await memberApi.deleteUser(userId)
    forgetUserTitles(userId) // 계정 삭제 시 제목 캐시 잔류 방지
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
