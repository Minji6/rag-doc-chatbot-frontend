"use client"

import MessageList from "@/app/chat/MessageList";
import ChatInput from "@/app/chat/ChatInput";
import PolicyCalendar from "@/app/chat/PolicyCalendar";
import UserDropdown from "@/app/components/UserDropdown";
import { useSavedPolicies } from "@/contexts/SavedPoliciesContext";

function ChatWindow({ messages = [], loading, input, attach, onSend, onInputChange, onKeyDown, onAttach, onRemoveAttach, onSelectQuestion, title = "새 대화" }) {
    const { enabled, count, openCalendar } = useSavedPolicies();

    return (
        <div className="chat-wrapper">
            <div className="chat-header">
                <div className="chat-header-left">
                    <h5>{title}</h5>
                    <small>맞춤형 청년 정책 추천</small>
                </div>
                <div className="chat-header-right">
                    {/* 캘린더는 유저 전용 — 게스트에겐 진입점을 숨긴다 */}
                    {enabled && (
                        <button
                            className="calendar-icon-btn"
                            onClick={openCalendar}
                            aria-label="정책 캘린더 열기"
                        >
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4.5" width="18" height="16" rx="3"/>
                                <path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>
                            </svg>
                            {count > 0 && <span className="calendar-icon-badge">{count}</span>}
                        </button>
                    )}
                    <UserDropdown />
                </div>
            </div>

            <MessageList messages={messages} loading={loading} onSelectQuestion={onSelectQuestion} />

            <ChatInput
                input={input}
                loading={loading}
                attach={attach}
                onSend={onSend}
                onInputChange={onInputChange}
                onKeyDown={onKeyDown}
                onAttach={onAttach}
                onRemoveAttach={onRemoveAttach}
            />

            <PolicyCalendar />
        </div>
    );
}

export default ChatWindow;
