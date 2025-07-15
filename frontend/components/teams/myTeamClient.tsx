"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  X,
  ChevronRight,
  Clock,
  Crown,
  Star,
  Shield,
  UserPlus,
  Plus,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/axiosSetup/axios";
import { MyTeamsSkeleton } from "./myTeamSkeleton";
interface UserTeam {
  teamId: string;
  teamName: string;
  joinedAt: string;
  role: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface TeamMembersResponse {
  success: boolean;
  members: TeamMember[];
}

interface Project {
  id: string;
  name: string;
}

interface MyTeamsClientProps {
  initialTeams: UserTeam[];
}

export function MyTeamsClient() {
  const router = useRouter();
  const [selectedTeam, setSelectedTeam] = useState<UserTeam | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isMembersLoading, setIsMembersLoading] = useState(false);
  const [showTeamPopup, setShowTeamPopup] = useState(false);
  const [showCreateTeamPopup, setShowCreateTeamPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [createTeamData, setCreateTeamData] = useState({
    name: "",
    projectId: "",
  });
  const [teams, setTeams] = useState<UserTeam[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isCooldownActive, setIsCooldownActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const fetchTeams = async () => {
    try {
      setIsLoading(true);

      // Check sessionStorage first for cached data
      const cachedTeams = sessionStorage.getItem("userTeams");
      if (cachedTeams) {
        const parsedTeams = JSON.parse(cachedTeams);
        setTeams(parsedTeams);
        // Don't set loading to false here, let API call complete
      }

      // Make API call
      const response = await axiosInstance.get("/teams/MyTeams");

      if (response.data.success) {
        setTeams(response.data.teams);
        // Store in sessionStorage
        sessionStorage.setItem(
          "userTeams",
          JSON.stringify(response.data.teams)
        );
      } else {
        setTeams([]);
        // Clear sessionStorage if API returns unsuccessful
        sessionStorage.removeItem("userTeams");
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
      // On error, keep cached data if available, otherwise empty array
      const cachedTeams = sessionStorage.getItem("userTeams");
      if (!cachedTeams) {
        setTeams([]);
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchTeams();
  }, []);

  // Refresh handler with cooldown
  const handleRefresh = async () => {
    if (isCooldownActive) return;

    setIsRefreshing(true);
    try {
      await fetchTeams();
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
  // Mock projects for team creation
  // const [userProjects] = useState<Project[]>([
  //   { id: "proj-1", name: "E-commerce Platform" },
  //   { id: "proj-2", name: "Mobile Banking App" },
  //   { id: "proj-3", name: "Data Analytics Dashboard" },
  //   { id: "proj-4", name: "AI Content Generator" },
  // ]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const furl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "ADMIN":
        return {
          icon: Crown,
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/20",
          borderColor: "border-yellow-500/30",
          label: "Admin",
        };
      case "MANAGER":
        return {
          icon: Star,
          color: "text-blue-400",
          bgColor: "bg-blue-500/20",
          borderColor: "border-blue-500/30",
          label: "Manager",
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

  const fetchTeamMembers = async (teamId: string) => {
    setIsMembersLoading(true);
    try {
      console.log("Fetching the team members");
      const response = await axiosInstance.get(`/teams/${teamId}/members`);
      console.log("team members fetched successfully");
      const data = response.data;
      if (data.success) {
        setTeamMembers(data.members);
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
      setTeamMembers([]);
    } finally {
      setIsMembersLoading(false);
    }
  };

  const handleTeamClick = async (team: UserTeam) => {
    setSelectedTeam(team);
    setShowTeamPopup(true);
    await fetchTeamMembers(team.teamId);
  };

  const handleCreateTeam = async () => {
    if (!createTeamData.name || !createTeamData.projectId) {
      return;
    }

    try {
      // Mock team creation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccessMessage(`Team "${createTeamData.name}" created successfully!`);
      setShowSuccess(true);
      setShowCreateTeamPopup(false);
      setCreateTeamData({ name: "", projectId: "" });

      // Auto-hide success message after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  const closeTeamPopup = () => {
    setShowTeamPopup(false);
    setSelectedTeam(null);
    setTeamMembers([]);
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
  if (isLoading) {
    return <MyTeamsSkeleton />;
  }

  if (!teams || teams.length === 0) {
    return (
      <Card className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 text-center rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />
        <div className="relative z-10">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Teams Yet</h3>
          <p className="text-gray-400">
            You haven't joined any teams yet. Create a team or ask to be added
            to one.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing || isCooldownActive}
          className="text-white flex items-center gap-2 backdrop-blur-xl bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/20 hover:text-cyan-400 transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRefreshing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : isCooldownActive ? (
            `${cooldown}s`
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          <span>Refresh Teams</span>
        </Button>
      </div>
      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team, index) => {
          const roleDisplay = getRoleDisplay(team.role);
          const RoleIcon = roleDisplay.icon;

          return (
            <Card
              key={team.teamId}
              onClick={() => handleTeamClick(team)}
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
                    {team.teamName.charAt(0).toUpperCase()}
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
                    {team.teamName}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Team collaboration workspace
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <UserPlus className="w-4 h-4" />
                    <span>Joined</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDateReliable(team.joinedAt)}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Team Details Popup */}
      {showTeamPopup && selectedTeam && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-3xl blur opacity-50" />
            <Card className="relative backdrop-blur-xl bg-gray-900/90 border border-white/20 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

              {/* Header */}
              <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Team Details
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeTeamPopup}
                  className="text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 ease-out hover:scale-105 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="relative z-10 p-6 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Side - Team Info */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-xl font-semibold text-white">
                          {selectedTeam.teamName}
                        </h3>
                        {(() => {
                          const roleDisplay = getRoleDisplay(selectedTeam.role);
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
                        Collaborative workspace for team members to work
                        together on projects and tasks.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                        <UserPlus className="w-5 h-5 text-cyan-400" />
                        <div>
                          <p className="text-sm text-gray-400">Joined on</p>
                          <p className="text-white font-medium">
                            {formatDateReliable(selectedTeam.joinedAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                        <Users className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="text-sm text-gray-400">Your role</p>
                          <p className="text-white font-medium">
                            {selectedTeam.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Team Members */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-white">
                        Team Members
                      </h4>
                      {!isMembersLoading && (
                        <div className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-medium border border-cyan-500/30">
                          {teamMembers.length}{" "}
                          {teamMembers.length === 1 ? "Member" : "Members"}
                        </div>
                      )}
                    </div>

                    {isMembersLoading ? (
                      <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className="h-16 bg-white/5 rounded-xl animate-pulse"
                          />
                        ))}
                      </div>
                    ) : teamMembers.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">
                          No members found for this team
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {teamMembers.map((member, index) => {
                          const memberRoleDisplay = getRoleDisplay(member.role);
                          const MemberRoleIcon = memberRoleDisplay.icon;

                          return (
                            <Card
                              key={member.id}
                              className="backdrop-blur-xl bg-white/5 border border-white/10 p-4 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-200 ease-out rounded-xl"
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl pointer-events-none" />
                              <div className="relative z-10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-10 h-10 rounded-full bg-gradient-to-r ${
                                      index % 4 === 0
                                        ? "from-cyan-500 to-blue-600"
                                        : index % 4 === 1
                                          ? "from-purple-500 to-pink-600"
                                          : index % 4 === 2
                                            ? "from-green-500 to-emerald-600"
                                            : "from-orange-500 to-red-600"
                                    } flex items-center justify-center text-white font-bold text-sm shadow-lg`}
                                  >
                                    {member.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <h5 className="font-medium text-white">
                                      {member.name}
                                    </h5>
                                    <p className="text-sm text-gray-400">
                                      {member.email}
                                    </p>
                                  </div>
                                </div>
                                <div
                                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${memberRoleDisplay.bgColor} ${memberRoleDisplay.borderColor}`}
                                >
                                  <MemberRoleIcon
                                    className={`w-3 h-3 ${memberRoleDisplay.color}`}
                                  />
                                  <span className={memberRoleDisplay.color}>
                                    {memberRoleDisplay.label}
                                  </span>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Create Team Popup */}
      {showCreateTeamPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-2xl blur opacity-50" />
            <Card className="relative backdrop-blur-xl bg-gray-900/90 border border-white/20 rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />

              <div className="relative z-10 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
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

                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="projectSelect"
                      className="text-white mb-2 block"
                    >
                      Select Project
                    </Label>
                    <select
                      id="projectSelect"
                      value={createTeamData.projectId}
                      onChange={(e) =>
                        setCreateTeamData((prev) => ({
                          ...prev,
                          projectId: e.target.value,
                        }))
                      }
                      className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-500 focus:outline-none transition-all duration-200 ease-out"
                    >
                      <option value="" className="bg-gray-800">
                        Select a project...
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
                  </div>

                  <div>
                    <Label htmlFor="teamName" className="text-white mb-2 block">
                      Team Name
                    </Label>
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
                      className="backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-cyan-500 hover:border-white/20 transition-all duration-200 ease-out"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateTeamPopup(false)}
                      className="flex-1 border-white/10 text-gray-400 hover:text-white hover:border-cyan-500 backdrop-blur-sm hover:bg-white/10 transition-all duration-200 ease-out"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateTeam}
                      disabled={
                        !createTeamData.name || !createTeamData.projectId
                      }
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create Team
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
              <p className="text-gray-300">{successMessage}</p>
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

      {/* Custom Styles */}
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
