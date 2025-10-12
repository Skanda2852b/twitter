"use client";

import React, {
  useState,
  useEffect,
} from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Check,
  Clock,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";

const SubscriptionPlans =
  () => {
    const { user } =
      useAuth();
    const [plans, setPlans] =
      useState({});
    const [
      currentSubscription,
      setCurrentSubscription,
    ] = useState(null);
    const [
      loading,
      setLoading,
    ] = useState(false);
    const [
      message,
      setMessage,
    ] = useState("");
    const [error, setError] =
      useState("");

    const planFeatures = {
      free: [
        "1 tweet per month",
        "Basic features",
      ],
      bronze: [
        "3 tweets per month",
        "Priority support",
        "₹100/month",
      ],
      silver: [
        "5 tweets per month",
        "Advanced analytics",
        "₹300/month",
      ],
      gold: [
        "Unlimited tweets",
        "Premium features",
        "All analytics",
        "₹1000/month",
      ],
    };

    const planColors = {
      free: "border-gray-300",
      bronze:
        "border-amber-300",
      silver:
        "border-gray-400",
      gold: "border-yellow-400",
    };

    useEffect(() => {
      fetchPlans();
      fetchCurrentSubscription();
    }, []);

    const fetchPlans =
      async () => {
        try {
          const response =
            await axiosInstance.get(
              "/subscriptions/plans"
            );
          setPlans(
            response.data
          );
        } catch (error) {
          console.error(
            "Error fetching plans:",
            error
          );
        }
      };

    const fetchCurrentSubscription =
      async () => {
        if (!user?._id)
          return;

        try {
          const response =
            await axiosInstance.get(
              `/subscriptions/current/${user._id}`
            );
          setCurrentSubscription(
            response.data
          );
        } catch (error) {
          console.error(
            "Error fetching current subscription:",
            error
          );
        }
      };

    const isWithinPaymentTime =
      () => {
        const now =
          new Date();
        const istOffset =
          5.5 *
          60 *
          60 *
          1000;
        const istTime =
          new Date(
            now.getTime() +
              istOffset
          );
        const hours =
          istTime.getUTCHours();
        return hours === 10; // 10 AM IST only
      };

    const handleSubscribe =
      async (planName) => {
        if (!user?._id) {
          setError(
            "Please log in to subscribe"
          );
          return;
        }

        if (
          !isWithinPaymentTime()
        ) {
          setError(
            "Payments are only accepted between 10:00 AM - 11:00 AM IST"
          );
          return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
          const response =
            await axiosInstance.post(
              "/subscriptions/create-subscription",
              {
                plan: planName,
                userId:
                  user._id,
              }
            );

          if (
            response.data
              .success
          ) {
            setMessage(
              response.data
                .message
            );
            fetchCurrentSubscription();
          }
        } catch (error) {
          if (
            error.response
              ?.status === 400
          ) {
            setError(
              error.response
                .data.error
            );
          } else {
            setError(
              "An error occurred. Please try again."
            );
          }
        } finally {
          setLoading(false);
        }
      };

    const getCurrentTimeStatus =
      () => {
        const now =
          new Date();
        const istOffset =
          5.5 *
          60 *
          60 *
          1000;
        const istTime =
          new Date(
            now.getTime() +
              istOffset
          );
        const hours =
          istTime.getUTCHours();

        if (hours === 10) {
          return {
            status: "active",
            message:
              "Payment window is open!",
          };
        } else if (
          hours < 10
        ) {
          return {
            status: "waiting",
            message: `Payment window opens in ${
              10 - hours
            } hour(s)`,
          };
        } else {
          return {
            status: "closed",
            message:
              "Payment window is closed. Opens tomorrow at 10 AM IST",
          };
        }
      };

    const timeStatus =
      getCurrentTimeStatus();

    return (
      <div className="min-h-screen bg-black p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">
              Subscription
              Plans
            </h1>
            <p className="text-gray-400 mb-6">
              Choose a plan
              that fits your
              tweeting needs
            </p>

            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                timeStatus.status ===
                "active"
                  ? "bg-green-100 text-green-800"
                  : timeStatus.status ===
                    "waiting"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">
                {
                  timeStatus.message
                }
              </span>
            </div>
          </div>

          {currentSubscription && (
            <Card className="mb-8 bg-blue-900/20 border-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">
                    Current
                    Plan
                  </Badge>
                  <span className="font-semibold text-white capitalize">
                    {
                      currentSubscription.plan
                    }
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  Tweets:{" "}
                  {currentSubscription.tweetsPosted ||
                    0}{" "}
                  /{" "}
                  {currentSubscription.tweetsAllowed ===
                  -1
                    ? "∞"
                    : currentSubscription.tweetsAllowed}
                </p>
              </CardContent>
            </Card>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span>
                  {error}
                </span>
              </div>
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 bg-green-900/20 border border-green-500 rounded-lg">
              <div className="flex items-center gap-2 text-green-400">
                <Check className="h-4 w-4" />
                <span>
                  {message}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(
              plans
            ).map(
              ([
                planName,
                planData,
              ]) => (
                <Card
                  key={
                    planName
                  }
                  className={`relative ${
                    planColors[
                      planName
                    ]
                  } ${
                    currentSubscription?.plan ===
                    planName
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                >
                  {currentSubscription?.plan ===
                    planName && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-500">
                        Current
                      </Badge>
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle className="text-center capitalize">
                      {
                        planData.name
                      }{" "}
                      Plan
                    </CardTitle>
                    <div className="text-center">
                      <span className="text-3xl font-bold text-white">
                        ₹
                        {
                          planData.price
                        }
                      </span>
                      <span className="text-gray-400">
                        /month
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {planFeatures[
                        planName
                      ].map(
                        (
                          feature,
                          index
                        ) => (
                          <li
                            key={
                              index
                            }
                            className="flex items-center gap-2 text-sm"
                          >
                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-gray-300">
                              {
                                feature
                              }
                            </span>
                          </li>
                        )
                      )}
                    </ul>

                    <Button
                      onClick={() =>
                        handleSubscribe(
                          planName
                        )
                      }
                      disabled={
                        loading ||
                        !isWithinPaymentTime() ||
                        currentSubscription?.plan ===
                          planName
                      }
                      className="w-full"
                      variant={
                        planName ===
                        "gold"
                          ? "default"
                          : "outline"
                      }
                    >
                      {loading ? (
                        <>
                          <CreditCard className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : currentSubscription?.plan ===
                        planName ? (
                        "Current Plan"
                      ) : planData.price ===
                        0 ? (
                        "Free"
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Subscribe
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )
            )}
          </div>

          <div className="mt-8 text-center text-sm text-gray-400">
            <p>
              All payments are
              processed
              securely.
              Invoice will be
              sent to your
              email.
            </p>
            <p className="mt-2">
              Payment window:
              10:00 AM - 11:00
              AM IST only
            </p>
          </div>
        </div>
      </div>
    );
  };

export default SubscriptionPlans;
