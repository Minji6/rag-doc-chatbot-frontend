import { ChatContextProvider } from "@/contexts/ChatContext";

export default function ChatLayout({ children }) {
    return (
        <ChatContextProvider>
            {children}
        </ChatContextProvider>
    );
}
