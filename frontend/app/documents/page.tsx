"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  FileText,
  Download,
  Share,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function DocumentsPage() {
  const documents = [
    {
      id: 1,
      name: "Project Requirements.docx",
      type: "document",
      size: "2.4 MB",
      modified: "2 hours ago",
      author: "Sarah Johnson",
      shared: true,
      color: "from-blue-500 to-cyan-600",
    },
    {
      id: 2,
      name: "Design System Guidelines.pdf",
      type: "pdf",
      size: "5.1 MB",
      modified: "1 day ago",
      author: "Mike Chen",
      shared: false,
      color: "from-red-500 to-pink-600",
    },
    {
      id: 3,
      name: "Meeting Notes - Q1 Planning.md",
      type: "markdown",
      size: "156 KB",
      modified: "3 days ago",
      author: "Emily Davis",
      shared: true,
      color: "from-green-500 to-emerald-600",
    },
    {
      id: 4,
      name: "API Documentation.docx",
      type: "document",
      size: "1.8 MB",
      modified: "1 week ago",
      author: "John Smith",
      shared: true,
      color: "from-purple-500 to-indigo-600",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Documents
            </h1>
            <p className="text-gray-400">
              Access and manage all your shared documents
            </p>
          </div>
          <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200 ease-out backdrop-blur-sm border border-white/10">
            <Plus className="w-4 h-4 mr-2" />
            New Document
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search documents..."
              className="pl-10 backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-cyan-500 hover:border-white/20 transition-all duration-200 ease-out"
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

        {/* Documents List */}
        <div className="space-y-4">
          {documents.map((doc) => (
            <Card
              key={doc.id}
              className="backdrop-blur-xl bg-white/5 border border-white/10 p-4 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 ease-out cursor-pointer group hover:scale-[1.01] rounded-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-r ${doc.color} flex items-center justify-center text-white shadow-lg transition-all duration-200 ease-out group-hover:scale-105`}
                  >
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white group-hover:text-cyan-400 transition-colors duration-200 ease-out">
                      {doc.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {doc.size} • Modified {doc.modified} by {doc.author}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {doc.shared && (
                    <div className="flex items-center text-green-400 text-sm backdrop-blur-sm bg-green-500/10 px-2 py-1 rounded-full border border-green-500/30 transition-all duration-200 ease-out">
                      <Share className="w-4 h-4 mr-1" />
                      Shared
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-200 ease-out hover:scale-105"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-200 ease-out hover:scale-105"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
