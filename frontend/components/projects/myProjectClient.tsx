"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  User,
  Users,
  X,
  ChevronRight,
  FolderOpen,
  Clock,
  Crown,
  Star,
  Shield,
  Trash2,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { axiosInstance } from "@/axiosSetup/axios";

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  createdBy: string;
  role: string;
  team: {
    id: string;
    name: string;
  };
}

interface Team {
  id: string;
  name: string;
  members: {
    name: string;
    role: string;
  }[];
}

interface ProjectTeamsResponse {
  success: boolean;
  teams: Team[];
}

interface MyProjectsClientProps {
  initialProjects: Project[];
}

export function MyProjectsClient({ initialProjects }: MyProjectsClientProps) {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectTeams, setProjectTeams] = useState<Team[]>([]);
  const [isTeamsLoading, setIsTeamsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [deletedProjectName, setDeletedProjectName] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isCooldownActive, setIsCooldownActive] = useState(false);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Disable/enable body scroll when any popup is active
  useEffect(() => {
    const shouldDisableScroll = showPopup || showDeleteConfirm;

    if (shouldDisableScroll) {
      // Store original overflow value
      const originalOverflow = document.body.style.overflow;

      // Disable scrolling
      document.body.style.overflow = "hidden";

      // Also disable scrolling on html element for better cross-browser support
      document.documentElement.style.overflow = "hidden";

      // Cleanup function
      return () => {
        document.body.style.overflow = originalOverflow || "unset";
        document.documentElement.style.overflow = "unset";
      };
    } else {
      // Re-enable scrolling
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    }
  }, [showPopup, showDeleteConfirm]);

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  const furl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "OWNER":
        return {
          icon: Crown,
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/20",
          borderColor: "border-yellow-500/30",
          label: "Owner",
        };
      case "ADMIN":
        return {
          icon: Star,
          color: "text-blue-400",
          bgColor: "bg-blue-500/20",
          borderColor: "border-blue-500/30",
          label: "Admin",
        };
      default:
        return {
          icon: Shield,
          color: "text-gray-400",
          bgColor: "bg-gray-500/20",
          borderColor: "border-gray-500/30",
          label: "Member",
        };
    }
  };

  const fetchProjectTeams = async (projectId: string) => {
    setIsTeamsLoading(true);
    try {
      //setProjectTeams(mockTeams);

      // Uncomment for real API:
      console.log("Fetching the teams");
      const response = await axiosInstance.get(`projects/${projectId}/teams`);
      console.log("Fetching the teams done");
      const teams = response.data.teams;
      if (response.data.success) {
        setProjectTeams(teams);
      }
    } catch (error) {
      console.error("Error fetching project teams:", error);
      setProjectTeams([]);
    } finally {
      setIsTeamsLoading(false);
    }
  };

  const handleProjectClick = async (project: Project) => {
    setSelectedProject(project);
    setShowPopup(true);
    await fetchProjectTeams(project.id);
  };

  const handleTeamClick = (teamId: string) => {
    router.push(`/teams/${teamId}/teaminfo`);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedProject(null);
    setProjectTeams([]);
    setShowDeleteConfirm(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProject) return;

    setIsDeleting(true);
    try {
      const res = await axiosInstance.delete(
        `/projects/${selectedProject.id}/delete`
      );
      const data = res.data;

      // Store project name for success message
      setDeletedProjectName(selectedProject.name);

      // Close all popups after successful deletion
      closePopup();

      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000);

      // Optionally refresh the page or update the projects list
      router.refresh();
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  const formatDateReliable = (dateString: string) => {
    if (!isClient) {
      return "Loading...";
    }

    try {
      const date = new Date(dateString);
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      return `${
        months[date.getUTCMonth()]
      } ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const refreshProjects = async () => {
    if (isCooldownActive) return;

    setIsRefreshing(true);
    try {
      // Simulate API call to refresh projects

      const response = await axiosInstance.get("/projects/my-projects");
      if (response.data.success) {
        setProjects(response.data.projects);
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

  if (projects.length === 0) {
    return (
      <Card className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 text-center rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />
        <div className="relative z-10">
          <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            No Projects Yet
          </h3>
          <p className="text-gray-400">
            You haven't joined any projects yet. Ask your team lead to add you
            to a project.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      {/* Success Message Toast */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-xl blur opacity-50" />
            <Card className="relative backdrop-blur-xl bg-gray-900/95 border border-green-500/30 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent pointer-events-none" />
              <div className="relative z-10 p-4 pr-12">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {deletedProjectName} project is deleted
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSuccessMessage(false)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 ease-out h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => {
          const roleDisplay = getRoleDisplay(project.role);
          const RoleIcon = roleDisplay.icon;

          return (
            <Card
              key={project.id}
              onClick={() => handleProjectClick(project)}
              className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 ease-out cursor-pointer group hover:scale-[1.02] rounded-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-start justify-between">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${
                      index % 4 === 0
                        ? "from-cyan-500 to-blue-600"
                        : index % 4 === 1
                          ? "from-purple-500 to-pink-600"
                          : index % 4 === 2
                            ? "from-green-500 to-emerald-600"
                            : "from-orange-500 to-red-600"
                    } flex items-center justify-center text-white font-bold text-lg shadow-lg transition-all duration-200 ease-out group-hover:scale-105`}
                  >
                    {project.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm border transition-all duration-200 ease-out ${roleDisplay.bgColor} ${roleDisplay.borderColor}`}
                    >
                      <RoleIcon className={`w-3 h-3 ${roleDisplay.color}`} />
                      <span className={roleDisplay.color}>
                        {roleDisplay.label}
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors duration-200 ease-out" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors duration-200 ease-out mb-2">
                    {project.name}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {project.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{project.team.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDateReliable(project.createdAt)}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Fixed Project Details Popup - Centered and Custom Scrollbar */}
      {showPopup && selectedProject && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6"
          style={{ zIndex: 9998 }}
        >
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-3xl blur opacity-50" />
            <Card className="relative backdrop-blur-xl bg-gray-900/90 border border-white/20 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

              {/* Header */}
              <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Project Details
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDeleteClick}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 ease-out hover:scale-105 rounded-xl"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closePopup}
                    className="text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 ease-out hover:scale-105 rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Content with Custom Scrollbar */}
              <div className="relative z-10 p-6 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Side - Project Info */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-xl font-semibold text-white">
                          {selectedProject.name}
                        </h3>
                        {(() => {
                          const roleDisplay = getRoleDisplay(
                            selectedProject.role
                          );
                          const RoleIcon = roleDisplay.icon;
                          return (
                            <div
                              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm border transition-all duration-200 ease-out ${roleDisplay.bgColor} ${roleDisplay.borderColor}`}
                            >
                              <RoleIcon
                                className={`w-4 h-4 ${roleDisplay.color}`}
                              />
                              <span className={roleDisplay.color}>
                                {roleDisplay.label}
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                      <p className="text-gray-300 leading-relaxed">
                        {selectedProject.description}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                        <User className="w-5 h-5 text-cyan-400" />
                        <div>
                          <p className="text-sm text-gray-400">Created by</p>
                          <p className="text-white font-medium">
                            {selectedProject.createdBy}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                        <Calendar className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="text-sm text-gray-400">Created on</p>
                          <p className="text-white font-medium">
                            {formatDateReliable(selectedProject.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Teams (No Horizontal Scroll) */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-white">
                        Teams
                      </h4>
                      {!isTeamsLoading && (
                        <div className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-medium border border-cyan-500/30">
                          {projectTeams.length}{" "}
                          {projectTeams.length === 1 ? "Team" : "Teams"}
                        </div>
                      )}
                    </div>

                    {isTeamsLoading ? (
                      <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="h-20 bg-white/5 rounded-xl animate-pulse"
                          />
                        ))}
                      </div>
                    ) : projectTeams.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">
                          No teams found for this project
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {projectTeams.map((team, index) => (
                          <Card
                            key={team.id}
                            onClick={() => handleTeamClick(team.id)}
                            className="backdrop-blur-xl bg-white/5 border border-white/10 p-4 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-200 ease-out cursor-pointer group hover:scale-[1.01] rounded-xl"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl pointer-events-none" />
                            <div className="relative z-10 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 rounded-lg bg-gradient-to-r ${
                                    index % 4 === 0
                                      ? "from-cyan-500 to-blue-600"
                                      : index % 4 === 1
                                        ? "from-purple-500 to-pink-600"
                                        : index % 4 === 2
                                          ? "from-green-500 to-emerald-600"
                                          : "from-orange-500 to-red-600"
                                  } flex items-center justify-center text-white font-bold text-sm shadow-lg transition-all duration-200 ease-out group-hover:scale-105`}
                                >
                                  {team.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <h5 className="font-medium text-white group-hover:text-cyan-400 transition-colors duration-200 ease-out">
                                    {team.name}
                                  </h5>
                                  <p className="text-sm text-gray-400">
                                    {team.members.length}{" "}
                                    {team.members.length === 1
                                      ? "member"
                                      : "members"}
                                  </p>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors duration-200 ease-out" />
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && selectedProject && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
          style={{ zIndex: 9999 }}
        >
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-600/20 rounded-2xl blur opacity-50" />
            <Card className="relative backdrop-blur-xl bg-gray-900/95 border border-red-500/30 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent pointer-events-none" />

              <div className="relative z-10 p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Delete Project
                    </h3>
                    <p className="text-sm text-gray-400">
                      This action cannot be undone
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-gray-300">
                    Are you sure you want to delete the project{" "}
                    <span className="font-semibold text-white">
                      "{selectedProject.name}"
                    </span>
                    ?
                  </p>
                  <p className="text-sm text-gray-400">
                    This will permanently delete the project and all associated
                    data.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="ghost"
                    onClick={handleDeleteCancel}
                    className="flex-1 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 ease-out"
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteConfirm}
                    disabled={isDeleting}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white transition-all duration-200 ease-out disabled:opacity-50"
                  >
                    {isDeleting ? "Deleting..." : "Delete Project"}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      <style jsx global>{`
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
        @keyframes in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: in 0.3s ease-out;
        }
        .slide-in-from-top-2 {
          animation: slideInFromTop 0.3s ease-out;
        }
        @keyframes slideInFromTop {
          from {
            transform: translateY(-8px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
