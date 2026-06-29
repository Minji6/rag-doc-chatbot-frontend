import PolicyCard from "@/app/chat/PolicyCard";

/**
 * 정책 요약 카드 목록.
 *
 * 데이터 식별(plcyNo)·표현만 담당하고, "상세 모달을 열지 말지"의 정책 결정은
 * 상위(BotMessage)가 onSelectPolicy 주입 여부로 내린다.
 *
 * @param {object[]} policies        - 백엔드가 내려준 정책 메타 배열
 * @param {function} [onSelectPolicy] - 주입되면 각 카드에 상세 진입점이 생긴다(로그인 유저)
 */
function PolicyResultList({ policies = [], onSelectPolicy }) {
    if (!policies.length) return null;

    return (
        <div className="policy-card-list">
            {policies.map((policy, i) => (
                <PolicyCard
                    key={policy.plcyNo ?? i}
                    policy={policy}
                    onDetail={onSelectPolicy}
                />
            ))}
        </div>
    );
}

export default PolicyResultList;
