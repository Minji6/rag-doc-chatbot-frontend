import UserDropdown from "@/app/components/UserDropdown"

export default function AppHeader({ title = "새 대화", subtitle = "맞춤형 청년 정책 추천" }) {
  return (
    <header className="chat-header">
      <div className="chat-header-left">
        <h5>{title}</h5>
        <small>{subtitle}</small>
      </div>
      <div className="chat-header-right">
        <UserDropdown />
      </div>
    </header>
  )
}
