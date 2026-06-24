"use client"

import { useState } from "react";
import chatApi from "@/apis/chatApi";
import Sidebar from "@/app/Sidebar";
import ChatWindow from "@/app/chat/ChatWindow";

// 임시 대화 목록 (ChatContext 연동 전)
const MOCK_CONVERSATIONS = [
    { id: "1", title: "교육 정책 추천", group: "today" },
    { id: "2", title: "주거 지원 정책", group: "today" },
    { id: "3", title: "복지 혜택 문의", group: "lastWeek" },
    { id: "4", title: "국가장학금 신청", group: "lastWeek" },
];

function Home() {
    // 상태 정의
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState(() => crypto.randomUUID());
    const [activeId, setActiveId] = useState(null);

    // 이벤트 처리 함수 정의
    const handleSelectQuestion = (question) => {
        setInput(question);
    };

    const handleNewChat = () => {
        setMessages([]);
        setConversationId(null);
        setActiveId(null);
        setInput("");
    };

    const handleSelectChat = (id) => {
        setActiveId(id);
    };

    const handleSend = async () => {
        const text = input.trim();
        if (!text || loading) return;

        setMessages(prev => [...prev, { role: "user", content: text }]);
        setInput("");
        setLoading(true);

        try {
            const response = await chatApi.sendChat(text, conversationId);
            setConversationId(response.data.conversation_id);
            setMessages(prev => [...prev, {
                role: "bot",
                content: response.data.message,
                category: response.data.category ?? [],
                inquiry_type: response.data.inquiry_type ?? "",
                policies: response.data.policies ?? [],
            }]);
        } catch (err) {
            console.log(err);
            setMessages(prev => [...prev, { role: "bot", content: "서버 연결에 실패했습니다. 백엔드를 확인해주세요." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="app-layout">
            <Sidebar
                conversations={MOCK_CONVERSATIONS}
                activeId={activeId}
                onSelectChat={handleSelectChat}
                onNewChat={handleNewChat}
            />
            <div className="main-content">
                <ChatWindow
                    messages={messages}
                    loading={loading}
                    input={input}
                    onSend={handleSend}
                    onInputChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onSelectQuestion={handleSelectQuestion}
                />
            </div>
        </div>
    );
}

export default Home;
