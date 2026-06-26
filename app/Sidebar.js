"use client"

import Image from "next/image"
import NewChatButton from "@/app/chat/NewChatButton"

function Sidebar({ onNewChat }) {
    return (
        <div className="sidebar">
            <button className="sidebar-logo" onClick={onNewChat}>
                <Image
                    src="/logo.png"
                    alt="청포도"
                    width={38}
                    height={38}
                    className="sidebar-logo-img"
                />
                <div>
                    <div className="sidebar-logo-title">청포도</div>
                    <div className="sidebar-logo-sub">청년정책 AI 챗봇</div>
                </div>
            </button>

            <NewChatButton onClick={onNewChat} />

            <div className="sidebar-footer">
                <span className="sidebar-online-dot"></span>
                전국 청년정책 4,200+ 연동
            </div>
        </div>
    )
}

export default Sidebar
