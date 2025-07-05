// components/CreateTaskPopup.tsx
"use client";
import { useState } from "react";
import { X, Building, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/axiosSetup/axios";

interface Team {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface CreateTaskData {
  title: string;
  description: string;
  dueDate: string;
  teamId: string;
  assignedToId: string;
  projectId: string;
}

interface CreateTaskPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (taskData: CreateTaskData) => void;
  adminTeams: Team[];
}

export default function CreateTaskPopup({
  isOpen,
  onClose,
  onCreateTask,
  adminTeams,
}: CreateTaskPopupProps) {
  const [createTaskData, setCreateTaskData] = useState<CreateTaskData>({
    title: "",
    description: "",
    dueDate: "",
    teamId: "",
    assignedToId: "",
    projectId: "",
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");

  const handleTeamSelection = async (teamId: string) => {
    const selectedTeam = adminTeams.find((team) => team.id === teamId);
    if (selectedTeam) {
      setCreateTaskData((prev) => ({
        ...prev,
        teamId,
        projectId: selectedTeam.projectId,
      }));
      console.log("Fetching Teams");
      const response = await axiosInstance.get(`/teams/${teamId}/members`);
      console.log("Fetching TeamMembers");
      const teamMembers = response.data;
      setTeamMembers(teamMembers);
      // setTeamMembers([
      //   {
      //     id: "user-1",
      //     name: "Alice Johnson",
      //     email: "alice@company.com",
      //     role: "MEMBER",
      //   },
      //   {
      //     id: "user-2",
      //     name: "Bob Smith",
      //     email: "bob@company.com",
      //     role: "MEMBER",
      //   },
      // ]);
    }
  };

  const handleSubmit = () => {
    if (
      createTaskData.title &&
      createTaskData.teamId &&
      createTaskData.assignedToId
    ) {
      onCreateTask(createTaskData);
    }
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    } catch (error) {
      return "";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-3xl blur opacity-50" />
        <Card className="relative backdrop-blur-xl bg-gray-900/90 border border-white/20 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/10">
            <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Create New Task
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
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
                <Label htmlFor="teamSelect" className="text-white mb-2 block">
                  Select Team
                </Label>
                <select
                  id="teamSelect"
                  value={createTaskData.teamId}
                  onChange={(e) => handleTeamSelection(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-500 focus:outline-none transition-all duration-200 ease-out"
                >
                  <option value="" className="bg-gray-800">
                    Select a team...
                  </option>
                  {adminTeams.map((team) => (
                    <option
                      key={team.id}
                      value={team.id}
                      className="bg-gray-800"
                    >
                      {team.name} - {team.projectName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Task Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="taskTitle" className="text-white mb-2 block">
                    Task Title
                  </Label>
                  <Input
                    id="taskTitle"
                    value={createTaskData.title}
                    onChange={(e) =>
                      setCreateTaskData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Enter task title..."
                    className="backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-cyan-500 hover:border-white/20 transition-all duration-200 ease-out"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label
                    htmlFor="taskDescription"
                    className="text-white mb-2 block"
                  >
                    Description
                  </Label>
                  <textarea
                    id="taskDescription"
                    value={createTaskData.description}
                    onChange={(e) =>
                      setCreateTaskData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Enter task description..."
                    rows={3}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-all duration-200 ease-out resize-none"
                  />
                </div>

                <div>
                  <Label htmlFor="dueDate" className="text-white mb-2 block">
                    Due Date
                  </Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formatDateForInput(createTaskData.dueDate)}
                    onChange={(e) =>
                      setCreateTaskData((prev) => ({
                        ...prev,
                        dueDate: e.target.value,
                      }))
                    }
                    className="backdrop-blur-xl bg-white/5 border border-white/10 text-white focus:border-cyan-500 hover:border-white/20 transition-all duration-200 ease-out"
                  />
                </div>
              </div>

              {/* Team Members Selection */}
              {teamMembers.length > 0 && (
                <div>
                  <Label className="text-white mb-3 block">
                    Assign to Team Member
                  </Label>
                  <div className="grid grid-cols-1 gap-3">
                    {teamMembers.map((member, index) => (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => {
                          setSelectedMemberId(member.id);
                          setCreateTaskData((prev) => ({
                            ...prev,
                            assignedToId: member.id,
                          }));
                        }}
                        className={`p-4 rounded-xl border transition-all duration-200 ease-out hover:scale-[1.01] ${
                          selectedMemberId === member.id
                            ? "bg-cyan-500/20 border-cyan-500/50 shadow-lg shadow-cyan-500/20"
                            : "bg-white/5 border-white/10 hover:border-white/20"
                        }`}
                      >
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
                          <div className="text-left">
                            <h5
                              className={`font-medium ${
                                selectedMemberId === member.id
                                  ? "text-cyan-400"
                                  : "text-white"
                              }`}
                            >
                              {member.name}
                            </h5>
                            <p className="text-sm text-gray-400">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-white/10 text-gray-400 hover:text-white hover:border-cyan-500 backdrop-blur-sm hover:bg-white/10 transition-all duration-200 ease-out"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={
                    !createTaskData.title ||
                    !createTaskData.teamId ||
                    !createTaskData.assignedToId
                  }
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Task
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
