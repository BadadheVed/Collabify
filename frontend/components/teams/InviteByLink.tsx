"use client";

import { useState, useEffect } from "react";
import {
  X,
  Link,
  CheckCircle,
  Users,
  Crown,
  Star,
  Shield,
  Copy,
  Mail,
  MessageCircle,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/axiosSetup/axios";

interface Team {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
}

interface InviteData {
  teamId: string;
  role: "ADMIN" | "MANAGER" | "MEMBER";
}

interface GeneratedInvite {
  inviteLink: string;
  teamName: string;
  role: string;
  expiresAt: string;
}

interface InviteLinkClientProps {
  onInviteGenerated?: () => void;
}

export function InviteLinkClient({ onInviteGenerated }: InviteLinkClientProps) {
  const [showInvitePopup, setShowInvitePopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showGeneratedInvite, setShowGeneratedInvite] = useState(false);
  const [showError, setShowError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [inviteData, setInviteData] = useState<InviteData>({
    teamId: "",
    role: "MEMBER",
  });
  const [generatedInvite, setGeneratedInvite] =
    useState<GeneratedInvite | null>(null);

  // Admin teams state - now fetched from API
  const [adminTeams, setAdminTeams] = useState<Team[]>([]);

  // Fetch admin teams from API
  const fetchAdminTeams = async () => {
    setIsLoadingTeams(true);
    try {
      const response = await axiosInstance.get("/teams/AdminTeams");

      if (response.data.success && response.data.teams) {
        setAdminTeams(response.data.teams);
      } else {
        showErrorMessage("Failed to fetch admin teams");
      }
    } catch (error: any) {
      console.error("Error fetching admin teams:", error);

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || "Unknown error";

        if (status === 401) {
          showErrorMessage("Authentication required. Please login again.");
        } else if (status === 403) {
          showErrorMessage("You don't have permission to view admin teams.");
        } else {
          showErrorMessage(`Error fetching teams: ${message}`);
        }
      } else if (error.request) {
        showErrorMessage("Network error. Please check your connection.");
      } else {
        showErrorMessage("An unexpected error occurred while fetching teams.");
      }
    } finally {
      setIsLoadingTeams(false);
    }
  };

  // Fetch teams when component mounts or when invite popup opens
  useEffect(() => {
    if (showInvitePopup && adminTeams.length === 0) {
      fetchAdminTeams();
    }
  }, [showInvitePopup]);

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "ADMIN":
        return {
          icon: Crown,
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/20",
          borderColor: "border-yellow-500/30",
          label: "Admin",
          description: "Full access to team management and settings",
        };
      case "MANAGER":
        return {
          icon: Star,
          color: "text-blue-400",
          bgColor: "bg-blue-500/20",
          borderColor: "border-blue-500/30",
          label: "Manager",
          description: "Can manage tasks and team members",
        };
      default:
        return {
          icon: Shield,
          color: "text-gray-400",
          bgColor: "bg-gray-500/20",
          borderColor: "border-gray-500/30",
          label: "Member",
          description: "Can participate in team activities",
        };
    }
  };

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => setShowError(false), 4000);
  };

  const handleOpenInvitePopup = () => {
    setShowInvitePopup(true);
    // Reset form data when opening popup
    setInviteData({
      teamId: "",
      role: "MEMBER",
    });
  };

  const handleGenerateInvite = async () => {
    if (!inviteData.teamId || !inviteData.role) {
      showErrorMessage("Please select a team and role");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await axiosInstance.post("/teams/invite", {
        teamId: inviteData.teamId,
        role: inviteData.role,
      });

      console.log("API Response:", response.data);

      if (response.data.success && response.data.inviteLink) {
        const selectedTeam = adminTeams.find(
          (team) => team.id === inviteData.teamId
        );

        setGeneratedInvite({
          inviteLink: response.data.inviteLink,
          teamName: selectedTeam?.name || "Unknown Team",
          role: inviteData.role,
          expiresAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
        });

        setShowInvitePopup(false);
        setShowGeneratedInvite(true);

        // Call the callback if provided
        if (onInviteGenerated) {
          onInviteGenerated();
        }
      } else {
        showErrorMessage("Failed to generate invite link");
      }
    } catch (error: any) {
      console.error("Error generating invite:", error);

      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const message = error.response.data?.message || "Unknown error";

        if (status === 401) {
          showErrorMessage("Authentication required. Please login again.");
        } else if (status === 403) {
          showErrorMessage(
            "You don't have permission to create invites for this team."
          );
        } else if (status === 404) {
          showErrorMessage("Team not found.");
        } else {
          showErrorMessage(`Error: ${message}`);
        }
      } else if (error.request) {
        // Network error
        showErrorMessage("Network error. Please check your connection.");
      } else {
        // Other error
        showErrorMessage("An unexpected error occurred.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    if (generatedInvite?.inviteLink) {
      try {
        await navigator.clipboard.writeText(generatedInvite.inviteLink);
        setSuccessMessage("Invite link copied to clipboard!");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } catch (error) {
        console.error("Failed to copy link:", error);
        showErrorMessage("Failed to copy link to clipboard");
      }
    }
  };

  const handleShareViaEmail = () => {
    if (generatedInvite) {
      const subject = `Join ${generatedInvite.teamName} on Collabify`;
      const body = `You've been invited to join ${
        generatedInvite.teamName
      } as a ${generatedInvite.role.toLowerCase()}.\n\nClick the link below to accept the invitation:\n${
        generatedInvite.inviteLink
      }\n\nThis invitation expires in 7 days.`;
      const mailtoLink = `mailto:?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink);
    }
  };

  const handleShareViaWhatsApp = () => {
    if (generatedInvite) {
      const message = `🎉 You've been invited to join *${
        generatedInvite.teamName
      }* on Collabify as a ${generatedInvite.role.toLowerCase()}!\n\nClick here to accept: ${
        generatedInvite.inviteLink
      }\n\n⏰ Expires in 7 days`;
      const whatsappLink = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappLink, "_blank");
    }
  };

  const formatExpiryDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const getTeamInitial = (teamName: string, index: number) => {
    return teamName.charAt(0).toUpperCase();
  };

  const getTeamGradient = (index: number) => {
    const gradients = [
      "from-cyan-500 to-blue-600",
      "from-purple-500 to-pink-600",
      "from-green-500 to-emerald-600",
      "from-orange-500 to-red-600",
    ];
    return gradients[index % gradients.length];
  };

  return (
    <>
      {/* Invite by Link Button */}
      <Button
        onClick={handleOpenInvitePopup}
        variant="outline"
        className="bg-white/10 border-white/10 text-gray-400 text-white hover:text-white hover:border-cyan-500 backdrop-blur-sm hover:bg-white/10 transition-all duration-200 ease-out hover:scale-105"
      >
        <Link className="w-4 h-4 mr-2" />
        Invite by Link
      </Button>

      {/* Generate Invite Popup */}
      {showInvitePopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-3xl blur opacity-50" />
            <Card className="relative backdrop-blur-xl bg-gray-900/90 border border-white/20 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

              {/* Header */}
              <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/10">
                <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Generate Invite Link
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInvitePopup(false)}
                  className="text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 ease-out hover:scale-105 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="relative z-10 p-6 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500">
                <div className="space-y-6">
                  {/* Team Selection */}
                  <div>
                    <Label className="text-white mb-3 block font-medium">
                      Select Team
                    </Label>

                    {isLoadingTeams ? (
                      <div className="flex items-center justify-center p-8">
                        <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                        <span className="ml-2 text-gray-400">
                          Loading teams...
                        </span>
                      </div>
                    ) : adminTeams.length === 0 ? (
                      <div className="text-center p-8">
                        <p className="text-gray-400 mb-3">
                          No teams found where you are an admin or manager.
                        </p>
                        <Button
                          onClick={fetchAdminTeams}
                          variant="outline"
                          className="border-white/10 text-gray-400 hover:text-white hover:border-cyan-500 backdrop-blur-sm hover:bg-white/10 transition-all duration-200 ease-out"
                        >
                          Retry
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {adminTeams.map((team, index) => (
                          <button
                            key={team.id}
                            onClick={() =>
                              setInviteData((prev) => ({
                                ...prev,
                                teamId: team.id,
                              }))
                            }
                            className={`p-4 rounded-xl border transition-all duration-200 ease-out hover:scale-[1.01] ${
                              inviteData.teamId === team.id
                                ? "bg-cyan-500/20 border-cyan-500/50 shadow-lg shadow-cyan-500/20"
                                : "bg-white/5 border-white/10 hover:border-white/20"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getTeamGradient(
                                  index
                                )} flex items-center justify-center text-white font-bold text-sm shadow-lg`}
                              >
                                {getTeamInitial(team.name, index)}
                              </div>
                              <div className="text-left flex-1">
                                <h5
                                  className={`font-medium ${
                                    inviteData.teamId === team.id
                                      ? "text-cyan-400"
                                      : "text-white"
                                  }`}
                                >
                                  {team.name}
                                </h5>
                                <p className="text-sm text-gray-400">
                                  {team.projectName}
                                </p>
                              </div>
                              {inviteData.teamId === team.id && (
                                <CheckCircle className="w-5 h-5 text-cyan-400" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Role Selection */}
                  <div>
                    <Label className="text-white mb-3 block font-medium">
                      Invite as Role
                    </Label>
                    <div className="grid grid-cols-1 gap-3">
                      {(["ADMIN", "MANAGER", "MEMBER"] as const).map((role) => {
                        const roleDisplay = getRoleDisplay(role);
                        const RoleIcon = roleDisplay.icon;
                        const isSelected = inviteData.role === role;

                        return (
                          <button
                            key={role}
                            onClick={() =>
                              setInviteData((prev) => ({ ...prev, role }))
                            }
                            className={`p-4 rounded-xl border transition-all duration-200 ease-out hover:scale-[1.01] ${
                              isSelected
                                ? `${roleDisplay.bgColor} ${roleDisplay.borderColor} shadow-lg`
                                : "bg-white/5 border-white/10 hover:border-white/20"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <RoleIcon
                                className={`w-6 h-6 ${
                                  isSelected
                                    ? roleDisplay.color
                                    : "text-gray-400"
                                }`}
                              />
                              <div className="text-left flex-1">
                                <h5
                                  className={`font-medium ${
                                    isSelected
                                      ? roleDisplay.color
                                      : "text-white"
                                  }`}
                                >
                                  {roleDisplay.label}
                                </h5>
                                <p className="text-sm text-gray-400">
                                  {roleDisplay.description}
                                </p>
                              </div>
                              {isSelected && (
                                <CheckCircle
                                  className={`w-5 h-5 ${roleDisplay.color}`}
                                />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Info Card */}
                  <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <h4 className="text-blue-400 font-medium mb-1">
                          Invitation Details
                        </h4>
                        <p className="text-blue-200 text-sm">
                          The invite link will expire in 7 days. Recipients can
                          use it once to join the selected team with the
                          specified role.
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowInvitePopup(false)}
                      className="flex-1 border-white/10 text-gray-400 hover:text-white hover:border-cyan-500 backdrop-blur-sm hover:bg-white/10 transition-all duration-200 ease-out"
                      disabled={isGenerating}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleGenerateInvite}
                      disabled={
                        !inviteData.teamId ||
                        !inviteData.role ||
                        isGenerating ||
                        isLoadingTeams
                      }
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate Invite"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Generated Invite Popup */}
      {showGeneratedInvite && generatedInvite && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-cyan-600/20 rounded-3xl blur opacity-50" />
            <Card className="relative backdrop-blur-xl bg-gray-900/90 border border-white/20 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

              {/* Header */}
              <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/10">
                <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent">
                  Invite Link Generated!
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowGeneratedInvite(false)}
                  className="text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 ease-out hover:scale-105 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="relative z-10 p-6 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500">
                <div className="space-y-6">
                  {/* Team and Role Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="backdrop-blur-xl bg-white/5 border border-white/10 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm text-gray-400">Team</span>
                      </div>
                      <p className="text-white font-medium">
                        {generatedInvite.teamName}
                      </p>
                    </Card>
                    <Card className="backdrop-blur-xl bg-white/5 border border-white/10 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        {(() => {
                          const roleDisplay = getRoleDisplay(
                            generatedInvite.role
                          );
                          const RoleIcon = roleDisplay.icon;
                          return (
                            <>
                              <RoleIcon
                                className={`w-4 h-4 ${roleDisplay.color}`}
                              />
                              <span className="text-sm text-gray-400">
                                Role
                              </span>
                            </>
                          );
                        })()}
                      </div>
                      <p className="text-white font-medium">
                        {getRoleDisplay(generatedInvite.role).label}
                      </p>
                    </Card>
                  </div>

                  {/* Expiry Info */}
                  <Card className="backdrop-blur-xl bg-orange-500/10 border border-orange-500/30 p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-orange-400" />
                      <div>
                        <h4 className="text-orange-400 font-medium mb-1">
                          Expires
                        </h4>
                        <p className="text-orange-200 text-sm">
                          {formatExpiryDate(generatedInvite.expiresAt)}
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Invite Link */}
                  <div>
                    <Label className="text-white mb-3 block font-medium">
                      Invitation Link
                    </Label>
                    <div className="flex gap-2">
                      <div className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm break-all">
                        {generatedInvite.inviteLink}
                      </div>
                      <Button
                        onClick={handleCopyLink}
                        variant="outline"
                        className="border-white/10 bg-blue/10 text-gray-400 hover:text-white hover:border-cyan-500 backdrop-blur-sm hover:bg-white/10 transition-all duration-200 ease-out hover:scale-105"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Share Options */}
                  <div>
                    <Label className="text-white mb-3 block font-medium">
                      Share Invitation
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={handleShareViaEmail}
                        variant="outline"
                        className="border-white/10 text-gray-400 hover:text-white hover:border-blue-500 backdrop-blur-sm bg-blue/10 hover:bg-blue-500/10 transition-all duration-200 ease-out hover:scale-105"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                      <Button
                        onClick={handleShareViaWhatsApp}
                        variant="outline"
                        className="border-white/10 text-gray-400 bg-blue/10 hover:text-white hover:border-green-500 backdrop-blur-sm hover:bg-green-500/10 transition-all duration-200 ease-out hover:scale-105"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                      </Button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleCopyLink}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200 ease-out"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                    <Button
                      onClick={() => setShowGeneratedInvite(false)}
                      variant="outline"
                      className="border-white/10 bg-blue/10 text-gray-400 hover:text-white hover:border-cyan-500 backdrop-blur-sm hover:bg-white/10 transition-all duration-200 ease-out"
                    >
                      Done
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50">
          <Card className="backdrop-blur-xl bg-green-500/20 border border-green-500/30 p-4 rounded-xl shadow-2xl">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-green-200 font-medium">{successMessage}</p>
            </div>
          </Card>
        </div>
      )}

      {/* Error Toast */}
      {showError && (
        <div className="fixed top-4 right-4 z-50">
          <Card className="backdrop-blur-xl bg-red-500/20 border border-red-500/30 p-4 rounded-xl shadow-2xl">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-200 font-medium">{errorMessage}</p>
            </div>
          </Card>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
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
      `}</style>
    </>
  );
}
