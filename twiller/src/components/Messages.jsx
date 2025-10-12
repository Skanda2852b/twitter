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
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  MessageCircle,
  Search,
  Send,
  MoreHorizontal,
  Phone,
  Video,
  Smile,
  Paperclip,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Messages = () => {
  const { user } = useAuth();
  const [
    conversations,
    setConversations,
  ] = useState([]);
  const [
    selectedConversation,
    setSelectedConversation,
  ] = useState(null);
  const [
    newMessage,
    setNewMessage,
  ] = useState("");
  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations =
    async () => {
      // Mock conversation data
      const mockConversations =
        [
          {
            id: 1,
            user: {
              name: "TechGuru",
              username:
                "techguru",
              avatar:
                "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400",
              online: true,
            },
            lastMessage:
              "Hey! Did you see the new AI announcement?",
            timestamp:
              new Date(
                Date.now() -
                  1000 *
                    60 *
                    30
              ),
            unreadCount: 2,
          },
          {
            id: 2,
            user: {
              name: "ScienceDaily",
              username:
                "sciencedaily",
              avatar:
                "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
              online: false,
            },
            lastMessage:
              "Thanks for sharing that research paper!",
            timestamp:
              new Date(
                Date.now() -
                  1000 *
                    60 *
                    60 *
                    2
              ),
            unreadCount: 0,
          },
          {
            id: 3,
            user: {
              name: "CricketFan",
              username:
                "cricketfan",
              avatar:
                "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
              online: true,
            },
            lastMessage:
              "What do you think about the match yesterday?",
            timestamp:
              new Date(
                Date.now() -
                  1000 *
                    60 *
                    60 *
                    4
              ),
            unreadCount: 1,
          },
        ];
      setConversations(
        mockConversations
      );
    };

  const getMessages = (
    conversationId
  ) => {
    // Mock messages data
    const mockMessages = [
      {
        id: 1,
        sender: "techguru",
        content:
          "Hey! Did you see the new AI announcement?",
        timestamp: new Date(
          Date.now() -
            1000 * 60 * 30
        ),
        isOwn: false,
      },
      {
        id: 2,
        sender:
          user?.username ||
          "user",
        content:
          "Yes! It's incredible what they've achieved",
        timestamp: new Date(
          Date.now() -
            1000 * 60 * 25
        ),
        isOwn: true,
      },
      {
        id: 3,
        sender: "techguru",
        content:
          "The implications for our field are huge",
        timestamp: new Date(
          Date.now() -
            1000 * 60 * 20
        ),
        isOwn: false,
      },
    ];
    return mockMessages;
  };

  const handleSendMessage =
    () => {
      if (
        !newMessage.trim() ||
        !selectedConversation
      )
        return;

      // In a real app, this would send the message to the backend
      console.log(
        "Sending message:",
        newMessage
      );
      setNewMessage("");
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

  const filteredConversations =
    conversations.filter(
      (conv) =>
        conv.user.name
          .toLowerCase()
          .includes(
            searchQuery.toLowerCase()
          ) ||
        conv.user.username
          .toLowerCase()
          .includes(
            searchQuery.toLowerCase()
          )
    );

  return (
    <div className="min-h-screen bg-black flex">
      {/* Conversations Sidebar */}
      <div className="w-1/3 border-r border-gray-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white mb-4">
            Messages
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search messages"
              value={
                searchQuery
              }
              onChange={(e) =>
                setSearchQuery(
                  e.target
                    .value
                )
              }
              className="pl-10 bg-gray-900 border-gray-700 text-white"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map(
            (
              conversation
            ) => (
              <div
                key={
                  conversation.id
                }
                onClick={() =>
                  setSelectedConversation(
                    conversation
                  )
                }
                className={`p-4 hover:bg-gray-900 cursor-pointer border-b border-gray-800 ${
                  selectedConversation?.id ===
                  conversation.id
                    ? "bg-gray-900"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={
                          conversation
                            .user
                            .avatar
                        }
                      />
                      <AvatarFallback>
                        {conversation.user.name.charAt(
                          0
                        )}
                      </AvatarFallback>
                    </Avatar>
                    {conversation
                      .user
                      .online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white truncate">
                        {
                          conversation
                            .user
                            .name
                        }
                      </h3>
                      <span className="text-sm text-gray-400">
                        {formatTime(
                          conversation.timestamp
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-400 truncate">
                        {
                          conversation.lastMessage
                        }
                      </p>
                      {conversation.unreadCount >
                        0 && (
                        <Badge className="bg-blue-500 text-white text-xs">
                          {
                            conversation.unreadCount
                          }
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={
                      selectedConversation
                        .user
                        .avatar
                    }
                  />
                  <AvatarFallback>
                    {selectedConversation.user.name.charAt(
                      0
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-white">
                    {
                      selectedConversation
                        .user
                        .name
                    }
                  </h3>
                  <p className="text-sm text-gray-400">
                    @
                    {
                      selectedConversation
                        .user
                        .username
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400"
                >
                  <Phone className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400"
                >
                  <Video className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {getMessages(
                selectedConversation.id
              ).map(
                (message) => (
                  <div
                    key={
                      message.id
                    }
                    className={`flex ${
                      message.isOwn
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isOwn
                          ? "bg-blue-500 text-white"
                          : "bg-gray-800 text-white"
                      }`}
                    >
                      <p className="text-sm">
                        {
                          message.content
                        }
                      </p>
                      <p className="text-xs opacity-70 mt-1">
                        {formatTime(
                          message.timestamp
                        )}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-800">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder="Start a new message"
                    value={
                      newMessage
                    }
                    onChange={(
                      e
                    ) =>
                      setNewMessage(
                        e
                          .target
                          .value
                      )
                    }
                    onKeyPress={(
                      e
                    ) =>
                      e.key ===
                        "Enter" &&
                      handleSendMessage()
                    }
                    className="bg-gray-900 border-gray-700 text-white pr-12"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 text-gray-400"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  onClick={
                    handleSendMessage
                  }
                  disabled={
                    !newMessage.trim()
                  }
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Select a
                conversation
              </h3>
              <p className="text-gray-400">
                Choose a
                conversation
                from the
                sidebar to
                start
                messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
