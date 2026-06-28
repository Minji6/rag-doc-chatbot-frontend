"use client"

import { useState } from "react"
import { useSavedPolicies } from "@/contexts/SavedPoliciesContext"
import {
    categoryStyle,
    getDeadlineDate,
    getDdayInfo,
    getDdayNumber,
    getUrgencyLevel,
    URGENCY,
} from "@/utils/policy"

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"]

// 임박도 우선순위 — 같은 날 여러 정책이 겹치면 더 급한 색을 표시.
const URGENCY_RANK = { urgent: 0, soon: 1, relaxed: 2, always: 3 }

function moreUrgent(a, b) {
    if (!a) return b
    return URGENCY_RANK[b] < URGENCY_RANK[a] ? b : a
}

/** "2월 14일 마감" 또는 상시. */
function deadlineLabel(policy) {
    const date = getDeadlineDate(policy)
    if (!date) return "상시 모집"
    return `${date.getMonth() + 1}월 ${date.getDate()}일 마감`
}

function startOfThisMonth() {
    const d = new Date()
    d.setDate(1)
    d.setHours(0, 0, 0, 0)
    return d
}

/** 마감 임박순 정렬 — 남은 일수 오름차순, 상시(null)는 맨 뒤. */
function byDeadline(a, b) {
    const da = getDdayNumber(a)
    const db = getDdayNumber(b)
    if (da === null && db === null) return 0
    if (da === null) return 1
    if (db === null) return -1
    return da - db
}

function SavedPolicyItem({ policy, onRemove }) {
    const style = categoryStyle(policy.category)
    const level = getUrgencyLevel(policy)
    const { color } = URGENCY[level]
    const dday = getDdayInfo(policy)

    return (
        <div className="calendar-policy-item" style={{ borderLeftColor: color }}>
            <span className="calendar-policy-cat" style={{ background: style.bg, color: style.color }}>
                {policy.category || "정책"}
            </span>
            <div className="calendar-policy-main">
                <div className="calendar-policy-name">{policy.plcyNm}</div>
                <div className="calendar-policy-deadline">{deadlineLabel(policy)}</div>
            </div>
            {dday && (
                <span className="calendar-policy-dday" style={{ background: `${color}22`, color }}>
                    {dday.label}
                </span>
            )}
            <button className="calendar-policy-remove" onClick={() => onRemove(policy)}>✕</button>
        </div>
    )
}

function PolicyCalendar() {
    const { saved, isOpen, closeCalendar, remove } = useSavedPolicies()
    const [tab, setTab] = useState("deadline")   // "deadline" | "category"
    const [viewDate, setViewDate] = useState(startOfThisMonth)

    if (!isOpen) return null

    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const firstWeekday = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    // 이번 달에 마감이 걸린 날짜 → 임박도 색 (겹치면 더 급한 색).
    const deadlineByDay = {}
    saved.forEach((p) => {
        const d = getDeadlineDate(p)
        if (d && d.getFullYear() === year && d.getMonth() === month) {
            const day = d.getDate()
            deadlineByDay[day] = moreUrgent(deadlineByDay[day], getUrgencyLevel(p))
        }
    })

    const today = new Date()
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month
    const todayDate = today.getDate()

    const cells = [
        ...Array(firstWeekday).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ]

    const moveMonth = (delta) => setViewDate(new Date(year, month + delta, 1))

    const sorted = [...saved].sort(byDeadline)
    const grouped = saved.reduce((acc, p) => {
        const key = p.category || "기타"
        ;(acc[key] ||= []).push(p)
        return acc
    }, {})

    return (
        <div className="calendar-overlay" onClick={closeCalendar}>
            <aside className="calendar-panel" onClick={(e) => e.stopPropagation()}>
                <header className="calendar-header">
                    <div className="calendar-header-title">
                        <span className="calendar-header-icon">📅</span>
                        <div>
                            <h3>정책 캘린더</h3>
                            <p>저장한 정책 마감일을 한눈에</p>
                        </div>
                    </div>
                    <button className="modal-close-btn" onClick={closeCalendar}>✕</button>
                </header>

                <div className="calendar-tabs">
                    <button
                        className={`calendar-tab ${tab === "deadline" ? "active" : ""}`}
                        onClick={() => setTab("deadline")}
                    >마감 임박순</button>
                    <button
                        className={`calendar-tab ${tab === "category" ? "active" : ""}`}
                        onClick={() => setTab("category")}
                    >분야별</button>
                </div>

                <div className="calendar-month-nav">
                    <button onClick={() => moveMonth(-1)}>‹</button>
                    <span>{year}년 {month + 1}월</span>
                    <button onClick={() => moveMonth(1)}>›</button>
                </div>

                <div className="calendar-grid">
                    {WEEKDAYS.map((w) => (
                        <div key={w} className="calendar-weekday">{w}</div>
                    ))}
                    {cells.map((day, i) => {
                        if (day === null) return <div key={`b${i}`} className="calendar-cell empty" />
                        const level = deadlineByDay[day]
                        const isToday = isCurrentMonth && day === todayDate
                        return (
                            <div key={day} className={`calendar-cell ${isToday ? "today" : ""}`}>
                                <span>{day}</span>
                                {level && (
                                    <span className="calendar-dot" style={{ background: URGENCY[level].color }} />
                                )}
                            </div>
                        )
                    })}
                </div>

                <div className="calendar-legend">
                    {Object.entries(URGENCY).map(([key, { label, color }]) => (
                        <span key={key} className="calendar-legend-item">
                            <span className="calendar-legend-dot" style={{ background: color }} />
                            {label}{key === "urgent" ? " D-7" : key === "soon" ? " D-21" : ""}
                        </span>
                    ))}
                </div>

                <div className="calendar-saved">
                    <div className="calendar-saved-title">저장한 정책 {saved.length}</div>
                    {saved.length === 0 ? (
                        <div className="calendar-empty">상세 보기에서 정책을 저장해 보세요.</div>
                    ) : tab === "deadline" ? (
                        sorted.map((p) => (
                            <SavedPolicyItem key={p.plcyNo ?? p.plcyNm} policy={p} onRemove={remove} />
                        ))
                    ) : (
                        Object.entries(grouped).map(([cat, list]) => (
                            <div key={cat} className="calendar-group">
                                <div className="calendar-group-title">{cat}</div>
                                {list.map((p) => (
                                    <SavedPolicyItem key={p.plcyNo ?? p.plcyNm} policy={p} onRemove={remove} />
                                ))}
                            </div>
                        ))
                    )}
                </div>
            </aside>
        </div>
    )
}

export default PolicyCalendar
