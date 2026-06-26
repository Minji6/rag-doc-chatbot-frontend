"use client"

function Sidebar({ conversations = [], activeId, onSelectChat, onNewChat }) {
    const todayList = conversations.filter(c => c.group === "today");
    const lastWeekList = conversations.filter(c => c.group === "lastWeek");

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <img
                    src="/cheongpodo.png"
                    alt="청포도"
                    className="sidebar-logo-img"
                    onError={e => { e.target.style.display = "none"; }}
                />
                <div>
                    <div className="sidebar-logo-title">청포도</div>
                    <div className="sidebar-logo-sub">청년정책 AI 친구·청포리</div>
                </div>
            </div>

            <button className="btn new-chat-btn w-100" onClick={onNewChat}>
                + 새 대화 시작
            </button>

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

            <div className="sidebar-footer">
                <span className="sidebar-online-dot"></span>
                전국 청년정책 4,200+ 연동
            </div>
        </div>
    );
}

export default Sidebar;
