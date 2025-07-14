"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowLeft,
  Crown,
  Star,
  Shield,
  Calendar,
  User,
  Building,
  Loader2,
  ExternalLink,
  UserPlus,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { axiosInstance } from "@/axiosSetup/axios";
interface TeamInvite {
  id: string;
  teamId: string;
  teamName: string;
  projectName: string;
  inviterName: string;
  inviterEmail: string;
  role: "ADMIN" | "MANAGER" | "MEMBER";
  expiresAt: string;
  createdAt: string;
  isValid: boolean;
  isExpired: boolean;
}

interface TeamInviteClientProps {
  inviteToken: string;
}

type InviteState =
  | "loading"
  | "valid"
  | "invalid"
  | "expired"
  | "error"
  | "processing"
  | "success"
  | "rejected";
type AuthState =
  | "checking"
  | "authenticated"
  | "unauthenticated"
  | "redirecting";

export function TeamInviteClient({ inviteToken }: TeamInviteClientProps) {
  const router = useRouter();

  const [inviteState, setInviteState] = useState<InviteState>("loading");
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [invite, setInvite] = useState<TeamInvite | null>(null);
  const [countdown, setCountdown] = useState(4);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationType, setConfirmationType] = useState<"accept" | "reject">(
    "accept"
  );
  const [isClient, setIsClient] = useState(false);

  const furl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    setIsClient(true);
    validateInvite();
    checkAuthStatus();
  }, [inviteToken]);

  // Countdown timer for redirect
  useEffect(() => {
    if (authState === "redirecting" && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (authState === "redirecting" && countdown === 0) {
      // Preserve invite token in URL for return after login
      const returnUrl = encodeURIComponent(`/join-team/${inviteToken}`);
      router.push(`/login?returnUrl=${returnUrl}`);
    }
  }, [authState, countdown, inviteToken, router]);

  const validateInvite = async () => {
    try {
      const response = await axiosInstance.get(
        `/teams/invite/validate/${inviteToken}`
      );

      if (response.data.success && response.data.invite) {
        setInvite(response.data.invite);
        setInviteState(response.data.invite.isExpired ? "expired" : "valid");
      } else {
        setInviteState("invalid");
      }
    } catch (error: any) {
      console.error("Error validating invite:", error);
      if (error.response?.status === 404) {
        setInviteState("invalid");
      } else {
        setInviteState("error");
      }
    }
  };

  const checkAuthStatus = async () => {
    try {
      // // Mock auth check - replace with real auth
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      // // Mock: user is not authenticated
      // const isAuthenticated = false; // Change to true to test authenticated flow

      // if (isAuthenticated) {
      //   setAuthState("authenticated");
      // } else {
      //   setAuthState("unauthenticated");
      // }

      // Uncomment for real auth check:

      // const response = await fetch(`${furl}/auth/me`, {
      //   method: 'GET',
      //   credentials: 'include',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });
      const res = await axiosInstance.get("/auth/me");
      const response = res.data;
      if (response.success) {
        setAuthState("authenticated");
      } else {
        setAuthState("unauthenticated");
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setAuthState("unauthenticated");
    }
  };

  const handleAcceptInvite = async () => {
    setInviteState("processing");
    try {
      const response = await axiosInstance.post(
        `teams/invite/accept/${inviteToken}`
      );
      if (response.data.success) {
        setInviteState("success");
        setTimeout(() => router.push("/teams"), 2000);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        setAuthState("redirecting");
      } else {
        setInviteState("error");
      }
    }
  };

  const handleRejectInvite = async () => {
    setInviteState("processing");
    try {
      const response = await axiosInstance.post(
        `/teams/invites/reject/${inviteToken}`
      );

      if (response.data.success) {
        setInviteState("rejected");
      } else {
        setInviteState("error");
      }
    } catch (error: any) {
      console.error("Error rejecting invite:", error);
      setInviteState("error");
    }
  };

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

  const formatDate = (dateString: string) => {
    if (!isClient) return "Loading...";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
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

  const getTimeUntilExpiry = (expiryDate: string) => {
    if (!isClient) return "Loading...";

    try {
      const now = new Date();
      const expiry = new Date(expiryDate);
      const diffTime = expiry.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) return "Expired";
      if (diffDays === 1) return "Expires in 1 day";
      return `Expires in ${diffDays} days`;
    } catch (error) {
      return "Unknown";
    }
  };

  const showConfirmDialog = (type: "accept" | "reject") => {
    setConfirmationType(type);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    if (confirmationType === "accept") {
      handleAcceptInvite();
    } else {
      handleRejectInvite();
    }
  };

  // Loading state
  if (inviteState === "loading" || authState === "checking") {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-2xl blur opacity-50" />
        <Card className="relative backdrop-blur-xl bg-gray-800/90 border border-white/20 rounded-2xl p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />
          <div className="relative z-10 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-6"></div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Validating Invitation
            </h2>
            <p className="text-gray-400">
              Please wait while we verify your invitation...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Redirect countdown
  if (authState === "redirecting") {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-600/20 rounded-2xl blur opacity-50" />
        <Card className="relative backdrop-blur-xl bg-gray-800/90 border border-white/20 rounded-2xl p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-6 border border-orange-500/30">
              <div className="text-3xl font-bold text-orange-400">
                {countdown}
              </div>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-400 mb-4">
              You need to sign in to accept this invitation.
            </p>
            <p className="text-orange-400 text-sm">
              Redirecting to login in {countdown} seconds...
            </p>
            <Button
              onClick={() => {
                const returnUrl = encodeURIComponent(
                  `/join-team/${inviteToken}`
                );
                window.location.href = `/login?returnUrl=${returnUrl}`;
              }}
              className="mt-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 hover:scale-105 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-200 ease-out"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Sign In Now
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Invalid invite
  if (inviteState === "invalid") {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-600/20 rounded-2xl blur opacity-50" />
        <Card className="relative backdrop-blur-xl bg-gray-800/90 border border-white/20 rounded-2xl p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />
          <div className="relative z-10 text-center">
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Invalid Invitation
            </h2>
            <p className="text-gray-400 mb-6">
              This invitation link is not valid or has been revoked.
            </p>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="border-white/10 text-gray-400 hover:text-white hover:border-cyan-500 backdrop-blur-sm hover:bg-white/10 transition-all duration-200 ease-out"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Expired invite
  if (inviteState === "expired") {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-600/20 rounded-2xl blur opacity-50" />
        <Card className="relative backdrop-blur-xl bg-gray-800/90 border border-white/20 rounded-2xl p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />
          <div className="relative z-10 text-center">
            <Clock className="w-16 h-16 text-orange-400 mx-auto mb-6" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Invitation Expired
            </h2>
            <p className="text-gray-400 mb-6">
              This invitation has expired. Please request a new invitation from
              your team administrator.
            </p>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="border-white/10 text-gray-400 hover:text-white hover:border-cyan-500 backdrop-blur-sm hover:bg-white/10 transition-all duration-200 ease-out"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Error state
  if (inviteState === "error") {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-600/20 rounded-2xl blur opacity-50" />
        <Card className="relative backdrop-blur-xl bg-gray-800/90 border border-white/20 rounded-2xl p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />
          <div className="relative z-10 text-center">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-6" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Something Went Wrong
            </h2>
            <p className="text-gray-400 mb-6">
              We encountered an error while processing your invitation. Please
              try again later.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200 ease-out"
              >
                Try Again
              </Button>
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="border-white/10 text-gray-400 hover:text-white hover:border-cyan-500 backdrop-blur-sm hover:bg-white/10 transition-all duration-200 ease-out"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go to Home
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Processing state
  if (inviteState === "processing") {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-2xl blur opacity-50" />
        <Card className="relative backdrop-blur-xl bg-gray-800/90 border border-white/20 rounded-2xl p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />
          <div className="relative z-10 text-center">
            <Loader2 className="w-12 h-12 text-cyan-400 mx-auto mb-6 animate-spin" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Processing...
            </h2>
            <p className="text-gray-400">
              Please wait while we process your response...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Success state
  if (inviteState === "success") {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-2xl blur opacity-50" />
        <Card className="relative backdrop-blur-xl bg-gray-800/90 border border-white/20 rounded-2xl p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />
          <div className="relative z-10 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Welcome to the Team!
            </h2>
            <p className="text-gray-400 mb-6">
              You have successfully joined {invite?.teamName}. You can now
              access team resources and collaborate with your teammates.
            </p>
            <Button
              onClick={() => router.push("/teams")}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:scale-105 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-200 ease-out"
            >
              <Users className="w-4 h-4 mr-2" />
              Go to Teams
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Rejected state
  if (inviteState === "rejected") {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 to-slate-600/20 rounded-2xl blur opacity-50" />
        <Card className="relative backdrop-blur-xl bg-gray-800/90 border border-white/20 rounded-2xl p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />
          <div className="relative z-10 text-center">
            <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Invitation Declined
            </h2>
            <p className="text-gray-400 mb-6">
              You have declined the invitation to join {invite?.teamName}.
            </p>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="border-white/10 text-gray-400 hover:text-white hover:border-cyan-500 backdrop-blur-sm hover:bg-white/10 transition-all duration-200 ease-out"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Valid invite display
  if (inviteState === "valid" && invite) {
    const roleDisplay = getRoleDisplay(invite.role);
    const RoleIcon = roleDisplay.icon;

    return (
      <>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-2xl blur opacity-50" />
          <Card className="relative backdrop-blur-xl bg-gray-800/90 border border-white/20 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 p-6 border-b border-white/10 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Team Invitation
              </h1>
              <p className="text-gray-400">
                You've been invited to join a team
              </p>
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 space-y-6">
              {/* Team Info */}
              <div className="text-center">
                <h2 className="text-xl font-semibold text-white mb-2">
                  {invite.teamName}
                </h2>
                <p className="text-gray-400 mb-4">{invite.projectName}</p>

                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${roleDisplay.bgColor} ${roleDisplay.borderColor} border`}
                >
                  <RoleIcon className={`w-4 h-4 ${roleDisplay.color}`} />
                  <span className={roleDisplay.color}>
                    Join as {roleDisplay.label}
                  </span>
                </div>
              </div>

              {/* Invitation Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <User className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-sm text-gray-400">Invited by</p>
                    <p className="text-white font-medium">
                      {invite.inviterName}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {invite.inviterEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <Building className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">Project</p>
                    <p className="text-white font-medium">
                      {invite.projectName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <Calendar className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="text-sm text-gray-400">Invitation expires</p>
                    <p className="text-white font-medium">
                      {formatDate(invite.expiresAt)}
                    </p>
                    <p className="text-orange-400 text-xs">
                      {getTimeUntilExpiry(invite.expiresAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => showConfirmDialog("reject")}
                  variant="outline"
                  className="flex-1 bg-red-900 border-white/10 text-white hover:text-red-400 hover:border-red-500 backdrop-blur-sm hover:bg-red-500/10 transition-all duration-200 ease-out"
                >
                  <X className="w-4 h-4 mr-2" />
                  Decline
                </Button>
                <Button
                  onClick={() => showConfirmDialog("accept")}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200 ease-out"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Accept Invitation
                </Button>
              </div>

              {authState === "unauthenticated" && (
                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5" />
                    <div>
                      <h4 className="text-orange-400 font-medium mb-1">
                        Sign In Required
                      </h4>
                      <p className="text-orange-200 text-sm">
                        You'll need to sign in to accept this invitation. We'll
                        redirect you to the login page.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Confirmation Dialog */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
            <div className="relative w-full max-w-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-2xl blur opacity-50" />
              <Card className="relative backdrop-blur-xl bg-gray-900/95 border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                <div className="relative z-10 p-6">
                  <div className="text-center">
                    <div
                      className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center ${
                        confirmationType === "accept"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {confirmationType === "accept" ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <X className="w-6 h-6" />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {confirmationType === "accept"
                        ? "Accept Invitation?"
                        : "Decline Invitation?"}
                    </h3>
                    <p className="text-gray-400 text-sm mb-6">
                      {confirmationType === "accept"
                        ? `You'll join ${invite.teamName} as a ${roleDisplay.label.toLowerCase()} and gain access to team resources.`
                        : `You'll decline the invitation to join ${invite.teamName}. This action cannot be undone.`}
                    </p>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => setShowConfirmation(false)}
                        variant="outline"
                        className="flex-1 border-white/10 text-gray-400 hover:text-white hover:border-cyan-500 backdrop-blur-sm hover:bg-white/10 transition-all duration-200 ease-out"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleConfirm}
                        className={`flex-1 transition-all duration-200 ease-out hover:scale-105 hover:shadow-xl ${
                          confirmationType === "accept"
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:shadow-green-500/30"
                            : "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 hover:shadow-red-500/30"
                        }`}
                      >
                        {confirmationType === "accept" ? "Accept" : "Decline"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}
