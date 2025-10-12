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
  Monitor,
  Smartphone,
  Tablet,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";

const LoginHistory = () => {
  const { user } = useAuth();
  const [
    history,
    setHistory,
  ] = useState([]);
  const [
    loading,
    setLoading,
  ] = useState(true);
  const [
    otpRequired,
    setOtpRequired,
  ] = useState(false);
  const [otp, setOtp] =
    useState("");
  const [
    otpLoading,
    setOtpLoading,
  ] = useState(false);

  useEffect(() => {
    if (user?._id) {
      fetchLoginHistory();
      checkCurrentLogin();
    }
  }, [user]);

  const fetchLoginHistory =
    async () => {
      try {
        const response =
          await axiosInstance.get(
            `/loginHistory/history/${user._id}`
          );
        setHistory(
          response.data
            .history
        );
      } catch (error) {
        console.error(
          "Error fetching login history:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

  const checkCurrentLogin =
    async () => {
      try {
        const userAgent =
          navigator.userAgent;
        const ipResponse =
          await fetch(
            "https://api.ipify.org?format=json"
          );
        const ipData =
          await ipResponse.json();

        const response =
          await axiosInstance.post(
            "/loginHistory/record",
            {
              userId:
                user._id,
              ipAddress:
                ipData.ip,
              userAgent:
                userAgent,
            }
          );

        if (
          response.data
            .requiresOTP
        ) {
          setOtpRequired(
            true
          );
        }
      } catch (error) {
        console.error(
          "Error checking current login:",
          error
        );
      }
    };

  const verifyOTP =
    async () => {
      if (
        !otp ||
        otp.length !== 6
      ) {
        alert(
          "Please enter a valid 6-digit OTP"
        );
        return;
      }

      setOtpLoading(true);
      try {
        const response =
          await axiosInstance.post(
            "/loginHistory/verify-otp",
            {
              userId:
                user._id,
              otp: otp,
            }
          );

        if (
          response.data
            .success
        ) {
          alert(
            "OTP verified successfully!"
          );
          setOtpRequired(
            false
          );
          setOtp("");
          fetchLoginHistory();
        }
      } catch (error) {
        alert(
          "Invalid OTP. Please try again."
        );
      } finally {
        setOtpLoading(false);
      }
    };

  const getDeviceIcon = (
    deviceType
  ) => {
    switch (deviceType) {
      case "mobile":
        return (
          <Smartphone className="h-4 w-4" />
        );
      case "tablet":
        return (
          <Tablet className="h-4 w-4" />
        );
      default:
        return (
          <Monitor className="h-4 w-4" />
        );
    }
  };

  const getStatusIcon = (
    success,
    requiresOTP,
    otpVerified
  ) => {
    if (!success) {
      return (
        <AlertTriangle className="h-4 w-4 text-red-500" />
      );
    }
    if (
      requiresOTP &&
      !otpVerified
    ) {
      return (
        <Clock className="h-4 w-4 text-yellow-500" />
      );
    }
    return (
      <CheckCircle className="h-4 w-4 text-green-500" />
    );
  };

  const getStatusText = (
    success,
    requiresOTP,
    otpVerified
  ) => {
    if (!success) {
      return "Failed";
    }
    if (
      requiresOTP &&
      !otpVerified
    ) {
      return "OTP Required";
    }
    return "Success";
  };

  const getStatusColor = (
    success,
    requiresOTP,
    otpVerified
  ) => {
    if (!success) {
      return "bg-red-100 text-red-800";
    }
    if (
      requiresOTP &&
      !otpVerified
    ) {
      return "bg-yellow-100 text-yellow-800";
    }
    return "bg-green-100 text-green-800";
  };

  const formatDate = (
    dateString
  ) => {
    const date = new Date(
      dateString
    );
    return date.toLocaleString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">
          Loading login
          history...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            Login History
          </h1>
          <p className="text-gray-400">
            Track your account
            access and
            security
          </p>
        </div>

        {otpRequired && (
          <Card className="mb-6 bg-yellow-900/20 border-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold text-yellow-400">
                  OTP
                  Verification
                  Required
                </span>
              </div>
              <p className="text-sm text-yellow-300 mb-4">
                Chrome browser
                detected.
                Please verify
                your identity
                with OTP sent
                to your email.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={otp}
                  onChange={(
                    e
                  ) =>
                    setOtp(
                      e.target
                        .value
                    )
                  }
                  placeholder="Enter 6-digit OTP"
                  maxLength={
                    6
                  }
                  className="flex-1 px-3 py-2 bg-black border border-gray-600 rounded-md text-white"
                />
                <Button
                  onClick={
                    verifyOTP
                  }
                  disabled={
                    otpLoading ||
                    !otp
                  }
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  {otpLoading
                    ? "Verifying..."
                    : "Verify"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {history.length ===
          0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-400">
                  No login
                  history
                  found
                </p>
              </CardContent>
            </Card>
          ) : (
            history.map(
              (
                login,
                index
              ) => (
                <Card
                  key={index}
                  className="bg-gray-900 border-gray-700"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getDeviceIcon(
                          login.deviceType
                        )}
                        <div>
                          <div className="font-semibold text-white">
                            {
                              login.browser
                            }{" "}
                            on{" "}
                            {
                              login.os
                            }
                          </div>
                          <div className="text-sm text-gray-400">
                            {login.deviceType
                              .charAt(
                                0
                              )
                              .toUpperCase() +
                              login.deviceType.slice(
                                1
                              )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(
                          login.success,
                          login.requiresOTP,
                          login.otpVerified
                        )}
                        <Badge
                          className={getStatusColor(
                            login.success,
                            login.requiresOTP,
                            login.otpVerified
                          )}
                        >
                          {getStatusText(
                            login.success,
                            login.requiresOTP,
                            login.otpVerified
                          )}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">
                          IP
                          Address:
                        </span>
                        <span className="text-white ml-2 font-mono">
                          {
                            login.ipAddress
                          }
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">
                          Time:
                        </span>
                        <span className="text-white ml-2">
                          {formatDate(
                            login.loginTime
                          )}
                        </span>
                      </div>
                      {login.location && (
                        <div>
                          <span className="text-gray-400">
                            Location:
                          </span>
                          <span className="text-white ml-2">
                            {
                              login.location
                            }
                          </span>
                        </div>
                      )}
                      {login.requiresOTP && (
                        <div>
                          <span className="text-gray-400">
                            OTP
                            Required:
                          </span>
                          <span className="text-white ml-2">
                            {login.otpVerified
                              ? "Verified"
                              : "Pending"}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            )
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            • Chrome browser
            logins require OTP
            verification
          </p>
          <p>
            • Mobile access is
            restricted to
            10:00 AM - 1:00 PM
            IST
          </p>
          <p>
            • Microsoft Edge
            browser allows
            direct access
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginHistory;
