"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  Filter,
  Users,
  FolderOpen,
  CheckSquare,
  MessageCircle,
  AlertTriangle,
  Info,
  Calendar,
  Clock,
  ChevronDown,
  MoreHorizontal,
  Eye,
  Search,
  Archive,
  Star,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BackendNotification {
  id: string;
  message: string;
  userId: string;
  read: boolean;
  createdAt: string;
  expiresAt: string;
  type?: 'task' | 'team' | 'project' | 'mention' | 'system';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export function NotificationsPageClient() {
  const [notifications, setNotifications] = useState<BackendNotification[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'task' | 'team' | 'project' | 'mention' | 'system'>('ALL');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<BackendNotification | null>(null);
  const [showNotificationDetail, setShowNotificationDetail] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setIsClient(true);
    loadNotifications();
  }, []);

  const furl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      // Mock API call - replace with real API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockNotifications: BackendNotification[] = [
        {
          id: "notif-1",
          message: "You've been assigned to 'Implement User Authentication' in E-commerce Platform",
          userId: "user-1",
          read: false,
          createdAt: "2024-02-15T10:30:00Z",
          expiresAt: "2024-03-15T10:30:00Z",
          type: "task",
          priority: "high"
        },
        {
          id: "notif-2", 
          message: "You've been invited to join Frontend Development team",
          userId: "user-1",
          read: false,
          createdAt: "2024-02-15T09:15:00Z",
          expiresAt: "2024-03-15T09:15:00Z",
          type: "team",
          priority: "medium"
        },
        {
          id: "notif-3",
          message: "Task 'Design Product Catalog UI' is due tomorrow",
          userId: "user-1",
          read: false,
          createdAt: "2024-02-15T08:00:00Z",
          expiresAt: "2024-03-15T08:00:00Z",
          type: "task",
          priority: "urgent"
        },
        {
          id: "notif-4",
          message: "Carol Davis completed 'Setup CI/CD Pipeline'",
          userId: "user-1",
          read: true,
          createdAt: "2024-02-14T16:45:00Z",
          expiresAt: "2024-03-14T16:45:00Z",
          type: "project",
          priority: "low"
        },
        {
          id: "notif-5",
          message: "David Wilson mentioned you in a comment on 'API Documentation'",
          userId: "user-1",
          read: true,
          createdAt: "2024-02-14T14:20:00Z",
          expiresAt: "2024-03-14T14:20:00Z",
          type: "mention",
          priority: "medium"
        },
        {
          id: "notif-6",
          message: "System maintenance scheduled for tonight at 2:00 AM",
          userId: "user-1",
          read: false,
          createdAt: "2024-02-14T12:00:00Z",
          expiresAt: "2024-03-14T12:00:00Z",
          type: "system",
          priority: "medium"
        }
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case 'task': return CheckSquare;
      case 'team': return Users;
      case 'project': return FolderOpen;
      case 'mention': return MessageCircle;
      case 'system': return Settings;
      default: return Bell;
    }
  };

  const getNotificationColor = (type?: string) => {
    switch (type) {
      case 'task': return 'text-green-400';
      case 'team': return 'text-purple-400';
      case 'project': return 'text-cyan-400';
      case 'mention': return 'text-orange-400';
      case 'system': return 'text-gray-400';
      default: return 'text-blue-400';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-500/50 bg-red-500/10';
      case 'high': return 'border-orange-500/50 bg-orange-500/10';
      case 'medium': return 'border-yellow-500/50 bg-yellow-500/10';
      case 'low': return 'border-gray-500/50 bg-gray-500/10';
      default: return 'border-white/10 bg-white/5';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    if (!isClient) return "Loading...";
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours}h ago`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays}d ago`;
      
      return date.toLocaleDateString();
    } catch (error) {
      return "Invalid date";
    }
  };

  const formatDetailedTime = (dateString: string) => {
    if (!isClient) return "Loading...";
    
    try {
      const date = new Date(dateString);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const timeString = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
      if (date.toDateString() === today.toDateString()) {
        return `Today ${timeString}`;
      } else if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday ${timeString}`;
      } else {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }) + ` ${timeString}`;
      }
    } catch (error) {
      return "Invalid date";
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      setNotifications(prev => 
        prev.filter(notif => notif.id !== notificationId)
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const deleteSelected = async () => {
    try {
      setNotifications(prev => 
        prev.filter(notif => !selectedNotifications.includes(notif.id))
      );
      setSelectedNotifications([]);
    } catch (error) {
      console.error("Error deleting selected notifications:", error);
    }
  };

  const handleNotificationClick = (notification: BackendNotification) => {
    setSelectedNotification(notification);
    setShowNotificationDetail(true);
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const toggleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const filteredNotifications = notifications.filter(notif => {
    // Apply read/unread filter
    if (filter === 'UNREAD' && notif.read) return false;
    if (filter === 'READ' && !notif.read) return false;
    
    // Apply type filter
    if (typeFilter !== 'ALL' && notif.type !== typeFilter) return false;
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return notif.message.toLowerCase().includes(query);
    }
    
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const totalCount = notifications.length;

  const getStats = () => {
    const stats = {
      unread: notifications.filter(n => !n.read).length,
      read: notifications.filter(n => n.read).length,
      urgent: notifications.filter(n => n.priority === 'urgent').length,
      total: notifications.length
    };
    return stats;
  };

  const stats = getStats();

  return (
    <>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="backdrop-blur-xl bg-cyan-500/10 border border-cyan-500/30 p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <Bell className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-cyan-400">{stats.unread}</p>
              <p className="text-cyan-200 text-sm">Unread</p>
            </div>
          </div>
        </Card>

        <Card className="backdrop-blur-xl bg-green-500/10 border border-green-500/30 p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CheckCheck className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">{stats.read}</p>
              <p className="text-green-200 text-sm">Read</p>
            </div>
          </div>
        </Card>

        <Card className="backdrop-blur-xl bg-red-500/10 border border-red-500/30 p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-400">{stats.urgent}</p>
              <p className="text-red-200 text-sm">Urgent</p>
            </div>
          </div>
        </Card>

        <Card className="backdrop-blur-xl bg-purple-500/10 border border-purple-500/30 p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Archive className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-400">{stats.total}</p>
              <p className="text-purple-200 text-sm">Total</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-cyan-500 hover:border-white/20 transition-all duration-200 ease-out"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Read Status Filter */}
            <div className="flex gap-2">
              {[
                { key: 'ALL', label: 'All' },
                { key: 'UNREAD', label: 'Unread' },
                { key: 'READ', label: 'Read' }
              ].map((filterOption) => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ease-out hover:scale-105 ${
                    filter === filterOption.key
                      ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>

            {/* Type Filter */}
            <div className="flex gap-2">
              {[
                { key: 'ALL', label: 'All Types' },
                { key: 'task', label: 'Tasks' },
                { key: 'team', label: 'Teams' },
                { key: 'project', label: 'Projects' },
                { key: 'mention', label: 'Mentions' },
                { key: 'system', label: 'System' }
              ].map((typeOption) => (
                <button
                  key={typeOption.key}
                  onClick={() => setTypeFilter(typeOption.key as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ease-out hover:scale-105 ${
                    typeFilter === typeOption.key
                      ? 'bg-purple-500/20 border border-purple-500/50 text-purple-400'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  {typeOption.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedNotifications.length > 0 && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <span className="text-cyan-400 text-sm font-medium">
                {selectedNotifications.length} selected
              </span>
              <Button
                size="sm"
                onClick={deleteSelected}
                variant="outline"
                className="border-red-500/30 text-red-400 hover:text-red-300 hover:border-red-400 backdrop-blur-sm hover:bg-red-500/10 transition-all duration-200 ease-out"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Delete
              </Button>
              <Button
                size="sm"
                onClick={() => setSelectedNotifications([])}
                variant="outline"
                className="border-white/10 text-gray-400 hover:text-white hover:border-cyan-500 backdrop-blur-sm hover:bg-white/10 transition-all duration-200 ease-out"
              >
                Clear Selection
              </Button>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button
              onClick={markAllAsRead}
              size="sm"
              variant="outline"
              className="border-white/10 text-gray-400 hover:text-white hover:border-cyan-500 backdrop-blur-sm hover:bg-white/10 transition-all duration-200 ease-out"
            >
              <CheckCheck className="w-3 h-3 mr-1" />
              Mark All Read
            </Button>
          </div>
        </div>
      </Card>

      {/* Notifications List */}
      <Card className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                All Notifications ({filteredNotifications.length})
              </h2>
              <div className="text-sm text-gray-400">
                {searchQuery && `Filtered by "${searchQuery}"`}
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400 text-sm">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-white font-medium mb-2">No notifications found</h4>
              <p className="text-gray-400 text-sm">
                {searchQuery ? `No notifications match "${searchQuery}"` : "You're all caught up!"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {filteredNotifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                const iconColor = getNotificationColor(notification.type);
                const priorityStyle = getPriorityColor(notification.priority);
                
                return (
                  <div
                    key={notification.id}
                    className={`p-6 hover:bg-white/5 transition-all duration-200 ease-out cursor-pointer group ${
                      !notification.read ? 'bg-cyan-500/5 border-l-4 border-cyan-500/50' : ''
                    } ${priorityStyle}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedNotifications.includes(notification.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleSelectNotification(notification.id);
                          }}
                          className="rounded border-gray-600 bg-gray-700 hover:border-cyan-500 transition-colors duration-200"
                        />
                        <div className={`w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 ${
                          !notification.read ? 'bg-cyan-500/20' : ''
                        }`}>
                          <Icon className={`w-5 h-5 ${iconColor}`} />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm line-clamp-2 ${
                            !notification.read ? 'text-white font-medium' : 'text-gray-300'
                          }`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2">
                            {notification.priority === 'urgent' && (
                              <div className="px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/30">
                                Urgent
                              </div>
                            )}
                            {!notification.read && (
                              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 transition-all duration-200 ease-out"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatTimeAgo(notification.createdAt)}</span>
                            </div>
                            {notification.type && (
                              <div className="flex items-center gap-1">
                                <span className="capitalize">{notification.type}</span>
                              </div>
                            )}
                          </div>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-cyan-400 hover:text-cyan-300 text-xs p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNotificationClick(notification);
                            }}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* Notification Detail Popup */}
      {showNotificationDetail && selectedNotification && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-2xl blur opacity-50" />
            <Card className="relative backdrop-blur-xl bg-gray-900/95 border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              
              {/* Header */}
              <div className="relative z-10 flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white">Notification Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotificationDetail(false)}
                  className="text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 ease-out hover:scale-105 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="relative z-10 p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${getPriorityColor(selectedNotification.priority)} flex items-center justify-center`}>
                      {(() => {
                        const Icon = getNotificationIcon(selectedNotification.type);
                        const iconColor = getNotificationColor(selectedNotification.type);
                        return <Icon className={`w-5 h-5 ${iconColor}`} />;
                      })()}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">
                        {selectedNotification.type?.charAt(0).toUpperCase() + selectedNotification.type?.slice(1)} Notification
                      </p>
                      <p className="text-gray-400 text-sm">{formatDetailedTime(selectedNotification.createdAt)}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-white leading-relaxed">
                      {selectedNotification.message}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <span className="text-white ml-2">
                        {selectedNotification.read ? 'Read' : 'Unread'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Priority:</span>
                      <span className="text-white ml-2 capitalize">
                        {selectedNotification.priority || 'Normal'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!selectedNotification.read && (
                      <Button
                        onClick={() => {
                          markAsRead(selectedNotification.id);
                          setShowNotificationDetail(false);
                        }}
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200 ease-out"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Mark as Read
                      </Button>
                    )}
                    <Button
                      onClick={() => {
                        deleteNotification(selectedNotification.id);
                        setShowNotificationDetail(false);
                      }}
                      variant="outline"
                      className="border-white/10 text-gray-400 hover:text-red-400 hover:border-red-500 backdrop-blur-sm hover:bg-red-500/10 transition-all duration-200 ease-out"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}