import GeminiChatPanel from "@/components/ai-assistant/ChatPanel";
import { Room } from "./Room";
import { TextEditor } from "./components/TextEditor";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
export default function Home() {
  return (
    <>
      <DashboardLayout>
        <Room>
          <TextEditor />
        </Room>
      </DashboardLayout>
    </>
  );
}
