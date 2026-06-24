"use client"

function Sidebar({ conversations = [], activeId, onSelectChat, onNewChat }) {
    // 날짜 그룹 분리
    const todayList = conversations.filter(c => c.group === "today");
    const lastWeekList = conversations.filter(c => c.group === "lastWeek");

    return (
        <div className="sidebar">
            {/* 로고 영역 */}
            <div className="sidebar-logo">
                <div className="sidebar-logo-avatar">정</div>
                <div>
                    <div className="sidebar-logo-title">정책나침반</div>
                    <div className="sidebar-logo-sub">청년정책 AI 도우미</div>
                </div>
            </div>

            {/* 새 대화 시작 버튼 */}
            <button className="btn new-chat-btn w-100" onClick={onNewChat}>
                + 새 대화 시작
            </button>

            {/* 대화 목록 */}
            <div className="sidebar-chat-list">
                {todayList.length > 0 && (
                    <div>
                        <div className="sidebar-date-label">오늘</div>
                        {todayList.map(c => (
                            <div
                                key={c.id}
                                className={`sidebar-chat-item ${c.id === activeId ? "active" : ""}`}
                                onClick={() => onSelectChat(c.id)}
                            >
                                {c.title}
                            </div>
                        ))}
                    </div>
                )}
                {lastWeekList.length > 0 && (
                    <div>
                        <div className="sidebar-date-label">지난 7일</div>
                        {lastWeekList.map(c => (
                            <div
                                key={c.id}
                                className={`sidebar-chat-item ${c.id === activeId ? "active" : ""}`}
                                onClick={() => onSelectChat(c.id)}
                            >
                                {c.title}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 하단 상태 표시 */}
            <div className="sidebar-footer">
                <span className="sidebar-online-dot"></span>
                전국 청년정책 4,200+ 연동
            </div>
        </div>
    );
}

export default Sidebar;
