import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { AuthContextProvider } from "@/contexts/AuthContext";
import AppHeader from "./AppHeader";

export const metadata = {
  title: "청년 정책 챗봇",
  description: "청년 정책 추천 RAG 챗봇",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <AuthContextProvider>
          <AppHeader />
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
