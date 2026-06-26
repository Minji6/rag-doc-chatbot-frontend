import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import AxiosConfig from "@/apis/AxiosConfig";
import { AuthContextProvider } from "@/contexts/AuthContext";

export const metadata = {
  title: "청포도 – 청년정책 AI 친구",
  description: "조건에 딱 맞는 청년 정책을 찾아드릴게요",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <AxiosConfig />
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
