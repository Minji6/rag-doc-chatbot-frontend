"use client"

import { useState } from "react"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import UserProfileModal from "@/app/user/UserProfileModal"
import memberApi from "@/apis/memberApi"

export default function UserDropdown() {
  const { users, currentUser, selectUser, clearUser, deleteUser, refreshUsers } = useAuth()
  const [showModal, setShowModal] = useState(false)

  const handleSelectUser = (user) => {
    if (user) selectUser(user)
    else clearUser()
    setShowModal(false)
  }

  const handleCreateUser = async (userData) => {
    try {
      await memberApi.createUser(userData)
      await refreshUsers()
    } catch (err) {
      console.error("유저 생성 실패", err)
      throw err
    }
  }

  const handleDeleteUser = async (userId) => {
    await deleteUser(userId)
  }

  return (
    <>
      <button className="user-dropdown-btn" onClick={() => setShowModal(true)}>
        <Image
          src="/cheongpodo.png"
          alt="avatar"
          width={26}
          height={26}
          className="user-dropdown-avatar"
        />
        {currentUser ? currentUser.nickname : "게스트"}
        <span className="dropdown-arrow">▾</span>
      </button>

      {showModal && (
        <UserProfileModal
          users={users}
          onSelectUser={handleSelectUser}
          onCreateUser={handleCreateUser}
          onDeleteUser={handleDeleteUser}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
