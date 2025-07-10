import { axiosInstance } from "@/axiosSetup/axios";
import { DocumentsClient } from "./DocumentClient";
import { cookies } from "next/headers";

interface ApiDocument {
  id: string;
  title: string;
  content: any;
  teamId: string;
  teamName: string;
  updatedAt: string;
  createdAt: string;
}

interface Document {
  id: string;
  title: string;
  content: any;
  teamId: string;
  teamName: string;
  createdAt: string;
  updatedAt: string;
}

interface DocumentsResponse {
  success: boolean;
  documents: ApiDocument[];
}

async function getUserDocuments(): Promise<Document[]> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token");
    const furl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    console.log(
      "Server: Attempting to fetch user documents from",
      `${furl}/documents/UserDocuments`
    );

    const res = await axiosInstance.get("/documents/UserDocuments", {
      headers: {
        Cookie: `token=${token?.value}`,
      },
    });
    const response = res.data;

    console.log("Server: API Response received", response);

    if (response.success) {
      console.log("Server: Documents loaded successfully");

      // Transform API response to match frontend expectations
      const transformedDocuments: Document[] = response.documents.map(
        (doc: ApiDocument) => {
          // Determine document type based on title or content
          const getDocumentType = (title: string): string => {
            const lowerTitle = title.toLowerCase();
            if (lowerTitle.includes("pdf") || lowerTitle.includes("report"))
              return "pdf";
            if (
              lowerTitle.includes("api") ||
              lowerTitle.includes("documentation")
            )
              return "markdown";
            if (
              lowerTitle.includes("spreadsheet") ||
              lowerTitle.includes("testing") ||
              lowerTitle.includes("results")
            )
              return "spreadsheet";
            return "document";
          };

          const docType = getDocumentType(doc.title);

          return {
            id: doc.id,
            title: doc.title,
            content: doc.content,
            teamId: doc.teamId,
            teamName: doc.teamName,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            type: docType,
          };
        }
      );

      return transformedDocuments;
    }

    return [];
  } catch (error) {
    console.error("Server: Error fetching user documents:", error);
    return [];
  }
}

export async function DocumentsServer() {
  const documents = await getUserDocuments();
  return <DocumentsClient initialDocuments={documents} />;
}
