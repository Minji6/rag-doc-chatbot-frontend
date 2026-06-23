"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"

export default function UserDropdown() {
  const { users, currentUser, selectUser, clearUser } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (user) => {
    selectUser(user)
    setIsOpen(false)
  }

  const handleClear = () => {
    clearUser()
    setIsOpen(false)
  }

  return (
    <div className="user-dropdown" ref={ref}>
      <button
        className="user-dropdown-btn"
        onClick={() => setIsOpen(prev => !prev)}
      >
        {currentUser ? currentUser.nickname : "게스트"}
        <span className="dropdown-arrow">▾</span>
      </button>

      {isOpen && (
        <ul className="user-dropdown-menu">
          {users.map(user => (
            <li key={user.user_id}>
              <button
                className={`user-dropdown-item ${currentUser?.user_id === user.user_id ? "active" : ""}`}
                onClick={() => handleSelect(user)}
              >
                {user.nickname}
              </button>
            </li>
          ))}
          <li className="dropdown-divider" />
          <li>
            <button
              className="user-dropdown-item guest-item"
              onClick={handleClear}
            >
              게스트로 전환
            </button>
          </li>
        </ul>
      )}
    </div>
  )
}
