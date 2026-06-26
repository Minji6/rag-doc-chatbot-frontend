"use client"

import { createContext, useContext, useState } from "react"

const USERS = [
  { user_id: 1, nickname: "김청년",   sub: "25세 · 서울 · 사회초생" },
  { user_id: 2, nickname: "이햇살",   sub: "23세 · 부산 · 대학 재학" },
  { user_id: 3, nickname: "박도전",   sub: "29세 · 대전 · 구직 중" },
  { user_id: 4, nickname: "느린걸음", sub: null },
  { user_id: 5, nickname: "달리는청춘", sub: null },
]

const AuthContext = createContext(null)

export function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(USERS[0])

  return (
    <AuthContext.Provider value={{
      users: USERS,
      currentUser,
      selectUser: (user) => setCurrentUser(user),
      clearUser: () => setCurrentUser(null),
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
