const CATEGORY_STYLE = {
    복지문화: { colorVar: "--color-welfare", label: "복지문화" },
    주거:    { colorVar: "--color-housing",   label: "주거" },
    교육:    { colorVar: "--color-education", label: "교육" },
    일자리:  { colorVar: "--color-job",       label: "일자리" },
};

function AnalysisBadge({ category = [], inquiryType = "" }) {
    if (!category.length && !inquiryType) return null;

    return (
        <div className="analysis-badge-row">
            {category.map((cat) => {
                const style = CATEGORY_STYLE[cat];
                if (!style) return null;
                return (
                    <span
                        key={cat}
                        className="analysis-badge category-badge"
                        style={{ backgroundColor: `var(${style.colorVar})` }}
                    >
                        {style.label}
                    </span>
                );
            })}
            {inquiryType && (
                <span className="analysis-badge intent-badge">
                    {inquiryType}
                </span>
            )}
        </div>
    );
}

export default AnalysisBadge;
