"use client"

import { createContext, useContext, useState } from "react"

const USERS = [
  { user_id: 1,  nickname: "청년새싹" },
  { user_id: 2,  nickname: "하루살이" },
  { user_id: 3,  nickname: "별빛창업가" },
  { user_id: 4,  nickname: "느린걸음" },
  { user_id: 5,  nickname: "달리는청춘" },
  { user_id: 6,  nickname: "빛나는오늘" },
  { user_id: 7,  nickname: "바람개비" },
  { user_id: 8,  nickname: "자유로운삶" },
  { user_id: 9,  nickname: "행복한가정" },
  { user_id: 10, nickname: "씩씩한부모" },
]

const AuthContext = createContext(null)

export function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)

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
