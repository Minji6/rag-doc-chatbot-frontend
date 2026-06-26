"use client"

import { useAuth } from "@/contexts/AuthContext"

const CATEGORY_TILES = [
    {
        key: "welfare",
        icon: "🫶",
        label: "복지",
        sub: "생활·자산·심리 지원",
        colorVar: "--color-welfare",
        bgVar: "--color-welfare-bg",
        prompt: "복지 분야 청년 정책 추천해줘",
    },
    {
        key: "housing",
        icon: "🏡",
        label: "주거",
        sub: "월세·전세·임대주택",
        colorVar: "--color-housing",
        bgVar: "--color-housing-bg",
        prompt: "주거 지원 청년 정책 추천해줘",
    },
    {
        key: "education",
        icon: "🎓",
        label: "교육",
        sub: "장학·학자금·역량개발",
        colorVar: "--color-education",
        bgVar: "--color-education-bg",
        prompt: "교육 분야 청년 정책 추천해줘",
    },
    {
        key: "job",
        icon: "💼",
        label: "일자리",
        sub: "취업·창업·자산형성",
        colorVar: "--color-job",
        bgVar: "--color-job-bg",
        prompt: "일자리·취업 청년 정책 추천해줘",
    },
];

const QUICK_CHIPS = [
    "월세 지원 받을 수 있을까?",
    "지금 신청 가능한 정책은?",
    "내 나이에 맞는 자산형성",
];

function EmptyState({ onSelectQuestion }) {
    const { currentUser } = useAuth()
    const name = currentUser?.nickname ?? "청년"

    return (
        <div className="empty-state">
            <div className="empty-state-hero">
                <img
                    src="/cheongpodo.png"
                    alt="청포도"
                    className="empty-state-character"
                    onError={e => { e.target.style.display = "none"; }}
                />
                <h2 className="empty-state-title">안녕하세요, {name}님</h2>
                <p className="empty-state-desc">
                    관심 있는 분야를 선택하거나 궁금한 점을 바로 물어보세요.<br />
                    조건에 딱 맞는 청년 정책을 찾아드릴게요.
                </p>
            </div>

            <div className="empty-state-grid">
                {CATEGORY_TILES.map(({ key, icon, label, sub, colorVar, bgVar, prompt }) => (
                    <button
                        key={key}
                        className="empty-state-tile"
                        onClick={() => onSelectQuestion?.(prompt)}
                    >
                        <div
                            className="empty-state-tile-icon"
                            style={{
                                background: `var(${bgVar})`,
                                color: `var(${colorVar})`,
                            }}
                        >
                            {icon}
                        </div>
                        <div>
                            <div className="empty-state-tile-label">{label}</div>
                            <div className="empty-state-tile-sub">{sub}</div>
                        </div>
                    </button>
                ))}
            </div>

            <div className="empty-state-chips">
                {QUICK_CHIPS.map(chip => (
                    <button
                        key={chip}
                        className="empty-state-chip"
                        onClick={() => onSelectQuestion?.(chip)}
                    >
                        {chip}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default EmptyState;
