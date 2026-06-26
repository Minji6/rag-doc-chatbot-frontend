"use client"

import ChatRoomItem from "@/app/chat/ChatRoomItem"
import NewChatButton from "@/app/chat/NewChatButton"

function Sidebar({ conversations = [], activeId, onSelectChat, onNewChat }) {
    const todayList    = conversations.filter(c => c.group === "today")
    const lastWeekList = conversations.filter(c => c.group === "lastWeek")

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <div className="sidebar-logo-avatar">청</div>
                <div>
                    <div className="sidebar-logo-title">청포도</div>
                    <div className="sidebar-logo-sub">청년정책 AI 챗봇</div>
                </div>
            </div>

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
