import { Suspense } from "react";
import { Providers } from "./Providers";
import "./styles/globals.css";
import "./styles/text-editor.css";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-ui/styles/dark/attributes.css";
import "@liveblocks/react-tiptap/styles.css";

export const metadata = {
  title: "Collabify",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
        <Providers>
          <Suspense>{children}</Suspense>
        </Providers>
     
  );
}
