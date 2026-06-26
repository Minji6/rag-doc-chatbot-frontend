"use client"

import Image from "next/image"
import ChatRoomItem from "@/app/chat/ChatRoomItem"
import NewChatButton from "@/app/chat/NewChatButton"

function Sidebar({ conversations = [], activeId, onSelectChat, onNewChat }) {
    const todayList    = conversations.filter(c => c.group === "today")
    const lastWeekList = conversations.filter(c => c.group === "lastWeek")

    return (
        <div className="sidebar">
            {/* 로고 클릭 → 새 대화(홈)으로 */}
            <button className="sidebar-logo" onClick={onNewChat}>
                <Image
                    src="/logo.png"
                    alt="청포도"
                    width={38}
                    height={38}
                    className="sidebar-logo-img"
                />
                <div>
                    <div className="sidebar-logo-title">청포도</div>
                    <div className="sidebar-logo-sub">청년정책 AI 챗봇</div>
                </div>
            </button>

            <NewChatButton onClick={onNewChat} />

            <div className="sidebar-chat-list">
                {todayList.length > 0 && (
                    <div>
                        <div className="sidebar-date-label">오늘</div>
                        {todayList.map(c => (
                            <ChatRoomItem
                                key={c.id}
                                conversation={c}
                                isActive={c.id === activeId}
                                onClick={onSelectChat}
                            />
                        ))}
                    </div>
                )}
                {lastWeekList.length > 0 && (
                    <div>
                        <div className="sidebar-date-label">지난 7일</div>
                        {lastWeekList.map(c => (
                            <ChatRoomItem
                                key={c.id}
                                conversation={c}
                                isActive={c.id === activeId}
                                onClick={onSelectChat}
                            />
                        ))}
                    </div>
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
