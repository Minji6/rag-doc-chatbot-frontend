/**
 * "저장한 정책"(정책 캘린더) 영속화 도메인 계층.
 *
 * 캘린더는 로그인 유저 전용 기능이므로 user_id로 네임스페이스를 나눠
 * localStorage에 보관한다. (게스트는 캘린더 자체가 없다.)
 * 회원가입/세션이 없는 프로젝트 특성상 백엔드 스키마를 건드리지 않고
 * 클라이언트에서 유저별로 분리 저장한다.
 */
import { loadJSON, saveJSON } from "@/utils/storage";

const KEY = (userId) => `cheongpodo:saved:${userId}`;

/**
 * 정책 식별자 — plcyNo 우선, 없으면 정책명으로 폴백.
 * 둘 다 없으면 null. (빈 문자열로 폴백하면 식별자 없는 정책들이 전부
 * 동일 키 ""로 묶여, 서로 다른 정책을 같은 항목으로 취급하는 토글 버그 발생.)
 */
export function policyId(policy) {
    return policy?.plcyNo ?? policy?.plcyNm ?? null;
}

/** 유저의 저장 정책 목록을 반환. */
export function loadSavedPolicies(userId) {
    if (userId == null) return [];
    return loadJSON(KEY(userId), []);
}

/** 목록에 해당 정책이 이미 저장돼 있는지. (식별자 없으면 false) */
export function isPolicySaved(list, policy) {
    const id = policyId(policy);
    if (id == null) return false;
    return list.some((p) => policyId(p) === id);
}

/**
 * 저장 토글: 이미 있으면 제거, 없으면 맨 앞에 추가하고 영속화한다.
 * 식별자가 없는 정책은 저장 자체를 차단한다(다른 정책과 혼동 방지).
 * @returns {object[]} 갱신된 목록
 */
export function toggleSavedPolicy(userId, list, policy) {
    const id = policyId(policy);
    if (id == null) return list;
    const exists = list.some((p) => policyId(p) === id);
    const next = exists
        ? list.filter((p) => policyId(p) !== id)
        : [policy, ...list];
    saveJSON(KEY(userId), next);
    return next;
}

/** 저장 목록에서 정책 1건 제거 후 영속화. */
export function removeSavedPolicy(userId, list, policy) {
    const id = policyId(policy);
    const next = list.filter((p) => policyId(p) !== id);
    saveJSON(KEY(userId), next);
    return next;
}
