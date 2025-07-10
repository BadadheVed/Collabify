"use client";

import { useState, useEffect } from "react";
import {
  X,
  Plus,
  CheckCircle,
  Users,
  FolderOpen,
  Lightbulb,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/axiosSetup/axios";

interface Project {
  id: string;
  name: string;
}

interface CreateTeamData {
  name: string;
  projectId: string;
}

interface CreateTeamClientProps {
  onTeamCreated?: () => void;
}

export function CreateTeamClient({ onTeamCreated }: CreateTeamClientProps) {
  const [showCreateTeamPopup, setShowCreateTeamPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [createTeamData, setCreateTeamData] = useState<CreateTeamData>({
    name: "",
    projectId: "",
  });

  const [userProjects, setUserProjects] = useState<Project[]>([]);

  const getUserProjects = async () => {
    setIsLoadingProjects(true);
    setProjectsError(null);

    try {
      console.log("Fetching the Admin Projects");
      const res = await axiosInstance.get("/projects/GetAdminProjects");
      console.log("Done Fetching the Admin Projects");
      const projects = res.data.projects;

      // Handle null or undefined projects
      if (!projects || !Array.isArray(projects)) {
        setUserProjects([]);
        setProjectsError("No projects data received from server");
        return;
      }

      setUserProjects(projects);

      // If no projects available, set appropriate error message
      if (projects.length === 0) {
        setProjectsError(
          "No projects available. You need to be an admin or manager of at least one project to create a team."
        );
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setUserProjects([]);
      setProjectsError("Failed to load projects. Please try again.");
    } finally {
      setIsLoadingProjects(false);
    }
  };

  // Load projects when popup opens
  useEffect(() => {
    if (
      showCreateTeamPopup &&
      userProjects.length === 0 &&
      !isLoadingProjects
    ) {
      getUserProjects();
    }
  }, [showCreateTeamPopup]);

  const furl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const handleCreateTeam = async () => {
    if (!createTeamData.name.trim() || !createTeamData.projectId) {
      return;
    }

    // Additional validation: check if selected project exists
    const selectedProject = userProjects.find(
      (p) => p.id === createTeamData.projectId
    );

    if (!selectedProject) {
      setProjectsError(
        "Selected project is no longer available. Please select another project."
      );
      return;
    }

    setIsCreating(true);
    setProjectsError(null); // Clear any previous errors

    try {
      const res = await axiosInstance.post("/teams/create", createTeamData);
      const data = res.data;

      if (data.success) {
        // Success - show success message and close popup
        setSuccessMessage(
          `Team "${createTeamData.name}" created successfully in ${selectedProject.name}! You can now invite members and start collaborating.`
        );
        setShowSuccess(true);
        setShowCreateTeamPopup(false);
        setCreateTeamData({ name: "", projectId: "" });

        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
          if (onTeamCreated) {
            onTeamCreated();
          }
        }, 3000);
      } else {
        // API returned success: false
        setProjectsError(
          data.message || "Failed to create team. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Error creating team:", error);

      // Handle different types of errors
      if (error.response?.data?.message) {
        setProjectsError(error.response.data.message);
      } else if (error.response?.status === 400) {
        setProjectsError("Invalid team data. Please check your inputs.");
      } else if (error.response?.status === 401) {
        setProjectsError(
          "You are not authorized to create teams. Please log in again."
        );
      } else if (error.response?.status === 500) {
        setProjectsError("Server error. Please try again later.");
      } else {
        setProjectsError(
          "Network error. Please check your connection and try again."
        );
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenCreateTeam = () => {
    setShowCreateTeamPopup(true);
    setProjectsError(null);
    setCreateTeamData({ name: "", projectId: "" });
  };

  const handleRetryLoadProjects = () => {
    getUserProjects();
  };

  return (
    <>
      {/* Create Team Button */}
      <Button
        onClick={handleOpenCreateTeam}
        className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200 ease-out backdrop-blur-sm border border-white/10"
      >
        <Plus className="w-4 h-4 mr-2" />
        Create Team
      </Button>

      {/* Create Team Popup */}
      {showCreateTeamPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-3xl blur opacity-50" />
            <Card className="relative backdrop-blur-xl bg-gray-900/90 border border-white/20 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

              {/* Header */}
              <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/10">
                <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Create New Team
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateTeamPopup(false)}
                  className="text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 ease-out hover:scale-105 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="relative z-10 p-6 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500">
                <div className="space-y-6">
                  {/* Project Selection */}
                  <div>
                    <Label
                      htmlFor="projectSelect"
                      className="text-white mb-3 block font-medium"
                    >
                      Select Project *
                    </Label>
                    <div className="relative">
                      <FolderOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        id="projectSelect"
                        value={createTeamData.projectId}
                        onChange={(e) =>
                          setCreateTeamData((prev) => ({
                            ...prev,
                            projectId: e.target.value,
                          }))
                        }
                        disabled={
                          isLoadingProjects || userProjects.length === 0
                        }
                        className="w-full pl-10 p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-500 focus:outline-none transition-all duration-200 ease-out hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="" className="bg-gray-800">
                          {isLoadingProjects
                            ? "Loading projects..."
                            : userProjects.length === 0
                            ? "No projects available"
                            : "Select a project..."}
                        </option>
                        {userProjects.map((project) => (
                          <option
                            key={project.id}
                            value={project.id}
                            className="bg-gray-800"
                          >
                            {project.name}
                          </option>
                        ))}
                      </select>
                      {isLoadingProjects && (
                        <RefreshCw className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />
                      )}
                    </div>
                  </div>

                  {/* Error Message */}
                  {projectsError && (
                    <Card className="backdrop-blur-xl bg-red-500/10 border border-red-500/30 p-4 rounded-xl">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="text-red-400 font-medium mb-1">
                            Error Loading Projects
                          </h4>
                          <p className="text-red-200 text-sm mb-3">
                            {projectsError}
                          </p>
                          <Button
                            onClick={handleRetryLoadProjects}
                            disabled={isLoadingProjects}
                            className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-200 text-sm px-3 py-1 h-auto"
                          >
                            <RefreshCw
                              className={`w-4 h-4 mr-1 ${
                                isLoadingProjects ? "animate-spin" : ""
                              }`}
                            />
                            Try Again
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Team Name */}
                  <div>
                    <Label
                      htmlFor="teamName"
                      className="text-white mb-3 block font-medium"
                    >
                      Team Name *
                    </Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="teamName"
                        value={createTeamData.name}
                        onChange={(e) =>
                          setCreateTeamData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Enter team name..."
                        disabled={userProjects.length === 0}
                        className="pl-10 backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-cyan-500 hover:border-white/20 transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Info Card */}
                  <Card className="backdrop-blur-xl bg-purple-500/10 border border-purple-500/30 p-4 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-purple-400 mt-0.5" />
                      <div>
                        <h4 className="text-purple-400 font-medium mb-1">
                          Team Setup
                        </h4>
                        <p className="text-purple-200 text-sm">
                          You'll be automatically added as the team admin. You
                          can invite members and assign roles after creation.
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateTeamPopup(false)}
                      className="bg-white/10 text-white flex-1 border-white/10 text-gray-400 hover:text-white hover:border-cyan-500 backdrop-blur-sm hover:bg-white/10 transition-all duration-200 ease-out"
                      disabled={isCreating}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateTeam}
                      disabled={
                        !createTeamData.name.trim() ||
                        !createTeamData.projectId ||
                        isCreating ||
                        userProjects.length === 0 ||
                        isLoadingProjects
                      }
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCreating ? "Creating..." : "Create Team"}
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
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 max-w-sm w-full relative overflow-hidden shadow-2xl">
            {/* Success Content */}
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-500 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Success!</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {successMessage}
              </p>
            </div>

            {/* Animated Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 rounded-b-2xl overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-600"
                style={{
                  animation: "progressBar 3s linear forwards",
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
