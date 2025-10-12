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
import { Badge } from "./ui/badge";
import {
  Search,
  TrendingUp,
  Hash,
  Users,
  MessageCircle,
  Heart,
  Repeat2,
  Share,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import TweetCard from "./TweetCard";

const Explore = () => {
  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");
  const [
    searchResults,
    setSearchResults,
  ] = useState([]);
  const [
    trendingTopics,
    setTrendingTopics,
  ] = useState([]);
  const [
    trendingUsers,
    setTrendingUsers,
  ] = useState([]);
  const [
    loading,
    setLoading,
  ] = useState(false);
  const [
    activeTab,
    setActiveTab,
  ] = useState("trending");

  useEffect(() => {
    fetchTrendingData();
  }, []);

  const fetchTrendingData =
    async () => {
      try {
        // Fetch trending topics (mock data for now)
        const topics = [
          {
            name: "Cricket",
            tweets: 12500,
            category:
              "Sports",
          },
          {
            name: "Science",
            tweets: 8900,
            category:
              "Technology",
          },
          {
            name: "AI",
            tweets: 15600,
            category:
              "Technology",
          },
          {
            name: "Climate",
            tweets: 7200,
            category:
              "Environment",
          },
          {
            name: "Music",
            tweets: 9800,
            category:
              "Entertainment",
          },
          {
            name: "Coding",
            tweets: 11200,
            category:
              "Technology",
          },
        ];
        setTrendingTopics(
          topics
        );

        // Fetch trending users (mock data)
        const users = [
          {
            name: "TechGuru",
            username:
              "techguru",
            followers: 125000,
            verified: true,
          },
          {
            name: "ScienceDaily",
            username:
              "sciencedaily",
            followers: 89000,
            verified: true,
          },
          {
            name: "CricketFan",
            username:
              "cricketfan",
            followers: 45000,
            verified: false,
          },
          {
            name: "AILab",
            username: "ailab",
            followers: 78000,
            verified: true,
          },
        ];
        setTrendingUsers(
          users
        );
      } catch (error) {
        console.error(
          "Error fetching trending data:",
          error
        );
      }
    };

  const handleSearch =
    async () => {
      if (!searchQuery.trim())
        return;

      setLoading(true);
      try {
        const response =
          await axiosInstance.get(
            `/post/search?q=${encodeURIComponent(
              searchQuery
            )}`
          );
        setSearchResults(
          response.data
        );
        setActiveTab(
          "search"
        );
      } catch (error) {
        console.error(
          "Error searching:",
          error
        );
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

  const handleKeyPress = (
    e
  ) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const formatNumber = (
    num
  ) => {
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

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 bg-black/90 backdrop-blur-md border-b border-gray-800 z-10">
          <div className="px-4 py-3">
            <h1 className="text-xl font-bold text-white">
              Explore
            </h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search Twitter"
              value={
                searchQuery
              }
              onChange={(e) =>
                setSearchQuery(
                  e.target
                    .value
                )
              }
              onKeyPress={
                handleKeyPress
              }
              className="pl-10 bg-gray-900 border-gray-700 text-white"
            />
            <Button
              onClick={
                handleSearch
              }
              disabled={
                loading ||
                !searchQuery.trim()
              }
              className="absolute right-2 top-1 bg-blue-500 hover:bg-blue-600"
              size="sm"
            >
              {loading
                ? "Searching..."
                : "Search"}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4">
          <div className="flex space-x-4 border-b border-gray-800">
            <button
              onClick={() =>
                setActiveTab(
                  "trending"
                )
              }
              className={`pb-3 px-1 font-semibold ${
                activeTab ===
                "trending"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Trending
            </button>
            <button
              onClick={() =>
                setActiveTab(
                  "search"
                )
              }
              className={`pb-3 px-1 font-semibold ${
                activeTab ===
                "search"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Search Results
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab ===
            "trending" && (
            <div className="space-y-6">
              {/* Trending Topics */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <TrendingUp className="h-5 w-5" />
                    Trending
                    Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {trendingTopics.map(
                      (
                        topic,
                        index
                      ) => (
                        <div
                          key={
                            index
                          }
                          className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-lg cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-gray-400 text-sm">
                              #
                              {index +
                                1}
                            </div>
                            <div>
                              <div className="font-semibold text-white">
                                #
                                {
                                  topic.name
                                }
                              </div>
                              <div className="text-sm text-gray-400">
                                {
                                  topic.category
                                }
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-400">
                            {formatNumber(
                              topic.tweets
                            )}{" "}
                            tweets
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Trending Users */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Users className="h-5 w-5" />
                    Trending
                    Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {trendingUsers.map(
                      (
                        user,
                        index
                      ) => (
                        <div
                          key={
                            index
                          }
                          className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-lg cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold">
                                {user.name.charAt(
                                  0
                                )}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-1">
                                <span className="font-semibold text-white">
                                  {
                                    user.name
                                  }
                                </span>
                                {user.verified && (
                                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">
                                      ✓
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="text-sm text-gray-400">
                                @
                                {
                                  user.username
                                }
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-400">
                            {formatNumber(
                              user.followers
                            )}{" "}
                            followers
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab ===
            "search" && (
            <div>
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-gray-400">
                    Searching...
                  </div>
                </div>
              ) : searchResults.length >
                0 ? (
                <div className="space-y-4">
                  <div className="text-sm text-gray-400 mb-4">
                    Found{" "}
                    {
                      searchResults.length
                    }{" "}
                    results
                    for "
                    {
                      searchQuery
                    }
                    "
                  </div>
                  {searchResults.map(
                    (
                      tweet
                    ) => (
                      <TweetCard
                        key={
                          tweet._id
                        }
                        tweet={
                          tweet
                        }
                      />
                    )
                  )}
                </div>
              ) : searchQuery ? (
                <div className="text-center py-8">
                  <div className="text-gray-400">
                    No results
                    found for
                    "
                    {
                      searchQuery
                    }
                    "
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400">
                    Enter a
                    search
                    term to
                    find
                    tweets
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
