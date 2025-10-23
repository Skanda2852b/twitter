"use client";

import React, {
  useEffect,
  useState,
} from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
} from "./ui/card";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  MoreHorizontal,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "@/lib/axiosInstance";

export default function TweetCard({
  tweet,
}) {
  const { user } = useAuth();
  const [
    tweetState,
    setTweetState,
  ] = useState(tweet);
  const [
    notificationCooldown,
    setNotificationCooldown,
  ] = useState(new Set());

  // Safe data access functions
  const getAuthorName =
    () => {
      return (
        tweetState?.author
          ?.displayName ||
        "Unknown User"
      );
    };

  const getAuthorUsername =
    () => {
      return (
        tweetState?.author
          ?.username ||
        "unknown"
      );
    };

  const getAuthorAvatar =
    () => {
      return (
        tweetState?.author
          ?.avatar ||
        "/default-avatar.png"
      );
    };

  const getAuthorInitial =
    () => {
      const name =
        getAuthorName();
      return name
        ? name[0].toUpperCase()
        : "U";
    };

  const isVerified = () => {
    return (
      tweetState?.author
        ?.verified || false
    );
  };

  const likeTweet = async (
    tweetId
  ) => {
    try {
      const res =
        await axiosInstance.post(
          `/like/${tweetId}`,
          {
            userId: user?._id,
          }
        );
      setTweetState(res.data);
    } catch (error) {
      console.log(
        "Like error:",
        error
      );
    }
  };

  // Improved notification effect with better error handling
  useEffect(() => {
    let isMounted = true;

    const checkForNotifications =
      async () => {
        // Early returns for invalid conditions
        if (
          !isMounted ||
          !tweetState?.content ||
          !tweetState?._id ||
          !user?.email
        ) {
          return;
        }

        // Check if we've already shown notification for this tweet
        if (
          notificationCooldown.has(
            tweetState._id
          )
        ) {
          return;
        }

        const hasKeyword =
          tweetState.content
            .toLowerCase()
            .includes(
              "cricket"
            ) ||
          tweetState.content
            .toLowerCase()
            .includes(
              "science"
            );

        if (!hasKeyword) {
          return;
        }

        try {
          // Check browser notification permission first
          if (
            Notification.permission !==
            "granted"
          ) {
            return;
          }

          // Prepare notification data
          const notificationData =
            {
              tweetId:
                tweetState._id,
              tweetContent:
                tweetState.content,
              userEmail:
                user.email,
              keywords:
                tweetState.content
                  .toLowerCase()
                  .includes(
                    "cricket"
                  )
                  ? [
                      "cricket",
                    ]
                  : [
                      "science",
                    ],
            };

          // Make API call to record notification (but don't block on errors)
          try {
            await axiosInstance.post(
              "/notifications/check-keywords",
              notificationData
            );
          } catch (apiError) {
            console.warn(
              "Notification API error (non-critical):",
              apiError.message
            );
            // Continue to show browser notification even if API fails
          }

          // Show browser notification
          const notification =
            new Notification(
              "🔔 Keyword Alert!",
              {
                body: `Tweet about ${
                  tweetState.content
                    .toLowerCase()
                    .includes(
                      "cricket"
                    )
                    ? "cricket"
                    : "science"
                }: ${tweetState.content.substring(
                  0,
                  100
                )}...`,
                icon: getAuthorAvatar(),
                tag: `keyword-${tweetState._id}`,
              }
            );

          // Handle notification click
          notification.onclick =
            () => {
              window.focus();
              notification.close();
            };

          // Add to cooldown to prevent duplicate notifications
          setNotificationCooldown(
            (prev) =>
              new Set([
                ...prev,
                tweetState._id,
              ])
          );
        } catch (error) {
          console.error(
            "Notification error:",
            error
          );
        }
      };

    const requestNotificationPermission =
      async () => {
        if (
          Notification.permission ===
          "default"
        ) {
          try {
            await Notification.requestPermission();
          } catch (error) {
            console.error(
              "Notification permission error:",
              error
            );
          }
        }
      };

    // Initialize notifications
    if (isMounted) {
      requestNotificationPermission().then(
        () => {
          // Only check for notifications if permission is granted
          if (
            Notification.permission ===
            "granted"
          ) {
            // Small delay to ensure component is fully mounted
            setTimeout(() => {
              checkForNotifications();
            }, 1000);
          }
        }
      );
    }

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [
    tweetState,
    user,
    notificationCooldown,
  ]);

  const retweetTweet = async (
    tweetId
  ) => {
    try {
      const res =
        await axiosInstance.post(
          `/retweet/${tweetId}`,
          {
            userId: user?._id,
          }
        );
      setTweetState(res.data);
    } catch (error) {
      console.log(
        "Retweet error:",
        error
      );
    }
  };

  const formatNumber = (
    num
  ) => {
    if (!num && num !== 0)
      return "0";
    if (num >= 1000000) {
      return (
        (
          num / 1000000
        ).toFixed(1) + "M"
      );
    }
    if (num >= 1000) {
      return (
        (num / 1000).toFixed(
          1
        ) + "K"
      );
    }
    return num.toString();
  };

  const isLiked =
    tweetState?.likedBy?.includes(
      user?._id || ""
    );
  const isRetweet =
    tweetState?.retweetedBy?.includes(
      user?._id || ""
    );

  // If tweet data is invalid, don't render
  if (
    !tweetState ||
    !tweetState._id
  ) {
    return (
      <Card className="bg-black border-gray-800 border-x-0 border-t-0 rounded-none">
        <CardContent className="p-4">
          <div className="text-gray-500 text-center">
            Invalid tweet data
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black border-gray-800 border-x-0 border-t-0 rounded-none hover:bg-gray-950/50 transition-colors cursor-pointer">
      <CardContent className="p-4">
        <div className="flex space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={getAuthorAvatar()}
              alt={getAuthorName()}
            />
            <AvatarFallback>
              {getAuthorInitial()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-bold text-white">
                {getAuthorName()}
              </span>
              {isVerified() && (
                <div className="bg-blue-500 rounded-full p-0.5">
                  <svg
                    className="h-4 w-4 text-white fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                </div>
              )}
              <span className="text-gray-500">
                @
                {getAuthorUsername()}
              </span>
              <span className="text-gray-500">
                ·
              </span>
              <span className="text-gray-500">
                {tweetState.timestamp &&
                  new Date(
                    tweetState.timestamp
                  ).toLocaleDateString(
                    "en-us",
                    {
                      month:
                        "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
              </span>
              <div className="ml-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 rounded-full hover:bg-gray-900"
                >
                  <MoreHorizontal className="h-5 w-5 text-gray-500" />
                </Button>
              </div>
            </div>

            <div className="text-white mb-3 leading-relaxed">
              {tweetState.content ||
                "No content"}
            </div>

            {tweetState.image && (
              <div className="mb-3 rounded-2xl overflow-hidden">
                <img
                  src={
                    tweetState.image
                  }
                  alt="Tweet image"
                  className="w-full h-auto max-h-96 object-cover"
                />
              </div>
            )}

            {tweetState.audio && (
              <div className="mb-3 p-4 bg-gray-900 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">
                      🔊
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">
                      Audio
                      Tweet
                    </div>
                    <div className="text-gray-400 text-xs">
                      {tweetState.audioDuration
                        ? `${Math.floor(
                            tweetState.audioDuration /
                              60
                          )}:${(
                            tweetState.audioDuration %
                            60
                          )
                            .toString()
                            .padStart(
                              2,
                              "0"
                            )}`
                        : "Audio"}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-400"
                  >
                    Play
                  </Button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between max-w-md">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-blue-900/20 text-gray-500 hover:text-blue-400 group"
              >
                <MessageCircle className="h-5 w-5 group-hover:text-blue-400" />
                <span className="text-sm">
                  {formatNumber(
                    tweetState.comments
                  )}
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center space-x-2 p-2 rounded-full hover:bg-green-900/20 group ${
                  isRetweet
                    ? "text-green-400"
                    : "text-gray-500 hover:text-green-400"
                }`}
                onClick={(
                  e
                ) => {
                  e.stopPropagation();
                  retweetTweet(
                    tweetState._id
                  );
                }}
              >
                <Repeat2
                  className={`h-5 w-5 ${
                    isRetweet
                      ? "text-green-400"
                      : "group-hover:text-green-400"
                  }`}
                />
                <span className="text-sm">
                  {formatNumber(
                    tweetState.retweets
                  )}
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center space-x-2 p-2 rounded-full hover:bg-red-900/20 group ${
                  isLiked
                    ? "text-red-500"
                    : "text-gray-500 hover:text-red-400"
                }`}
                onClick={(
                  e
                ) => {
                  e.stopPropagation();
                  likeTweet(
                    tweetState._id
                  );
                }}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isLiked
                      ? "text-red-500 fill-current"
                      : "group-hover:text-red-400"
                  }`}
                />
                <span className="text-sm">
                  {formatNumber(
                    tweetState.likes
                  )}
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-blue-900/20 text-gray-500 hover:text-blue-400 group"
              >
                <Share className="h-5 w-5 group-hover:text-blue-400" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
