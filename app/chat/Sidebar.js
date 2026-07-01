"use client"

import { useState } from "react"
import Image from "next/image"

function Sidebar({ conversations = [], activeId, onSelectChat, onNewChat, onDeleteChat }) {
    const [logoOk, setLogoOk] = useState(true)

    return (
        <div className="sidebar">
            <button className="sidebar-logo" onClick={onNewChat}>
                {logoOk ? (
                    <Image
                        src="/letter-logo2.png"
                        alt="청포도"
                        width={748}
                        height={333}
                        className="sidebar-letter-logo"
                        onError={() => setLogoOk(false)}
                    />
                ) : (
                    <>
                        <Image src="/cheongpodo-bot.png" alt="청포도" width={38} height={38} className="sidebar-logo-img" />
                        <div>
                            <div className="sidebar-logo-title">청포도</div>
                            <div className="sidebar-logo-sub">청년정책 AI 챗봇</div>
                        </div>
                    </>
                )}
            </button>

            <button className="btn new-chat-btn w-100" onClick={onNewChat}>
                + 새 대화 시작
            </button>

            <div className="sidebar-chat-list">
                {conversations.length === 0 ? (
                    <div className="sidebar-empty">대화 기록이 없습니다</div>
                ) : (
                    conversations.map(c => (
                        <div
                            key={c.conversation_id}
                            className={`sidebar-chat-item ${c.conversation_id === activeId ? "active" : ""}`}
                            onClick={() => onSelectChat(c.conversation_id)}
                        >
                            <span className="sidebar-chat-title">
                                {c.title || "새 대화"}
                            </span>
                            <button
                                className="sidebar-chat-delete-btn"
                                onClick={e => { e.stopPropagation(); onDeleteChat(c.conversation_id) }}
                            >✕</button>
                        </div>
                    ))
                )}
            </div>

            <div className="sidebar-footer">
                <span className="sidebar-online-dot"></span>
                전국 청년정책 4,200+ 연동
            </div>
        </div>
    )
}

export default Sidebar
