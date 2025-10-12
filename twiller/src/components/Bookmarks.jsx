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
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Bookmark,
  Search,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import TweetCard from "./TweetCard";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";

const Bookmarks = () => {
  const { user } = useAuth();
  const [
    bookmarks,
    setBookmarks,
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
    fetchBookmarks();
  }, []);

  const fetchBookmarks =
    async () => {
      try {
        // Mock bookmarks data - in real app, this would come from backend
        const mockBookmarks =
          [
            {
              _id: "bookmark1",
              author: {
                _id: "user1",
                displayName:
                  "TechGuru",
                username:
                  "techguru",
                avatar:
                  "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400",
                verified: true,
              },
              content:
                "Just discovered an amazing new AI tool that can generate code from natural language descriptions. This is going to revolutionize how we develop software!",
              likes: 1250,
              retweets: 340,
              comments: 89,
              likedBy: [],
              retweetedBy: [],
              timestamp:
                new Date(
                  Date.now() -
                    1000 *
                      60 *
                      60 *
                      2
                ),
              bookmarkedAt:
                new Date(
                  Date.now() -
                    1000 *
                      60 *
                      30
                ),
              category:
                "technology",
            },
            {
              _id: "bookmark2",
              author: {
                _id: "user2",
                displayName:
                  "ScienceDaily",
                username:
                  "sciencedaily",
                avatar:
                  "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
                verified: true,
              },
              content:
                "New breakthrough in quantum computing: Researchers have successfully demonstrated quantum supremacy in a practical application. This could change everything we know about computing.",
              likes: 2100,
              retweets: 890,
              comments: 156,
              likedBy: [],
              retweetedBy: [],
              timestamp:
                new Date(
                  Date.now() -
                    1000 *
                      60 *
                      60 *
                      6
                ),
              bookmarkedAt:
                new Date(
                  Date.now() -
                    1000 *
                      60 *
                      60 *
                      3
                ),
              category:
                "science",
            },
            {
              _id: "bookmark3",
              author: {
                _id: "user3",
                displayName:
                  "CricketFan",
                username:
                  "cricketfan",
                avatar:
                  "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
                verified: false,
              },
              content:
                "What a match! The way the team handled pressure in the final overs was incredible. This is why cricket is the greatest sport in the world.",
              likes: 450,
              retweets: 120,
              comments: 67,
              likedBy: [],
              retweetedBy: [],
              timestamp:
                new Date(
                  Date.now() -
                    1000 *
                      60 *
                      60 *
                      12
                ),
              bookmarkedAt:
                new Date(
                  Date.now() -
                    1000 *
                      60 *
                      60 *
                      8
                ),
              category:
                "sports",
            },
          ];

        setBookmarks(
          mockBookmarks
        );
      } catch (error) {
        console.error(
          "Error fetching bookmarks:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

  const removeBookmark =
    async (tweetId) => {
      try {
        // In a real app, this would call the backend API
        setBookmarks((prev) =>
          prev.filter(
            (bookmark) =>
              bookmark._id !==
              tweetId
          )
        );
      } catch (error) {
        console.error(
          "Error removing bookmark:",
          error
        );
      }
    };

  const getCategoryColor = (
    category
  ) => {
    switch (category) {
      case "technology":
        return "bg-blue-100 text-blue-800";
      case "science":
        return "bg-green-100 text-green-800";
      case "sports":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredBookmarks =
    bookmarks.filter(
      (bookmark) => {
        if (
          activeFilter ===
          "all"
        )
          return true;
        return (
          bookmark.category ===
          activeFilter
        );
      }
    );

  const categories = [
    {
      key: "all",
      label: "All",
      count: bookmarks.length,
    },
    {
      key: "technology",
      label: "Technology",
      count: bookmarks.filter(
        (b) =>
          b.category ===
          "technology"
      ).length,
    },
    {
      key: "science",
      label: "Science",
      count: bookmarks.filter(
        (b) =>
          b.category ===
          "science"
      ).length,
    },
    {
      key: "sports",
      label: "Sports",
      count: bookmarks.filter(
        (b) =>
          b.category ===
          "sports"
      ).length,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">
          Loading bookmarks...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 bg-black/90 backdrop-blur-md border-b border-gray-800 z-10">
          <div className="px-4 py-3">
            <h1 className="text-xl font-bold text-white">
              Bookmarks
            </h1>
            <p className="text-sm text-gray-400">
              Your saved
              tweets
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex flex-wrap gap-2">
            {categories.map(
              (category) => (
                <button
                  key={
                    category.key
                  }
                  onClick={() =>
                    setActiveFilter(
                      category.key
                    )
                  }
                  className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
                    activeFilter ===
                    category.key
                      ? "bg-blue-500 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  {
                    category.label
                  }
                  <Badge className="bg-gray-600 text-white text-xs">
                    {
                      category.count
                    }
                  </Badge>
                </button>
              )
            )}
          </div>
        </div>

        {/* Bookmarks List */}
        <div className="divide-y divide-gray-800">
          {filteredBookmarks.length ===
          0 ? (
            <Card className="bg-black border-none">
              <CardContent className="py-12 text-center">
                <Bookmark className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <div className="text-gray-400">
                  <h3 className="text-lg font-semibold mb-2">
                    {activeFilter ===
                    "all"
                      ? "No bookmarks yet"
                      : `No ${activeFilter} bookmarks`}
                  </h3>
                  <p>
                    {activeFilter ===
                    "all"
                      ? "When you bookmark tweets, they'll show up here."
                      : `You haven't bookmarked any ${activeFilter} tweets yet.`}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredBookmarks.map(
              (bookmark) => (
                <div
                  key={
                    bookmark._id
                  }
                  className="relative group"
                >
                  <TweetCard
                    tweet={
                      bookmark
                    }
                  />

                  {/* Bookmark Actions */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`text-xs ${getCategoryColor(
                          bookmark.category
                        )}`}
                      >
                        {
                          bookmark.category
                        }
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          removeBookmark(
                            bookmark._id
                          )
                        }
                        className="text-gray-400 hover:text-red-400 hover:bg-red-900/20"
                      >
                        <Bookmark className="h-4 w-4 fill-current" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Bookmark Info */}
                  <div className="px-4 pb-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Bookmark className="h-3 w-3" />
                      <span>
                        Bookmarked{" "}
                        {new Date(
                          bookmark.bookmarkedAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              )
            )
          )}
        </div>

        {/* Stats */}
        {bookmarks.length >
          0 && (
          <div className="p-4 border-t border-gray-800">
            <div className="text-center text-sm text-gray-400">
              <p>
                {
                  filteredBookmarks.length
                }{" "}
                of{" "}
                {
                  bookmarks.length
                }{" "}
                bookmarks
                {activeFilter !==
                  "all" &&
                  ` in ${activeFilter}`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
