"use client"

import Image from "next/image"

function Sidebar({ conversations = [], activeId, onSelectChat, onNewChat, onDeleteChat }) {
    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <Image src="/cheongpodo.png" alt="청포도" width={38} height={38} className="sidebar-logo-img" />
                <div>
                    <div className="sidebar-logo-title">청포도</div>
                    <div className="sidebar-logo-sub">청년정책 AI 친구·청포리</div>
                </div>
            </div>

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
                                {c.conversation_id.slice(0, 18)}…
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
