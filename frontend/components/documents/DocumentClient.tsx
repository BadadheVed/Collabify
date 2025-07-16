"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  FileText,
  Download,
  Share,
  MoreHorizontal,
  Grid,
  List,
  Calendar,
  User,
  Users,
  Eye,
  Edit,
  Trash2,
  Copy,
  Star,
  Clock,
  FolderOpen,
  File,
  FileSpreadsheet,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CreateDocumentClient } from "./createDocument";
import { axiosInstance } from "@/axiosSetup/axios";
import { DocumentsSkeleton } from "./Document-Skeleton";
import { useCallback } from "react";
interface Document {
  id: string;
  title: string;
  content: any;
  teamId: string;
  teamName: string;
  createdAt: string;
  updatedAt: string;
  type?: string;
}

interface DocumentsClientProps {
  initialDocuments: Document[];
}

type ViewMode = "grid" | "list";
type SortOption =
  | "UPDATED_DESC"
  | "UPDATED_ASC"
  | "CREATED_DESC"
  | "CREATED_ASC"
  | "TITLE_ASC"
  | "TITLE_DESC"
  | "SIZE_ASC"
  | "SIZE_DESC";
type FilterOption = "ALL" | "RECENT";

export function DocumentsClient() {
  const router = useRouter();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("UPDATED_DESC");
  const [filterOption, setFilterOption] = useState<FilterOption>("ALL");
  const [showFilters, setShowFilters] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isCooldownActive, setIsCooldownActive] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    fetchDocuments(); // Add this line
  }, []);

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);

      // Check for sessionStorage only in client-side
      let cachedDocuments = null;
      if (typeof window !== "undefined") {
        cachedDocuments = sessionStorage.getItem("documents");
      }

      if (cachedDocuments) {
        setDocuments(JSON.parse(cachedDocuments));
        setIsLoading(false);
      }

      const response = await axiosInstance.get("/documents/UserDocuments");
      if (response.data.success) {
        const docsWithSize = response.data.documents.map((doc: any) => ({
          ...doc,
          type: doc.type || "markdown",
          size: getSizeString(doc.content),
          shared: false,
        }));

        setDocuments(docsWithSize);

        // Only update sessionStorage in client-side
        if (typeof window !== "undefined") {
          sessionStorage.setItem("documents", JSON.stringify(docsWithSize));
        }
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDocumentCreated = () => {
    fetchDocuments(); // This will refresh the documents list
  };

  // Compute size from content
  function getSizeString(content: any): string {
    if (!content) return "0 KB";
    try {
      const jsonString = JSON.stringify(content);
      const bytes = new Blob([jsonString]).size;
      if (bytes < 1024) return bytes + " B";
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
      return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    } catch (error) {
      return "0 KB";
    }
  }

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return File;
      case "markdown":
        return FileText;
      case "spreadsheet":
        return FileSpreadsheet;
      default:
        return FileText;
    }
  };

  const getDocumentColor = (type: string, index: number) => {
    switch (type) {
      case "pdf":
        return "from-red-500 to-pink-600";
      case "markdown":
        return "from-green-500 to-emerald-600";
      case "spreadsheet":
        return "from-orange-500 to-yellow-600";
      default:
        return index % 4 === 0
          ? "from-cyan-500 to-blue-600"
          : index % 4 === 1
            ? "from-purple-500 to-pink-600"
            : index % 4 === 2
              ? "from-green-500 to-emerald-600"
              : "from-orange-500 to-red-600";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    if (!isClient) return "Loading...";

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );

      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours}h ago`;

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays}d ago`;

      return date.toLocaleDateString();
    } catch (error) {
      return "Invalid date";
    }
  };

  // Filter and sort documents
  const filteredAndSortedDocuments = useMemo(() => {
    let filtered = documents;

    // Apply filter
    switch (filterOption) {
      case "RECENT":
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter((doc) => new Date(doc.updatedAt) > weekAgo);
        break;
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.title.toLowerCase().includes(query) ||
          (doc.teamName && doc.teamName.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "UPDATED_DESC":
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        case "UPDATED_ASC":
          return (
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          );
        case "CREATED_DESC":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "CREATED_ASC":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "TITLE_ASC":
          return a.title.localeCompare(b.title);
        case "TITLE_DESC":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return sorted;
  }, [documents, filterOption, searchQuery, sortOption]);

  const handleDocumentClick = (document: Document) => {
    // Navigate to document detail page
    router.push(`/docs?documentId=${document.id}&teamId=${document.teamId}`);
  };

  const handleDocumentAction = async (action: string, documentId: string) => {
    switch (action) {
      case "delete":
        setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
        break;
      case "duplicate":
        const docToDuplicate = documents.find((doc) => doc.id === documentId);
        if (docToDuplicate) {
          const newDoc = {
            ...docToDuplicate,
            id: `doc-${Date.now()}`,
            title: `${docToDuplicate.title} (Copy)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setDocuments((prev) => [newDoc, ...prev]);
        }
        break;
      case "share":
        // Handle share action
        console.log("Sharing document:", documentId);
        break;
      case "download":
        // Handle download action
        console.log("Downloading document:", documentId);
        break;
    }
  };

  const refreshDocuments = async () => {
    if (isCooldownActive) return;

    setIsRefreshing(true);
    try {
      // Simulate API call to refresh documents

      const response = await axiosInstance.get("/documents/UserDocuments");
      if (response.data.success) {
        setDocuments(response.data.documents);
      }

      // Activate cooldown
      setIsCooldownActive(true);
      setCooldown(30);

      // Start countdown
      const countdown = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            setIsCooldownActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setIsRefreshing(false);
    }
  };
  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case "UPDATED_DESC":
        return "Recently Updated";
      case "UPDATED_ASC":
        return "Oldest Updated";
      case "CREATED_DESC":
        return "Recently Created";
      case "CREATED_ASC":
        return "Oldest Created";
      case "TITLE_ASC":
        return "Title (A-Z)";
      case "TITLE_DESC":
        return "Title (Z-A)";
      case "SIZE_ASC":
        return "Size (Smallest)";
      case "SIZE_DESC":
        return "Size (Largest)";
      default:
        return "Sort";
    }
  };

  if (isLoading) {
    return <DocumentsSkeleton />;
  }
  if (documents.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              My Documents
            </h2>
            <p className="text-gray-400 mt-1">Documents you have access to</p>
          </div>
          <CreateDocumentClient onDocumentCreated={handleDocumentCreated} />
        </div>

        <Card className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 text-center rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />
          <div className="relative z-10">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No Documents Yet
            </h3>
            <p className="text-gray-400">
              Create your first document to start collaborating with your team.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            My Documents
          </h2>
          <p className="text-gray-400 mt-1">
            Documents you have access to ({documents.length})
          </p>
        </div>
        <div className="flex gap-3">
          {/* Refresh Button */}
          <Button
            onClick={refreshDocuments}
            disabled={isRefreshing || isCooldownActive}
            variant="outline"
            className="flex items-center gap-2 backdrop-blur-xl bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/20 hover:text-cyan-400 transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefreshing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : isCooldownActive ? (
              `${cooldown}s`
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span>Refresh</span>
          </Button>

          <CreateDocumentClient onDocumentCreated={handleDocumentCreated} />
        </div>
      </div>

      {/* Filters and Search */}
      <div className="space-y-4 mb-6">
        {/* Search and View Toggle */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-cyan-500 hover:border-white/20 transition-all duration-200 ease-out"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-white/10 text-gray-400 hover:text-white hover:border-cyan-500 backdrop-blur-sm hover:bg-white/10 transition-all duration-200 ease-out hover:scale-105"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>

            <div className="flex rounded-lg border border-white/10 overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`rounded-none ${
                  viewMode === "grid"
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`rounded-none ${
                  viewMode === "list"
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <Card className="backdrop-blur-xl bg-white/5 border border-white/10 p-4 rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filter Options */}
              <div>
                <Label className="text-white mb-3 block">Filter by</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "ALL", label: "All Documents" },
                    { key: "RECENT", label: "Recent" },
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() =>
                        setFilterOption(filter.key as FilterOption)
                      }
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ease-out hover:scale-105 ${
                        filterOption === filter.key
                          ? "bg-cyan-500/20 border border-cyan-500/50 text-cyan-400"
                          : "bg-white/5 border border-white/10 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <Label className="text-white mb-3 block">Sort by</Label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-cyan-500 focus:outline-none transition-all duration-200 ease-out"
                >
                  <option value="UPDATED_DESC" className="bg-gray-800">
                    Recently Updated
                  </option>
                  <option value="UPDATED_ASC" className="bg-gray-800">
                    Oldest Updated
                  </option>
                  <option value="CREATED_DESC" className="bg-gray-800">
                    Recently Created
                  </option>
                  <option value="CREATED_ASC" className="bg-gray-800">
                    Oldest Created
                  </option>
                  <option value="TITLE_ASC" className="bg-gray-800">
                    Title (A-Z)
                  </option>
                  <option value="TITLE_DESC" className="bg-gray-800">
                    Title (Z-A)
                  </option>
                  <option value="SIZE_ASC" className="bg-gray-800">
                    Size (Smallest)
                  </option>
                  <option value="SIZE_DESC" className="bg-gray-800">
                    Size (Largest)
                  </option>
                </select>
              </div>

              {/* Results Summary */}
              <div>
                <Label className="text-white mb-3 block">Results</Label>
                <div className="text-sm text-gray-400">
                  <p>
                    Showing {filteredAndSortedDocuments.length} of{" "}
                    {documents.length} documents
                  </p>
                  <p>Sorted by {getSortLabel(sortOption)}</p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Documents Display */}
      {filteredAndSortedDocuments.length === 0 ? (
        <Card className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 text-center rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />
          <div className="relative z-10">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No Documents Found
            </h3>
            <p className="text-gray-400">
              No documents match your current filters. Try adjusting your search
              or filters.
            </p>
          </div>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedDocuments.map((document, index) => {
            const IconComponent = getDocumentIcon(document.type || "document");
            const gradientColor = getDocumentColor(
              document.type || "document",
              index
            );

            return (
              <Card
                key={document.id}
                onClick={() => handleDocumentClick(document)}
                className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 ease-out cursor-pointer group hover:scale-[1.02] rounded-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />
                <div className="relative z-10 space-y-4">
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${gradientColor} flex items-center justify-center text-white shadow-lg transition-all duration-200 ease-out group-hover:scale-105`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDocumentAction("share", document.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-200 ease-out hover:scale-105"
                      >
                        <Share className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle more actions menu
                        }}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-200 ease-out hover:scale-105"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-white group-hover:text-cyan-400 transition-colors duration-200 ease-out mb-2 line-clamp-2">
                      {document.title}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-400">
                      {document.teamName && (
                        <div className="flex items-center gap-2">
                          <Users className="w-3 h-3" />
                          <span>{document.teamName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-400 pt-2 border-t border-white/10">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(document.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="divide-y divide-white/10">
              {filteredAndSortedDocuments.map((document, index) => {
                const IconComponent = getDocumentIcon(
                  document.type || "document"
                );
                const gradientColor = getDocumentColor(
                  document.type || "document",
                  index
                );

                return (
                  <div
                    key={document.id}
                    onClick={() => handleDocumentClick(document)}
                    className="p-4 hover:bg-white/5 transition-all duration-200 ease-out cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-r ${gradientColor} flex items-center justify-center text-white shadow-lg transition-all duration-200 ease-out group-hover:scale-105`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-white group-hover:text-cyan-400 transition-colors duration-200 ease-out truncate">
                            {document.title}
                          </h3>
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDocumentAction("download", document.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-200 ease-out hover:scale-105"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDocumentAction("share", document.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-200 ease-out hover:scale-105"
                            >
                              <Share className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle more actions menu
                              }}
                              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-200 ease-out hover:scale-105"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                          <span>•</span>
                          <span>
                            Modified {formatTimeAgo(document.updatedAt)}
                          </span>
                          {document.teamName && (
                            <>
                              <span>•</span>
                              <span>{document.teamName}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}
