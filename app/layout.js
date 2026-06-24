import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import AxiosConfig from "@/apis/AxiosConfig";

export const metadata = {
  title: "청년정책 지원 챗봇",
  description: "주거·취업·교육·복지 분야 청년 정책 안내 챗봇",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <AxiosConfig />
        {children}
      </body>
    </html>
  );
}
