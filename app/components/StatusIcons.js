// 자격 검증 섹션에서 쓰는 원형 상태 아이콘 (충족/미충족/확인불가).
export function CheckCircleIcon({ size = 20 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="10" fill="#5AA82C" />
            <path d="M6 10.3l2.6 2.6L14.2 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export function XCircleIcon({ size = 20 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="10" fill="#E5484D" />
            <path d="M7 7l6 6M13 7l-6 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    )
}

export function AlertCircleIcon({ size = 20 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="10" fill="#F59E3C" />
            <path d="M10 5.5v5.2" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="10" cy="13.7" r="1" fill="white" />
        </svg>
    )
}

export const CONDITION_STATUS_ICON_COMPONENT = {
    met: CheckCircleIcon,
    unmet: XCircleIcon,
    unknown: AlertCircleIcon,
};
