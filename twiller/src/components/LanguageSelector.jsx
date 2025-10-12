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
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Globe,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";

const LanguageSelector =
  () => {
    const { user } =
      useAuth();
    const [
      supportedLanguages,
      setSupportedLanguages,
    ] = useState({});
    const [
      currentLanguage,
      setCurrentLanguage,
    ] = useState("en");
    const [
      selectedLanguage,
      setSelectedLanguage,
    ] = useState("");
    const [
      otpSent,
      setOtpSent,
    ] = useState(false);
    const [otp, setOtp] =
      useState("");
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

    useEffect(() => {
      fetchSupportedLanguages();
      fetchCurrentLanguage();
    }, [user]);

    const fetchSupportedLanguages =
      async () => {
        try {
          const response =
            await axiosInstance.get(
              "/language/supported"
            );
          setSupportedLanguages(
            response.data
          );
        } catch (error) {
          console.error(
            "Error fetching supported languages:",
            error
          );
        }
      };

    const fetchCurrentLanguage =
      async () => {
        if (!user?.email)
          return;

        try {
          const response =
            await axiosInstance.get(
              `/language/current/${user.email}`
            );
          setCurrentLanguage(
            response.data
              .language
          );
        } catch (error) {
          console.error(
            "Error fetching current language:",
            error
          );
        }
      };

    const handleLanguageChange =
      (language) => {
        setSelectedLanguage(
          language
        );
        setOtpSent(false);
        setOtp("");
        setMessage("");
        setError("");
      };

    const requestOTP =
      async () => {
        if (
          !selectedLanguage
        ) {
          setError(
            "Please select a language"
          );
          return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
          const isFrench =
            selectedLanguage ===
            "fr";
          const requestData =
            {
              language:
                selectedLanguage,
            };

          if (isFrench) {
            requestData.email =
              user.email;
          } else {
            if (!user.phone) {
              setError(
                "Phone number is required for this language. Please add your phone number to your profile."
              );
              setLoading(
                false
              );
              return;
            }
            requestData.phone =
              user.phone;
          }

          const response =
            await axiosInstance.post(
              "/language/request-otp",
              requestData
            );

          if (
            response.data
              .success
          ) {
            setOtpSent(true);
            setMessage(
              response.data
                .message
            );
            // For demo purposes, show the OTP
            if (
              response.data
                .otp
            ) {
              setMessage(
                `${response.data.message} (Demo OTP: ${response.data.otp})`
              );
            }
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
          } else if (
            error.response
              ?.status === 404
          ) {
            setError(
              "User not found"
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

    const verifyOTP =
      async () => {
        if (
          !otp ||
          !selectedLanguage
        ) {
          setError(
            "Please enter the OTP"
          );
          return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
          const isFrench =
            selectedLanguage ===
            "fr";
          const requestData =
            {
              otp,
              language:
                selectedLanguage,
            };

          if (isFrench) {
            requestData.email =
              user.email;
          } else {
            requestData.phone =
              user.phone;
          }

          const response =
            await axiosInstance.post(
              "/language/change",
              requestData
            );

          if (
            response.data
              .success
          ) {
            setMessage(
              response.data
                .message
            );
            setCurrentLanguage(
              selectedLanguage
            );
            setOtpSent(false);
            setOtp("");
            setSelectedLanguage(
              ""
            );
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

    const getLanguageFlag = (
      code
    ) => {
      const flags = {
        en: "🇺🇸",
        es: "🇪🇸",
        hi: "🇮🇳",
        pt: "🇵🇹",
        zh: "🇨🇳",
        fr: "🇫🇷",
      };
      return (
        flags[code] || "🌐"
      );
    };

    const getVerificationMethod =
      (language) => {
        if (
          language === "fr"
        ) {
          return {
            method: "email",
            icon: Mail,
            text: "Email verification required for French",
          };
        } else {
          return {
            method: "phone",
            icon: Phone,
            text: "Phone verification required",
          };
        }
      };

    return (
      <div className="min-h-screen bg-black p-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Language
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Current
                  language:{" "}
                  <span className="font-semibold">
                    {
                      supportedLanguages[
                        currentLanguage
                      ]
                    }
                  </span>
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="language">
                    Select New
                    Language
                  </Label>
                  <Select
                    value={
                      selectedLanguage
                    }
                    onValueChange={
                      handleLanguageChange
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(
                        supportedLanguages
                      ).map(
                        ([
                          code,
                          name,
                        ]) => (
                          <SelectItem
                            key={
                              code
                            }
                            value={
                              code
                            }
                          >
                            <span className="flex items-center gap-2">
                              <span>
                                {getLanguageFlag(
                                  code
                                )}
                              </span>
                              <span>
                                {
                                  name
                                }
                              </span>
                            </span>
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {selectedLanguage && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-center gap-2 text-blue-800">
                      {(() => {
                        const {
                          icon: Icon,
                          text,
                        } =
                          getVerificationMethod(
                            selectedLanguage
                          );
                        return (
                          <>
                            <Icon className="h-4 w-4" />
                            <span className="text-sm">
                              {
                                text
                              }
                            </span>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {!otpSent ? (
                  <Button
                    onClick={
                      requestOTP
                    }
                    disabled={
                      !selectedLanguage ||
                      loading
                    }
                    className="w-full"
                  >
                    {loading
                      ? "Sending OTP..."
                      : "Request OTP"}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="otp">
                        Enter
                        OTP
                      </Label>
                      <Input
                        id="otp"
                        type="text"
                        value={
                          otp
                        }
                        onChange={(
                          e
                        ) =>
                          setOtp(
                            e
                              .target
                              .value
                          )
                        }
                        placeholder="Enter 6-digit OTP"
                        maxLength={
                          6
                        }
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={
                          verifyOTP
                        }
                        disabled={
                          !otp ||
                          loading
                        }
                        className="flex-1"
                      >
                        {loading
                          ? "Verifying..."
                          : "Verify & Change Language"}
                      </Button>
                      <Button
                        onClick={() => {
                          setOtpSent(
                            false
                          );
                          setOtp(
                            ""
                          );
                          setError(
                            ""
                          );
                          setMessage(
                            ""
                          );
                        }}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">
                      {error}
                    </span>
                  </div>
                </div>
              )}

              {message && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">
                      {
                        message
                      }
                    </span>
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500 text-center">
                <p>
                  • French
                  language
                  requires
                  email
                  verification
                </p>
                <p>
                  • Other
                  languages
                  require
                  phone number
                  verification
                </p>
                <p>
                  • OTP
                  expires in
                  10 minutes
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

export default LanguageSelector;
