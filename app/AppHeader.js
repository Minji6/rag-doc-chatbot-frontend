import UserDropdown from "./UserDropdown"

export default function AppHeader() {
  return (
    <header className="app-header">
      <span className="app-header-logo">청년 정책 챗봇</span>
      <UserDropdown />
    </header>
  )
}
