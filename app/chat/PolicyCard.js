const CATEGORY_STYLE = {
    복지:   { color: "var(--color-welfare)",   bg: "var(--color-welfare-bg)" },
    주거:   { color: "var(--color-housing)",   bg: "var(--color-housing-bg)" },
    교육:   { color: "var(--color-education)", bg: "var(--color-education-bg)" },
    일자리: { color: "var(--color-job)",       bg: "var(--color-job-bg)" },
};

function PolicyCard({ policy }) {
    const { title, organization, description, category, tags = [], benefit, deadline, url } = policy;
    const style = CATEGORY_STYLE[category] ?? { color: "var(--primary)", bg: "var(--primary-light)" };

    const ddayLabel = deadline === "상시모집"
        ? "상시모집"
        : deadline
            ? `D-${deadline}`
            : null;

    return (
        <div className="policy-card">
            <div className="policy-card-top">
                <span
                    className="policy-card-category"
                    style={{ color: style.color, background: style.bg }}
                >
                    {category}
                </span>
                {ddayLabel && (
                    <span className={`policy-card-dday${ddayLabel === "상시모집" ? " always-open" : ""}`}>
                        {ddayLabel}
                    </span>
                )}
            </div>

            <div className="policy-card-title">{title}</div>
            {organization && <div className="policy-card-org">{organization}</div>}
            {description && <p className="policy-card-desc">{description}</p>}

            {tags.length > 0 && (
                <div className="policy-card-tags">
                    {tags.map(tag => (
                        <span key={tag} className="policy-card-tag">{tag}</span>
                    ))}
                </div>
            )}

            <div className="policy-card-footer">
                {benefit && (
                    <span className="policy-card-benefit">₩ {benefit}</span>
                )}
                {url ? (
                    <a href={url} target="_blank" rel="noreferrer" className="policy-card-link">
                        자세히 보기 →
                    </a>
                ) : (
                    <span className="policy-card-link">자세히 보기 →</span>
                )}
            </div>
        </div>
    );
}

export default PolicyCard;
