import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
<<<<<<< HEAD
import { AuthContextProvider } from "@/contexts/AuthContext";
import AppHeader from "./AppHeader";

export const metadata = {
  title: "청년 정책 챗봇",
  description: "청년 정책 추천 RAG 챗봇",
=======
import AxiosConfig from "@/apis/AxiosConfig";

export const metadata = {
  title: "청년정책 지원 챗봇",
  description: "주거·취업·교육·복지 분야 청년 정책 안내 챗봇",
>>>>>>> add014d870ae8ea79fa8945bc538ca6618503a5c
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
<<<<<<< HEAD
        <AuthContextProvider>
          <AppHeader />
          {children}
        </AuthContextProvider>
=======
        <AxiosConfig />
        {children}
>>>>>>> add014d870ae8ea79fa8945bc538ca6618503a5c
      </body>
    </html>
  );
}
