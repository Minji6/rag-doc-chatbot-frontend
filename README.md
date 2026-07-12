# <img src="public/cheongpodo.png" width="28" valign="middle" alt="청포도 챗봇 로고"/> 청년정책지원 챗봇 — Frontend

주거·일자리·교육·복지문화 분야 청년 정책을 대화형으로 검색·추천받는 청년정책 AI 챗봇 프론트엔드

---

## 1. About Project

| 항목 | 내용 |
|------|------|
| 프로젝트 목적 | 청년 정책 정보를 RAG 기반 챗봇으로 검색해 분야별 맞춤 답변을 제공하는 청년정책 지원 서비스 |
| 백엔드 레포 | [rag-doc-chatbot](https://github.com/Minji6/rag-doc-chatbot) |
| 개발 기간 | 2026.06.16 ~ 2026.06.30 (2주) |

---

## 2. Team Members

<table>
  <tbody>
    <tr>
      <td align="center">
        <a href="https://github.com/Minji6">
          <img src="https://github.com/Minji6.png" width="100px;" alt="김민지"/>
          <br />
          <sub><b>김민지</b></sub>
        </a>
        <br />
        <sub>팀장 · FullStack</sub>
        <br />
        <a href="https://github.com/Minji6">GitHub</a>
      </td>
      <td align="center">
        <a href="https://github.com/dlwldP">
          <img src="https://github.com/dlwldP.png" width="100px;" alt="dlwldP"/>
          <br />
          <sub><b>이지예</b></sub>
        </a>
        <br />
        <sub>팀원 · FullStack</sub>
        <br />
        <a href="https://github.com/dlwldP">GitHub</a>
      </td>
      <td align="center">
        <a href="https://github.com/garden-kim-git">
          <img src="https://github.com/garden-kim-git.png" width="100px;" alt="garden-kim-git"/>
          <br />
          <sub><b>김정원</b></sub>
        </a>
        <br />
        <sub>팀원 · FullStack</sub>
        <br />
        <a href="https://github.com/garden-kim-git">GitHub</a>
      </td>
      <td align="center">
        <a href="https://github.com/qqqkyj">
          <img src="https://github.com/qqqkyj.png" width="100px;" alt="qqqkyj"/>
          <br />
          <sub><b>강연주</b></sub>
        </a>
        <br />
        <sub>팀원 · FullStack</sub>
        <br />
        <a href="https://github.com/qqqkyj">GitHub</a>
      </td>
    </tr>
  </tbody>
</table>

---

## 3. Key Features

| # | 기능 | 설명 |
|---|------|------|
| 1 | 채팅형 정책 상담 | 메시지 입력 시 백엔드 LangGraph 챗봇과 실시간으로 대화하며 정책 검색·추천·상세조회·비교 답변을 받음 |
| 2 | 정책 카드 · 리스트 렌더링 | 답변에 포함된 정책을 PolicyCard/PolicyResultList로 구조화해 표시, 상세 클릭 시 PolicyDetailModal로 조건·자격진단 확인 |
| 3 | 정책 마감일 캘린더 | PolicyCalendar에서 관심 정책의 신청 마감일(D-day)을 달력으로 확인 |
| 4 | 이미지 첨부 질의 | 채팅 입력창에서 이미지를 첨부해 함께 전송(멀티파트 업로드) |
| 5 | 대화방 관리 | Sidebar · NewChatButton으로 여러 대화방을 생성·전환, 대화 목록/기록을 백엔드에서 조회 |
| 6 | 회원 · 게스트 구분 | 로그인 사용자는 대화가 서버(PostgreSQL)에 영구 저장, 비로그인 게스트는 임시 세션으로 이용 |
| 7 | 마크다운 답변 렌더링 | react-markdown + remark-gfm으로 챗봇 답변의 표·목록·강조 등을 그대로 렌더링 |
| 8 | 관심 정책 저장 | SavedPoliciesContext로 정책을 즐겨찾기 해 다시 찾아볼 수 있음 |

> ⚠️ 현재 구조는 초기 개발 단계로 구성되어 있어, 빠른 시일 내 리팩토링(컴포넌트/상태 관리 구조 정리, 공통 로직 분리 등)이 예정되어 있습니다.

---

## 4. Technology Stack

| 분류 | 기술 |
|------|------|
| Framework | Next.js 16 (App Router) · React 19 |
| Styling | Bootstrap 5 |
| HTTP | axios |
| 마크다운 | react-markdown · remark-gfm |
| 알림 UI | react-toastify |
| Lint | ESLint |

---

## 5. 프로젝트 구조

```
frontend-chatbot/
├── app/
│   ├── page.js, layout.js       # 루트 페이지 · 레이아웃
│   ├── AppHeader.js              # 공통 헤더
│   ├── chat/                     # 채팅 화면
│   │   ├── page.js, layout.js
│   │   ├── ChatWindow.js, MessageList.js, ChatInput.js
│   │   ├── UserMessage.js, BotMessage.js, TypingIndicator.js, ErrorMessage.js
│   │   ├── PolicyCard.js, PolicyResultList.js, PolicyTextCards.js, PolicyDetailModal.js
│   │   ├── PolicyCalendar.js     # 정책 마감일 캘린더
│   │   ├── Sidebar.js, ChatRoomItem.js, NewChatButton.js
│   │   └── recommendation/       # 맞춤 추천 관련 화면
│   └── components/                # 공통 UI (드롭다운, 모달, 토스트 등)
├── apis/
│   ├── AxiosConfig.js            # axios 인스턴스 · baseURL 설정
│   ├── chatApi.js                # /api/chat/service, /chat_history 연동
│   └── memberApi.js              # /api/auth 연동
├── contexts/
│   ├── AuthContext.js            # 로그인 사용자 상태
│   ├── ChatContext.js            # 대화방 · 메시지 상태
│   └── SavedPoliciesContext.js   # 관심 정책 저장
├── utils/                        # 날짜/포맷/정책 파싱 등 유틸
└── public/                       # 로고 · 아이콘 등 정적 자산
```

---

## 6. Development Workflow

### 브랜치 전략

| 브랜치 | 역할 | 규칙 |
|--------|------|------|
| `main` | 최종 배포본 | 직접 push 금지, dev에서만 머지 |
| `dev` | 통합 개발 | feat/* PR 리뷰 후 머지 |
| `feat/{기능명}` | 기능 단위 개발 | 완료 후 dev로 PR |

### PR 규칙
- `feat/*` → `dev` PR 생성 후 팀원 2명 이상 리뷰 후 머지
- PR 제목 형식: `[feat] 정책 상세 모달 구현`
- `dev` → `main`은 전체 기능 완료 후 최종 1회 머지

---

## 7. Convention

### 커밋 컨벤션

| 타입 | 설명 |
|------|------|
| `Feat` | 새로운 기능 추가 |
| `Fix` | 버그 수정 |
| `Docs` | 문서 수정 |
| `Style` | 코드 formatting, 세미콜론 누락 등 코드 변경 없는 경우 |
| `Refactor` | 코드 리팩토링 |
| `Test` | 테스트 코드 추가 및 리팩토링 |
| `Chore` | 패키지 매니저 수정, .gitignore 등 기타 수정 |
| `Comment` | 필요한 주석 추가 및 변경 |
| `Rename` | 파일 또는 폴더 명 수정 및 이동 |
| `Remove` | 파일 삭제 |
| `!HOTFIX` | 급하게 치명적인 버그를 고쳐야 하는 경우 |

**커밋 메시지 규칙**
- 커밋 유형은 영어 대문자로 작성
- 제목과 본문은 빈 행으로 분리
- 제목 첫 글자 대문자, 끝에 `.` 금지
- 제목은 영문 기준 50자 이내
- 본문에는 무엇을·왜 변경했는지 설명 (어떻게 X)
- 여러 항목은 글머리 기호로 작성

```
Feat: 정책 마감일 캘린더 추가

- 관심 정책의 D-day를 월별 캘린더로 시각화
- 정책 클릭 시 상세 모달로 이동
```

### 코드 컨벤션 (React / Next.js)

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트명 | PascalCase | `ChatWindow`, `PolicyCard` |
| 함수·변수명 | camelCase | `sendChat`, `currentUser` |
| 상수 | UPPER_SNAKE_CASE | `MAX_MESSAGE_LENGTH` |
| 파일명 | 컴포넌트는 PascalCase, 유틸은 camelCase | `PolicyDetailModal.js`, `parseMarkdownPolicies.js` |
| API 함수 모듈 | `apis/` 하위, 도메인별 파일 분리 | `chatApi.js`, `memberApi.js` |

**추가 규칙**
- 클라이언트 컴포넌트는 최상단에 `"use client"` 명시
- 전역 상태는 Context(`contexts/`)로 관리, prop drilling 지양
- API 호출은 컴포넌트에서 직접 axios를 쓰지 않고 `apis/` 모듈을 통해 호출
- 비동기 함수는 `async/await` 사용
