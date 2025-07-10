"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Plus,
  CheckCircle,
  FolderPlus,
  FileText,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/axiosSetup/axios";

interface CreateProjectData {
  name: string;
  description: string;
}

interface CreateProjectClientProps {
  onProjectCreated?: () => void;
}

export function CreateProjectClient({
  onProjectCreated,
}: CreateProjectClientProps) {
  const router = useRouter();
  const [showCreateProjectPopup, setShowCreateProjectPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createProjectData, setCreateProjectData] = useState<CreateProjectData>(
    {
      name: "",
      description: "",
    }
  );

  const furl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  // Effect to handle body scroll when popup is active
  useEffect(() => {
    if (showCreateProjectPopup || showSuccess) {
      // Store the current scroll position
      const scrollY = window.scrollY;

      // Disable body scroll
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        // Re-enable body scroll and restore position
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [showCreateProjectPopup, showSuccess]);

  useEffect(() => {
    if (!showSuccess && successMessage) {
      // Clear success message
      setSuccessMessage("");

      // Refresh the main page
      if (onProjectCreated) {
        onProjectCreated();
      }
    }
  }, [showSuccess, successMessage, onProjectCreated]);

  const handleCreateProject = async () => {
    if (!createProjectData.name.trim()) {
      return;
    }

    setIsCreating(true);
    try {
      console.log("creating a project");
      const res = await axiosInstance.post("/projects/", createProjectData);
      console.log("project created");

      if (res.data.success) {
        setSuccessMessage(
          `Project "${createProjectData.name}" created successfully!`
        );
        setShowSuccess(true);

        // CLOSE THE CREATION POPUP AND RESET FORM
        setShowCreateProjectPopup(false);
        setCreateProjectData({ name: "", description: "" });

        // METHOD 1: Force refresh server components
        console.log("Router refresh entered");
        router.refresh();
        console.log("Router refresh done");

        // METHOD 2: Complete page reload (more reliable but less smooth)
        // window.location.reload();

        // METHOD 3: Navigate to the same page to trigger re-render
        // router.push(window.location.pathname);

        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
          // Additional refresh if needed
          if (onProjectCreated) {
            onProjectCreated();
          }
        }, 2000);
      }
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const closePopup = () => {
    setShowCreateProjectPopup(false);
    setCreateProjectData({ name: "", description: "" }); // Reset form
  };

  return (
    <>
      {/* Create Project Button */}
      <Button
        onClick={() => setShowCreateProjectPopup(true)}
        className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200 ease-out backdrop-blur-sm border border-white/10"
      >
        <Plus className="w-4 h-4 mr-2" />
        New Project
      </Button>

      {/* Create Project Popup */}
      {showCreateProjectPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-3xl blur opacity-50" />
            <Card className="relative backdrop-blur-xl bg-gray-900/90 border border-white/20 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

              {/* Header */}
              <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/10">
                <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Create New Project
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closePopup}
                  className="text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 ease-out hover:scale-105 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="relative z-10 p-6 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500">
                <div className="space-y-6">
                  {/* Project Name */}
                  <div>
                    <Label
                      htmlFor="projectName"
                      className="text-white mb-3 block font-medium"
                    >
                      Project Name *
                    </Label>
                    <div className="relative">
                      <FolderPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="projectName"
                        value={createProjectData.name}
                        onChange={(e) =>
                          setCreateProjectData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Enter project name..."
                        className="pl-10 backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-cyan-500 hover:border-white/20 transition-all duration-200 ease-out"
                      />
                    </div>
                  </div>

                  {/* Project Description */}
                  <div>
                    <Label
                      htmlFor="projectDescription"
                      className="text-white mb-3 block font-medium"
                    >
                      Description
                    </Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                      <textarea
                        id="projectDescription"
                        value={createProjectData.description}
                        onChange={(e) =>
                          setCreateProjectData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Describe your project goals and objectives..."
                        rows={4}
                        className="w-full pl-10 p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-all duration-200 ease-out resize-none hover:border-white/20"
                      />
                    </div>
                  </div>

                  {/* Info Card */}
                  <Card className="backdrop-blur-xl bg-cyan-500/10 border border-cyan-500/30 p-4 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-cyan-400 mt-0.5" />
                      <div>
                        <h4 className="text-cyan-400 font-medium mb-1">
                          What's Next?
                        </h4>
                        <p className="text-cyan-200 text-sm">
                          After creating the project, you'll be able to add
                          teams, assign members, and create tasks to get started
                          with collaboration.
                        </p>
                      </div>
                    </div>
                  </Card>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateProjectPopup(false)}
                      className="bg-white/10 flex-1 border-white/10 text-white hover:text-white hover:border-cyan-500 backdrop-blur-sm hover:bg-white/10 transition-all duration-200 ease-out"
                      disabled={isCreating}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateProject}
                      disabled={!createProjectData.name.trim() || isCreating}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCreating ? "Creating..." : "Create Project"}
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
