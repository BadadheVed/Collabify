"use client";

import { useState, useEffect } from "react";
import {
  X,
  Plus,
  CheckCircle,
  FileText,
  Users,
  Type,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/axiosSetup/axios";

interface Team {
  teamId: string;
  teamName: string;
  joinedAt: string;
  role: string;
}

interface CreateDocumentData {
  title: string;
  teamId: string;
}

interface CreateDocumentClientProps {
  onDocumentCreated?: () => void;
}

export function CreateDocumentClient({
  onDocumentCreated,
}: CreateDocumentClientProps) {
  const [showCreateDocumentPopup, setShowCreateDocumentPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [createDocumentData, setCreateDocumentData] =
    useState<CreateDocumentData>({
      title: "",
      teamId: "",
    });

  const [userTeams, setUserTeams] = useState<Team[]>([]);

  const getUserTeams = async () => {
    setIsLoadingTeams(true);
    try {
      console.log("Fetching the user teams in the Document Creation");
      const response = await axiosInstance.get("/teams/MyTeams");
      const data = response.data;
      console.log(" Done Fetching the user teams in the Document Creation");
      if (data.success) {
        setUserTeams(data.teams);
      }
    } catch (error) {
      console.error("Error fetching user teams:", error);
    } finally {
      setIsLoadingTeams(false);
    }
  };

  useEffect(() => {
    if (showCreateDocumentPopup) {
      getUserTeams();
    }
  }, [showCreateDocumentPopup]);

  const handleCreateDocument = async () => {
    if (!createDocumentData.title.trim() || !createDocumentData.teamId) {
      return;
    }

    setIsCreating(true);
    try {
      const response = await axiosInstance.post(
        `/documents/${createDocumentData.teamId}/create`,
        {
          title: createDocumentData.title,
        }
      );

      const data = response.data;
      if (data.message === "Document created successfully") {
        const selectedTeam = userTeams.find(
          (team) => team.teamId === createDocumentData.teamId
        );

        setShowCreateDocumentPopup(false);
        setCreateDocumentData({ title: "", teamId: "" });

        // Fetch updated documents and update session storage
        try {
          const documentsResponse = await axiosInstance.get(
            "/documents/UserDocuments"
          );
          const documentsData = documentsResponse.data;

          // Update session storage with fetched documents
          sessionStorage.setItem("documents", JSON.stringify(documentsData));

          // Show success message after session storage is updated
          setSuccessMessage(
            `Document "${createDocumentData.title}" created successfully in ${selectedTeam?.teamName}! You can now start collaborating with your team.`
          );
          setShowSuccess(true);

          setTimeout(() => {
            setShowSuccess(false);
            // Removed window.location.reload() since we're now updating data directly
          }, 2000);

          if (onDocumentCreated) {
            onDocumentCreated();
          }
        } catch (fetchError) {
          console.error("Error fetching documents:", fetchError);
          // Still show success message even if fetching fails
          setSuccessMessage(
            `Document "${createDocumentData.title}" created successfully in ${selectedTeam?.teamName}! You can now start collaborating with your team.`
          );
          setShowSuccess(true);

          setTimeout(() => {
            setShowSuccess(false);
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Error creating document:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      {/* Create Document Button */}
      <Button
        onClick={() => setShowCreateDocumentPopup(true)}
        className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200 ease-out backdrop-blur-sm border border-white/10"
      >
        <Plus className="w-4 h-4 mr-2" />
        New Document
      </Button>

      {/* Create Document Popup */}
      {showCreateDocumentPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-3xl blur opacity-50" />
            <Card className="relative backdrop-blur-xl bg-gray-900/90 border border-white/20 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

              {/* Header */}
              <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/10">
                <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mx-auto">
                  Create New Document
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateDocumentPopup(false)}
                  className="text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 ease-out hover:scale-105 rounded-xl absolute right-6"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="relative z-10 p-6 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500">
                <div className="max-w-md mx-auto space-y-6">
                  {/* Document Title */}
                  <div>
                    <Label
                      htmlFor="documentTitle"
                      className="text-white mb-3 block font-medium text-center"
                    >
                      Document Title *
                    </Label>
                    <div className="relative mx-auto">
                      <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="documentTitle"
                        value={createDocumentData.title}
                        onChange={(e) =>
                          setCreateDocumentData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="Enter document title..."
                        className="pl-10 backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-cyan-500 hover:border-white/20 transition-all duration-200 ease-out w-full text-center"
                      />
                    </div>
                  </div>

                  {/* Team Selection */}
                  <div>
                    <Label
                      htmlFor="teamSelect"
                      className="text-white mb-3 block font-medium text-center"
                    >
                      Select Team *
                    </Label>
                    {isLoadingTeams ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
                        <p className="text-gray-400 mt-2">Loading teams...</p>
                      </div>
                    ) : userTeams.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-400">No teams found</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {userTeams.map((team, index) => (
                          <button
                            key={team.teamId}
                            onClick={() =>
                              setCreateDocumentData((prev) => ({
                                ...prev,
                                teamId: team.teamId,
                              }))
                            }
                            className={`w-full p-4 rounded-xl border transition-all duration-200 ease-out hover:scale-[1.01] text-center ${
                              createDocumentData.teamId === team.teamId
                                ? "bg-cyan-500/20 border-cyan-500/50 shadow-lg shadow-cyan-500/20"
                                : "bg-white/5 border-white/10 hover:border-white/20"
                            }`}
                          >
                            <div className="flex items-center gap-3 justify-center">
                              <div
                                className={`w-10 h-10 rounded-lg bg-gradient-to-r ${
                                  index % 4 === 0
                                    ? "from-cyan-500 to-blue-600"
                                    : index % 4 === 1
                                      ? "from-purple-500 to-pink-600"
                                      : index % 4 === 2
                                        ? "from-green-500 to-emerald-600"
                                        : "from-orange-500 to-red-600"
                                } flex items-center justify-center text-white font-bold text-sm shadow-lg`}
                              >
                                {team.teamName.charAt(0).toUpperCase()}
                              </div>
                              <div className="text-center flex-1">
                                <h5
                                  className={`font-medium ${
                                    createDocumentData.teamId === team.teamId
                                      ? "text-cyan-400"
                                      : "text-white"
                                  }`}
                                >
                                  {team.teamName}
                                </h5>
                                <p className="text-sm text-gray-400">
                                  Role: {team.role} • Joined:{" "}
                                  {new Date(team.joinedAt).toLocaleDateString()}
                                </p>
                              </div>
                              {createDocumentData.teamId === team.teamId && (
                                <CheckCircle className="w-5 h-5 text-cyan-400" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Info Card */}
                  <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl">
                    <div className="flex items-start gap-3 justify-center text-center">
                      <Lightbulb className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <h4 className="text-blue-400 font-medium mb-1">
                          Document Collaboration
                        </h4>
                        <p className="text-blue-200 text-sm">
                          All team members will have access to view and edit
                          this document. You can manage permissions later in the
                          document settings.
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-6 mt-6 border-t border-white/10 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateDocumentPopup(false)}
                      className="px-8 border-white/10 text-gray-400 hover:text-white hover:border-cyan-500 backdrop-blur-sm hover:bg-white/10 transition-all duration-200 ease-out"
                      disabled={isCreating}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateDocument}
                      disabled={
                        !createDocumentData.title.trim() ||
                        !createDocumentData.teamId ||
                        isCreating ||
                        isLoadingTeams
                      }
                      className="px-8 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCreating ? "Creating..." : "Create Document"}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 max-w-md w-full relative overflow-hidden shadow-2xl">
            {/* Success Content */}
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-500 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Document Created!
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {successMessage}
              </p>
            </div>

            {/* Animated Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 rounded-b-2xl overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-600"
                style={{
                  animation: "progressBar 2s linear forwards",
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        @keyframes progressBar {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        .scrollbar-thin {
          scrollbar-width: thin;
        }
        .scrollbar-track-gray-800::-webkit-scrollbar-track {
          background-color: rgb(31 41 55);
          border-radius: 0.5rem;
        }
        .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
          background-color: rgb(75 85 99);
          border-radius: 0.5rem;
        }
        .hover\\:scrollbar-thumb-gray-500:hover::-webkit-scrollbar-thumb {
          background-color: rgb(107 114 128);
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
      `}</style>
    </>
  );
}
