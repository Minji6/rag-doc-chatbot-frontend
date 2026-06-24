const SUGGESTED_QUESTIONS = [
    {
        category: "복지문화",
        colorVar: "--color-welfare",
        bgVar: "--color-welfare-bg",
        icon: "💗",
        questions: [
            "청년 심리 지원 서비스가 있나요?",
            "취약계층 청년을 위한 복지 정책 알려줘",
        ],
    },
    {
        category: "주거",
        colorVar: "--color-housing",
        bgVar: "--color-housing-bg",
        icon: "🏠",
        questions: [
            "청년 전세 대출 지원 정책 알려줘",
            "공공임대주택 신청 방법이 궁금해요",
        ],
    },
    {
        category: "교육",
        colorVar: "--color-education",
        bgVar: "--color-education-bg",
        icon: "📚",
        questions: [
            "국가장학금 신청 자격이 어떻게 돼요?",
            "청년 직업훈련 지원 프로그램 있나요?",
        ],
    },
    {
        category: "일자리",
        colorVar: "--color-job",
        bgVar: "--color-job-bg",
        icon: "💼",
        questions: [
            "청년 취업 지원금 신청하고 싶어요",
            "중소기업 취업 청년 혜택 알려줘",
        ],
    },
];

function EmptyState({ onSelectQuestion }) {
    return (
        <div className="empty-state">
            <div className="empty-state-hero">
                <div className="empty-state-logo">✨</div>
                <h2 className="empty-state-title">무엇을 도와드릴까요?</h2>
                <p className="empty-state-desc">
                    주거 · 취업 · 교육 · 복지 분야의 청년 정책을 안내해드려요
                </p>
            </div>

            <div className="empty-state-grid">
                {SUGGESTED_QUESTIONS.map(({ category, colorVar, bgVar, icon, questions }) => (
                    <div key={category} className="empty-state-card">
                        <div
                            className="empty-state-card-header"
                            style={{ color: `var(${colorVar})`, background: `var(${bgVar})` }}
                        >
                            <span>{icon}</span>
                            <span>{category}</span>
                        </div>
                        <ul className="empty-state-card-list">
                            {questions.map((q) => (
                                <li key={q}>
                                    <button
                                        className="empty-state-question-btn"
                                        onClick={() => onSelectQuestion?.(q)}
                                    >
                                        {q}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EmptyState;
