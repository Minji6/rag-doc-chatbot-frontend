import PolicyCard from "@/app/chat/PolicyCard";

/**
 * 정책 요약 카드 목록.
 * 단일 컨테이너 안에 정책을 나열하고 정책 사이에 구분선을 그린다.
 */
function PolicyResultList({ policies = [], onSelectPolicy }) {
    if (!policies.length) return null;

    return (
        <div className="policy-card-list">
            {policies.map((policy, i) => (
                <PolicyCard
                    key={policy.plcyNo ?? i}
                    policy={policy}
                    index={i}
                    onDetail={onSelectPolicy}
                />
            ))}
        </div>
    );
}

export default PolicyResultList;
