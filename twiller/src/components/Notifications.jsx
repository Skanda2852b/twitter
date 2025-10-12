"use client";

import React, {
  useState,
  useEffect,
} from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";
import {
  Bell,
  Heart,
  Repeat2,
  MessageCircle,
  UserPlus,
  Settings,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";

const Notifications = () => {
  const { user } = useAuth();
  const [
    notifications,
    setNotifications,
  ] = useState([]);
  const [
    loading,
    setLoading,
  ] = useState(true);
  const [
    activeFilter,
    setActiveFilter,
  ] = useState("all");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications =
    async () => {
      try {
        // Mock notification data - in real app, this would come from backend
        const mockNotifications =
          [
            {
              id: 1,
              type: "like",
              user: {
                name: "TechGuru",
                username:
                  "techguru",
                avatar:
                  "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400",
              },
              tweet: {
                content:
                  "Just discovered an amazing new AI tool!",
                id: "tweet1",
              },
              timestamp:
                new Date(
                  Date.now() -
                    1000 *
                      60 *
                      30
                ), // 30 minutes ago
              read: false,
            },
            {
              id: 2,
              type: "retweet",
              user: {
                name: "ScienceDaily",
                username:
                  "sciencedaily",
                avatar:
                  "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
              },
              tweet: {
                content:
                  "New breakthrough in quantum computing research",
                id: "tweet2",
              },
              timestamp:
                new Date(
                  Date.now() -
                    1000 *
                      60 *
                      60 *
                      2
                ), // 2 hours ago
              read: false,
            },
            {
              id: 3,
              type: "follow",
              user: {
                name: "CricketFan",
                username:
                  "cricketfan",
                avatar:
                  "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
              },
              timestamp:
                new Date(
                  Date.now() -
                    1000 *
                      60 *
                      60 *
                      4
                ), // 4 hours ago
              read: true,
            },
            {
              id: 4,
              type: "mention",
              user: {
                name: "AILab",
                username:
                  "ailab",
                avatar:
                  "https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg?auto=compress&cs=tinysrgb&w=400",
              },
              tweet: {
                content:
                  "Thanks for the great discussion @" +
                  (user?.username ||
                    "user") +
                  "!",
                id: "tweet3",
              },
              timestamp:
                new Date(
                  Date.now() -
                    1000 *
                      60 *
                      60 *
                      6
                ), // 6 hours ago
              read: true,
            },
          ];

        setNotifications(
          mockNotifications
        );
      } catch (error) {
        console.error(
          "Error fetching notifications:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

  const getNotificationIcon =
    (type) => {
      switch (type) {
        case "like":
          return (
            <Heart className="h-4 w-4 text-red-500" />
          );
        case "retweet":
          return (
            <Repeat2 className="h-4 w-4 text-green-500" />
          );
        case "follow":
          return (
            <UserPlus className="h-4 w-4 text-blue-500" />
          );
        case "mention":
          return (
            <MessageCircle className="h-4 w-4 text-yellow-500" />
          );
        default:
          return (
            <Bell className="h-4 w-4 text-gray-500" />
          );
      }
    };

  const getNotificationText =
    (notification) => {
      switch (
        notification.type
      ) {
        case "like":
          return `liked your tweet`;
        case "retweet":
          return `retweeted your tweet`;
        case "follow":
          return `started following you`;
        case "mention":
          return `mentioned you in a tweet`;
        default:
          return "sent you a notification";
      }
    };

  const formatTime = (
    timestamp
  ) => {
    const now = new Date();
    const diff =
      now - timestamp;
    const minutes =
      Math.floor(
        diff / (1000 * 60)
      );
    const hours = Math.floor(
      diff / (1000 * 60 * 60)
    );
    const days = Math.floor(
      diff /
        (1000 * 60 * 60 * 24)
    );

    if (minutes < 60) {
      return `${minutes}m`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else {
      return `${days}d`;
    }
  };

  const markAsRead = (
    notificationId
  ) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id ===
        notificationId
          ? {
              ...notif,
              read: true,
            }
          : notif
      )
    );
  };

  const markAllAsRead =
    () => {
      setNotifications(
        (prev) =>
          prev.map(
            (notif) => ({
              ...notif,
              read: true,
            })
          )
      );
    };

  const filteredNotifications =
    notifications.filter(
      (notification) => {
        if (
          activeFilter ===
          "all"
        )
          return true;
        if (
          activeFilter ===
          "unread"
        )
          return !notification.read;
        return (
          notification.type ===
          activeFilter
        );
      }
    );

  const unreadCount =
    notifications.filter(
      (n) => !n.read
    ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">
          Loading
          notifications...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 bg-black/90 backdrop-blur-md border-b border-gray-800 z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">
              Notifications
            </h1>
            <div className="flex items-center gap-2">
              {unreadCount >
                0 && (
                <Badge className="bg-red-500 text-white">
                  {
                    unreadCount
                  }
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 py-3 border-b border-gray-800">
          <div className="flex space-x-4">
            {[
              {
                key: "all",
                label: "All",
              },
              {
                key: "unread",
                label:
                  "Unread",
              },
              {
                key: "like",
                label:
                  "Likes",
              },
              {
                key: "retweet",
                label:
                  "Retweets",
              },
              {
                key: "follow",
                label:
                  "Follows",
              },
              {
                key: "mention",
                label:
                  "Mentions",
              },
            ].map(
              (filter) => (
                <button
                  key={
                    filter.key
                  }
                  onClick={() =>
                    setActiveFilter(
                      filter.key
                    )
                  }
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    activeFilter ===
                    filter.key
                      ? "bg-blue-500 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  {
                    filter.label
                  }
                </button>
              )
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-gray-800">
          {filteredNotifications.length ===
          0 ? (
            <Card className="bg-black border-none">
              <CardContent className="py-12 text-center">
                <Bell className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <div className="text-gray-400">
                  <h3 className="text-lg font-semibold mb-2">
                    No
                    notifications
                    yet
                  </h3>
                  <p>
                    When you
                    get
                    notifications,
                    they'll
                    show up
                    here.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map(
              (
                notification
              ) => (
                <div
                  key={
                    notification.id
                  }
                  className={`p-4 hover:bg-gray-900 cursor-pointer ${
                    !notification.read
                      ? "bg-blue-900/10"
                      : ""
                  }`}
                  onClick={() =>
                    markAsRead(
                      notification.id
                    )
                  }
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(
                        notification.type
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={
                              notification
                                .user
                                .avatar
                            }
                          />
                          <AvatarFallback>
                            {notification.user.name.charAt(
                              0
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <span className="font-semibold text-white">
                            {
                              notification
                                .user
                                .name
                            }
                          </span>
                          <span className="text-gray-400 ml-1">
                            @
                            {
                              notification
                                .user
                                .username
                            }
                          </span>
                          <span className="text-gray-400 ml-1">
                            {getNotificationText(
                              notification
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">
                            {formatTime(
                              notification.timestamp
                            )}
                          </span>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>

                      {notification.tweet && (
                        <div className="ml-10 mt-2 p-3 bg-gray-800 rounded-lg">
                          <p className="text-gray-300 text-sm">
                            {
                              notification
                                .tweet
                                .content
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            )
          )}
        </div>

        {/* Mark All Read Button */}
        {unreadCount > 0 && (
          <div className="p-4 border-t border-gray-800">
            <Button
              onClick={
                markAllAsRead
              }
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
