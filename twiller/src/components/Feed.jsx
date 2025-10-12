"use client";

import React, {
  useEffect,
  useState,
} from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Card,
  CardContent,
} from "./ui/card";
import LoadingSpinner from "./loading-spinner";
import TweetComposer from "./TweetComposer";
import TweetCard from "./TweetCard";
import AudioTweetComposer from "./AudioTweetComposer";
import axiosInstance from "@/lib/axiosInstance";
import notificationService from "@/lib/notificationService";

const Feed = () => {
  const [tweets, setTweets] =
    useState([]);
  const [
    loading,
    setLoading,
  ] = useState(false);
  const [error, setError] =
    useState("");

  const fetchTweets =
    async () => {
      try {
        setLoading(true);
        setError("");
        const res =
          await axiosInstance.get(
            "/post"
          );

        // Validate and filter tweets
        const validTweets =
          res.data.filter(
            (tweet) =>
              tweet &&
              tweet._id &&
              tweet.author &&
              tweet.author
                .displayName
          );

        setTweets(
          validTweets
        );

        if (
          validTweets.length !==
          res.data.length
        ) {
          console.warn(
            `Filtered out ${
              res.data
                .length -
              validTweets.length
            } invalid tweets`
          );
        }
      } catch (error) {
        console.error(
          "Error fetching tweets:",
          error
        );
        setError(
          "Failed to load tweets"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchTweets();
  }, []);

  const handlenewtweet =
    async (newtweet) => {
      if (
        newtweet &&
        newtweet._id &&
        newtweet.author &&
        newtweet.author
          .displayName
      ) {
        setTweets((prev) => [
          newtweet,
          ...prev,
        ]);

        // Check for notification keywords
        try {
          await axiosInstance.post(
            "/notifications/check-keywords",
            {
              tweetId:
                newtweet._id,
            }
          );
        } catch (error) {
          console.error(
            "Error checking notification keywords:",
            error
          );
        }
      } else {
        console.warn(
          "Invalid tweet data received:",
          newtweet
        );
      }
    };

  return (
    <div className="min-h-screen bg-black">
      <div className="sticky top-0 bg-black/90 backdrop-blur-md border-b border-gray-800 z-10">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-white">
            Home
          </h1>
        </div>

        <Tabs
          defaultValue="foryou"
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 bg-transparent border-b border-gray-800 rounded-none h-auto">
            <TabsTrigger
              value="foryou"
              className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-1 data-[state=active]:border-blue-100 data-[state=active]:rounded-none text-gray-400 hover:bg-gray-900/50 py-4 font-semibold"
            >
              For you
            </TabsTrigger>
            <TabsTrigger
              value="following"
              className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-1 data-[state=active]:border-blue-100 data-[state=active]:rounded-none text-gray-400 hover:bg-gray-900/50 py-4 font-semibold"
            >
              Following
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <TweetComposer
        onTweetPosted={
          handlenewtweet
        }
      />

      <AudioTweetComposer
        onAudioTweetPosted={
          handlenewtweet
        }
      />

      {error && (
        <Card className="bg-black border-none m-4">
          <CardContent className="p-4 text-center">
            <div className="text-red-400">
              {error}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="divide-y divide-gray-800">
        {loading ? (
          <Card className="bg-black border-none">
            <CardContent className="py-12 text-center">
              <div className="text-gray-400 mb-4">
                <LoadingSpinner
                  size="lg"
                  className="mx-auto mb-4"
                />
                <p>
                  Loading
                  tweets...
                </p>
              </div>
            </CardContent>
          </Card>
        ) : tweets.length ===
          0 ? (
          <Card className="bg-black border-none">
            <CardContent className="py-12 text-center">
              <div className="text-gray-400">
                <p>
                  No tweets to
                  display
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          tweets.map(
            (tweet) => (
              <TweetCard
                key={
                  tweet._id
                }
                tweet={tweet}
              />
            )
          )
        )}
      </div>
    </div>
  );
};

export default Feed;
