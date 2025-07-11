import { Room } from "./Room";
import { TextEditor } from "./components/TextEditor";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
export default function Home() {
  return (
    <main>
      <DashboardLayout>
        <Room>
          <TextEditor />
        </Room>
      </DashboardLayout>
    </main>
  );
}
