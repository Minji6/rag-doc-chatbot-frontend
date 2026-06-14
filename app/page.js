"use client"

import { useState, useRef, useEffect } from "react"
import axios from "axios"

const API_URL = "http://localhost:80"

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "bot", content: "안녕하세요! 공식 문서 기반 개발자 학습 챗봇입니다. FastAPI, LangChain, SQLAlchemy에 대해 질문해보세요." }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    setMessages(prev => [...prev, { role: "user", content: text }])
    setInput("")
    setLoading(true)

    try {
      const res = await axios.post(`${API_URL}/api/chat`, { message: text })
      setMessages(prev => [...prev, { role: "bot", content: res.data.answer }])
    } catch {
      setMessages(prev => [...prev, { role: "bot", content: "서버 연결에 실패했습니다. 백엔드를 확인해주세요." }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="chat-wrapper">
      <div className="chat-header">
        <h5>Dev Doc RAG Chatbot</h5>
        <small>FastAPI · LangChain · SQLAlchemy 공식 문서 기반 답변</small>
      </div>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message-row ${msg.role}`}>
            <div className={`avatar ${msg.role}`}>
              {msg.role === "bot" ? "🤖" : "나"}
            </div>
            <div className={`message-bubble ${msg.role}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message-row bot">
            <div className="avatar bot">🤖</div>
            <div className="message-bubble bot">답변을 생성하는 중...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <div className="input-group">
          <input
            type="text"
            className="form-control chat-input"
            placeholder="질문을 입력하세요... (Enter로 전송)"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            className="send-btn"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
          >
            전송
          </button>
        </div>
      </div>
    </div>
  )
}
