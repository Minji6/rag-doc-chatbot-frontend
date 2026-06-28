"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"
import {
    loadSavedPolicies,
    isPolicySaved,
    toggleSavedPolicy,
    removeSavedPolicy,
} from "@/utils/savedPolicies"

const SavedPoliciesContext = createContext(null)

/**
 * 저장한 정책(캘린더) 전역 상태.
 *
 * 저장 버튼(PolicyDetailModal), 헤더 배지(ChatWindow), 캘린더 패널(PolicyCalendar)이
 * 멀리 떨어져 있어 같은 목록·열림 상태를 공유해야 하므로 컨텍스트로 끌어올린다.
 * 유저 전환 시 해당 유저의 저장 목록을 다시 적재한다(게스트는 항상 빈 목록).
 */
export function SavedPoliciesProvider({ children }) {
    const { currentUser } = useAuth()
    const userId = currentUser?.user_id ?? null

    const [saved, setSaved] = useState([])
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        setSaved(loadSavedPolicies(userId))
        setIsOpen(false) // 유저가 바뀌면 패널을 닫는다
    }, [userId])

    const toggle = useCallback((policy) => {
        if (userId == null) return
        setSaved((prev) => toggleSavedPolicy(userId, prev, policy))
    }, [userId])

    const remove = useCallback((policy) => {
        if (userId == null) return
        setSaved((prev) => removeSavedPolicy(userId, prev, policy))
    }, [userId])

    const isSaved = useCallback((policy) => isPolicySaved(saved, policy), [saved])

    const openCalendar = useCallback(() => setIsOpen(true), [])
    const closeCalendar = useCallback(() => setIsOpen(false), [])

    return (
        <SavedPoliciesContext.Provider value={{
            saved,
            count: saved.length,
            isOpen,
            toggle,
            remove,
            isSaved,
            openCalendar,
            closeCalendar,
            // 캘린더는 유저 전용 — 게스트는 진입점(헤더 아이콘)을 숨긴다.
            enabled: userId != null,
        }}>
            {children}
        </SavedPoliciesContext.Provider>
    )
}

export function useSavedPolicies() {
    return useContext(SavedPoliciesContext)
}
