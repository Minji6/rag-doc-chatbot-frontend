/**
 * 백엔드 마크다운 텍스트에서 정책 카드 구조를 추출한다.
 *
 * 에이전트 출력 형식 (OUTPUT_FORMAT_GUIDE 공통):
 *   ### 정책명
 *   - 개요: 정책 요약
 *   - 지원 내용: ...
 *   - 참여 자격: ...
 *   - 신청 방법: ...
 *   - 신청 URL: https://...
 *
 * 필드 형식은 볼드 없이 `- 레이블: 값` 또는 볼드 포함 `- **레이블**: 값` 둘 다 허용.
 */

// "- 레이블: 값" 또는 "- **레이블**: 값" 또는 "• 레이블: 값" 모두 매칭
const FIELD_REGEX = /^[-*•]\s*\*{0,2}([^*:：\n]+?)\*{0,2}\s*[：:]\s*(.+)$/;

export function parseMarkdownPolicies(text) {
    if (!text?.trim()) return { intro: "", policies: [] };

    // suggestions 구분자 제거
    const cleaned = text.replace(/---SUGGESTIONS---[\s\S]*$/m, "").trim();

    // ### 헤더 기준으로 분리
    const parts = cleaned.split(/(?=^### )/m);

    // 도입부: ## 분야 헤더 제거 후 남은 텍스트
    const intro = (parts[0] ?? "")
        .replace(/^## .+$/gm, "")
        .trim();

    const policies = [];

    for (let i = 1; i < parts.length; i++) {
        const block = parts[i];
        const lines = block.split("\n");

        // 첫 줄: ### 정책명
        const name = lines[0].replace(/^### /, "").trim();
        if (!name) continue;

        let summary = "";          // 개요 필드 또는 첫 단락
        const fields = [];

        for (let j = 1; j < lines.length; j++) {
            const trimmed = lines[j].trim();
            if (!trimmed) continue;
            if (/^##[^#]/.test(trimmed)) continue; // ## 도메인 헤더 무시

            const m = trimmed.match(FIELD_REGEX);
            if (m) {
                const label = m[1].trim();
                const value = m[2].trim();

                if (label === "개요") {
                    // 개요 필드 → 카드 요약 설명으로 사용
                    summary = value;
                } else {
                    fields.push({ label, value });
                }
            } else if (!summary) {
                // 필드가 아닌 첫 단락 텍스트 → 요약으로
                summary += (summary ? " " : "") + trimmed;
            }
        }

        policies.push({ name, summary, fields });
    }

    return { intro, policies };
}
