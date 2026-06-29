"use client"

import { useRef, useMemo, useEffect } from "react";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 백엔드(10MB) 제한과 일치 — 업로드 전 빠른 실패

function ChatInput({ input, loading, attach, onSend, onInputChange, onKeyDown, onAttach, onRemoveAttach }) {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        e.target.value = ""; // 같은 파일 재선택 가능하도록 초기화
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            alert("이미지 파일만 첨부할 수 있습니다.");
            return;
        }
        if (file.size > MAX_IMAGE_BYTES) {
            alert("이미지 파일은 10MB 이하만 첨부할 수 있습니다.");
            return;
        }
        onAttach(file);
    };

    // 미리보기 blob URL은 attach가 바뀔 때만 생성하고, 교체/언마운트 시 해제한다.
    // (JSX에서 직접 createObjectURL을 호출하면 리렌더마다 URL이 쌓여 메모리 누수.)
    const previewUrl = useMemo(
        () => (attach ? URL.createObjectURL(attach) : null),
        [attach]
    );
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    // 텍스트·이미지 둘 다 없으면 전송 불가
    const canSend = !loading && (input.trim() || attach);

    return (
        <div className="chat-input-area">
            {attach && (
                <div className="chat-attach-preview">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} alt="첨부 미리보기" className="chat-attach-thumb" />
                    <span className="chat-attach-name">{attach.name}</span>
                    <button className="chat-attach-remove" onClick={onRemoveAttach} aria-label="첨부 제거">✕</button>
                </div>
            )}
            <div className="chat-input-box">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                />
                <button
                    className="chat-attach-btn"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    aria-label="이미지 첨부"
                >
                    🖼
                </button>
                <input
                    type="text"
                    className="chat-input"
                    placeholder="청년 정책에 대해 무엇이든 물어보세요"
                    value={input}
                    onChange={onInputChange}
                    onKeyDown={onKeyDown}
                    disabled={loading}
                />
                <button
                    className="send-btn"
                    onClick={onSend}
                    disabled={!canSend}
                >
                    ↑
                </button>
            </div>
            <p className="chat-input-disclaimer">
                AI가 제공하는 정보는 참고용이며, 정확한 내용은 각 기관에서 확인하세요.
            </p>
        </div>
    );
}

export default ChatInput;
