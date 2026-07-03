/**
 * 매칭 점수 원형 게이지.
 * SVG stroke-dasharray로 점수(0~100)만큼 호를 채운다.
 */
function MatchScoreRing({ score, size = 46, strokeWidth = 4.5, showPercent = false }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - Math.min(100, Math.max(0, score)) / 100);
    const center = size / 2;

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="match-ring"
            role="img"
            aria-label={`매칭 점수 ${score}${showPercent ? "%" : "점"}`}
        >
            <circle
                cx={center} cy={center} r={radius}
                fill="none"
                stroke="var(--primary-light)"
                strokeWidth={strokeWidth}
            />
            <circle
                cx={center} cy={center} r={radius}
                fill="none"
                stroke="var(--primary)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                transform={`rotate(-90 ${center} ${center})`}
            />
            <text
                x="50%" y="50%"
                textAnchor="middle"
                dominantBaseline="central"
                className="match-ring-score"
                style={{ fontSize: size * (showPercent ? 0.24 : 0.3) }}
            >
                {score}{showPercent ? "%" : ""}
            </text>
        </svg>
    );
}

export default MatchScoreRing;
