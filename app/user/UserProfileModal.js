"use client"

import { useState } from "react";
import Image from "next/image";

const ZIP_OPTIONS = [
    "서울특별시", "부산광역시", "대구광역시", "인천광역시",
    "광주광역시", "대전광역시", "울산광역시", "세종특별자치시",
    "경기도", "충청북도", "충청남도", "전라남도",
    "경상북도", "경상남도", "제주특별자치도", "강원특별자치도",
    "전북특별자치도",
];

const CATEGORY_OPTIONS = ["교육", "주거", "일자리", "복지문화"];

const SCHOOL_OPTIONS = [
    "고졸 미만", "고교 재학", "고졸 예정", "고교 졸업",
    "대학 재학", "대졸 예정", "대학 졸업", "석·박사", "기타", "제한없음",
];

const JOB_OPTIONS = [
    "재직자", "자영업자", "미취업자", "프리랜서",
    "일용근로자", "(예비)창업자", "단기근로자", "영농종사자", "기타", "제한없음",
];

const MRG_OPTIONS = ["기혼", "미혼", "제한없음"];

const SBIZ_OPTIONS = [
    "중소기업", "여성", "기초생활수급자", "한부모가정",
    "장애인", "농업인", "군인", "지역인재", "기타", "제한없음",
];

const EMPTY_FORM = {
    nickname: "",
    birth_date: "",
    zipcd: [],
    category: [],
    schoolcd: "제한없음",
    jobcd: "제한없음",
    mrgsttscd: "제한없음",
    sbizcd: "제한없음",
    earncndsecd: "",
};

function MultiSelectGroup({ options, selected, onChange }) {
    const toggle = (opt) => {
        if (selected.includes(opt)) {
            onChange(selected.filter((v) => v !== opt));
        } else {
            onChange([...selected, opt]);
        }
    };
    return (
        <div className="modal-multi-select">
            {options.map((opt) => (
                <button
                    key={opt}
                    type="button"
                    className={`modal-select-chip ${selected.includes(opt) ? "active" : ""}`}
                    onClick={() => toggle(opt)}
                >
                    {opt}
                </button>
            ))}
        </div>
    );
}

function UserProfileModal({ users = [], onSelectUser, onCreateUser, onDeleteUser, onClose }) {
    const [tab, setTab] = useState("select"); // "select" | "create"
    const [form, setForm] = useState(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.nickname.trim() || !form.birth_date) return;
        setSubmitting(true);
        try {
            await onCreateUser({
                ...form,
                zipcd: form.zipcd.join(","),
                category: form.category.join(","),
                earncndsecd: form.earncndsecd ? Number(form.earncndsecd) : null,
            });
            setForm(EMPTY_FORM);
            setTab("select");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">사용자 선택</h3>
                    <button className="modal-close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="modal-tabs">
                    <button
                        className={`modal-tab ${tab === "select" ? "active" : ""}`}
                        onClick={() => setTab("select")}
                    >
                        사용자 선택
                    </button>
                    <button
                        className={`modal-tab ${tab === "create" ? "active" : ""}`}
                        onClick={() => setTab("create")}
                    >
                        새 사용자 등록
                    </button>
                </div>

                {tab === "select" && (
                    <div className="modal-body">
                        <div className="modal-user-item-wrapper">
                            <button
                                className="modal-user-item guest"
                                onClick={() => onSelectUser(null)}
                            >
                                <span className="modal-user-avatar">👤</span>
                                <div>
                                    <div className="modal-user-name">게스트</div>
                                    <div className="modal-user-sub">로그인 없이 이용</div>
                                </div>
                            </button>
                            <button className="modal-user-delete" style={{ visibility: "hidden" }}>✕</button>
                        </div>
                        {users.map((user) => (
                            <div key={user.user_id} className="modal-user-item-wrapper">
                                <button
                                    className="modal-user-item"
                                    onClick={() => onSelectUser(user)}
                                >
                                    <Image src="/cheongpodo.png" alt="avatar" width={36} height={36} className="modal-user-avatar-img" />
                                    <div>
                                        <div className="modal-user-name">{user.nickname}</div>
                                        <div className="modal-user-sub">{user.birth_date} · {user.zipcd}</div>
                                    </div>
                                </button>
                                <button
                                    className="modal-user-delete"
                                    style={{ visibility: user.user_id > 10 ? "visible" : "hidden" }}
                                    onClick={(e) => { e.stopPropagation(); if (window.confirm(`${user.nickname} 사용자를 삭제하시겠습니까?`)) onDeleteUser(user.user_id); }}
                                >✕</button>
                            </div>
                        ))}
                    </div>
                )}

                {tab === "create" && (
                    <form className="modal-body modal-form" onSubmit={handleSubmit}>
                        <div className="modal-field">
                            <label>닉네임 *</label>
                            <input
                                className="modal-input"
                                type="text"
                                placeholder="닉네임 입력"
                                value={form.nickname}
                                onChange={(e) => handleChange("nickname", e.target.value)}
                                required
                            />
                        </div>

                        <div className="modal-field">
                            <label>생년월일 *</label>
                            <input
                                className="modal-input"
                                type="date"
                                value={form.birth_date}
                                onChange={(e) => handleChange("birth_date", e.target.value)}
                                required
                            />
                        </div>

                        <div className="modal-field">
                            <label>거주 지역 (다중 선택)</label>
                            <MultiSelectGroup
                                options={ZIP_OPTIONS}
                                selected={form.zipcd}
                                onChange={(v) => handleChange("zipcd", v)}
                            />
                        </div>

                        <div className="modal-field">
                            <label>관심 분야 (다중 선택)</label>
                            <MultiSelectGroup
                                options={CATEGORY_OPTIONS}
                                selected={form.category}
                                onChange={(v) => handleChange("category", v)}
                            />
                        </div>

                        <div className="modal-field">
                            <label>학력</label>
                            <select
                                className="modal-select"
                                value={form.schoolcd}
                                onChange={(e) => handleChange("schoolcd", e.target.value)}
                            >
                                {SCHOOL_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                            </select>
                        </div>

                        <div className="modal-field">
                            <label>취업 상태</label>
                            <select
                                className="modal-select"
                                value={form.jobcd}
                                onChange={(e) => handleChange("jobcd", e.target.value)}
                            >
                                {JOB_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                            </select>
                        </div>

                        <div className="modal-field">
                            <label>혼인 여부</label>
                            <select
                                className="modal-select"
                                value={form.mrgsttscd}
                                onChange={(e) => handleChange("mrgsttscd", e.target.value)}
                            >
                                {MRG_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                            </select>
                        </div>

                        <div className="modal-field">
                            <label>특수 분류</label>
                            <select
                                className="modal-select"
                                value={form.sbizcd}
                                onChange={(e) => handleChange("sbizcd", e.target.value)}
                            >
                                {SBIZ_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                            </select>
                        </div>

                        <div className="modal-field">
                            <label>연소득 (원)</label>
                            <input
                                className="modal-input"
                                type="number"
                                placeholder="예: 24000000"
                                value={form.earncndsecd}
                                onChange={(e) => handleChange("earncndsecd", e.target.value)}
                                min={0}
                            />
                        </div>

                        <button
                            className="modal-submit-btn"
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting ? "등록 중..." : "등록하기"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default UserProfileModal;
