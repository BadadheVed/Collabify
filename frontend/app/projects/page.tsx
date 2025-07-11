import { MyProjectsServer } from "@/components/projects/myProjectServer";
import { MyProjectsSkeleton } from "@/components/projects/myProjectSkeleton";
import { CreateProjectClient } from "@/components/projects/createProjectClient";
import { Suspense } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Search, Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
export const dynamic = 'force-dynamic';
export default function ProjectsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Projects
            </h1>
            <p className="text-gray-400">
              Manage and track all your team projects
            </p>
          </div>
          <CreateProjectClient />
        </div>

        {/* My Projects Section with SSR */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            My Projects
          </h2>

          <Suspense fallback={<MyProjectsSkeleton />}>
            <MyProjectsServer />
          </Suspense>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700/50 my-8" />

        {/* All Projects Section - Static for now */}
        {/* <AllProjectsSection /> */}
      </div>
    </DashboardLayout>
  );
}

// Static All Projects Section Component
function AllProjectsSection() {
  const projects = [
    {
      id: 1,
      name: "Website Redesign",
      description:
        "Complete overhaul of the company website with modern design",
      team: "Design Team",
      members: 5,
      progress: 75,
      status: "active",
      dueDate: "2024-02-15",
      color: "from-cyan-500 to-blue-600",
    },
    {
      id: 2,
      name: "Mobile App Development",
      description: "Native mobile application for iOS and Android platforms",
      team: "Dev Team",
      members: 8,
      progress: 45,
      status: "active",
      dueDate: "2024-03-01",
      color: "from-purple-500 to-pink-600",
    },
    {
      id: 3,
      name: "Marketing Campaign",
      description: "Q1 marketing campaign for product launch",
      team: "Marketing",
      members: 3,
      progress: 90,
      status: "urgent",
      dueDate: "2024-01-30",
      color: "from-green-500 to-emerald-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          All Projects
        </h2>

        {/* Filters and Search */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search projects..."
              className="pl-10 w-64 backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-cyan-500 hover:border-white/20 transition-all duration-200 ease-out"
            />
          </div>
          <Button
            variant="outline"
            className="border-white/10 text-gray-400 hover:text-white hover:border-cyan-500 backdrop-blur-sm hover:bg-white/10 transition-all duration-200 ease-out hover:scale-105"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 ease-out cursor-pointer group hover:scale-[1.02] rounded-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-start justify-between">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${project.color} flex items-center justify-center text-white font-bold text-lg shadow-lg transition-all duration-200 ease-out group-hover:scale-105`}
                >
                  {project.name.charAt(0)}
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm transition-all duration-200 ease-out ${
                    project.status === "urgent"
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : "bg-green-500/20 text-green-400 border border-green-500/30"
                  }`}
                >
                  {project.status}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors duration-200 ease-out">
                  {project.name}
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  {project.description}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white font-medium">
                    {project.progress}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 backdrop-blur-sm">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${project.color} transition-all duration-300 ease-out shadow-lg`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>
                  {project.team} • {project.members} members
                </span>
                <span>
                  Due {new Date(project.dueDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
