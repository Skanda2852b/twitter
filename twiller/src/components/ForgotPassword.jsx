"use client";

import React, {
  useState,
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
  Key,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

const ForgotPassword = () => {
  const [
    emailOrPhone,
    setEmailOrPhone,
  ] = useState("");
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
  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    setNewPassword("");

    try {
      const response =
        await axiosInstance.post(
          "/auth/forgot-password",
          {
            emailOrPhone,
          }
        );

      if (
        response.data.success
      ) {
        setMessage(
          response.data
            .message
        );
        setNewPassword(
          response.data
            .password
        );
      }
    } catch (error) {
      if (
        error.response
          ?.status === 429
      ) {
        setError(
          error.response.data
            .error
        );
      } else if (
        error.response
          ?.status === 404
      ) {
        setError(
          "User not found. Please check your email or phone number."
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

  const copyPassword = () => {
    navigator.clipboard.writeText(
      newPassword
    );
    alert(
      "Password copied to clipboard!"
    );
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Forgot Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="emailOrPhone">
                Email or Phone
                Number
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="emailOrPhone"
                  type="text"
                  value={
                    emailOrPhone
                  }
                  onChange={(
                    e
                  ) =>
                    setEmailOrPhone(
                      e.target
                        .value
                    )
                  }
                  placeholder="Enter your email or phone number"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={
                loading
              }
            >
              {loading
                ? "Generating Password..."
                : "Reset Password"}
            </Button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">
                  {error}
                </span>
              </div>
            </div>
          )}

          {message && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center gap-2 text-green-800 mb-2">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {message}
                </span>
              </div>

              {newPassword && (
                <div className="mt-3 space-y-2">
                  <div className="text-sm text-gray-700">
                    Your new
                    password
                    (letters
                    only):
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={
                        newPassword
                      }
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={
                        copyPassword
                      }
                    >
                      Copy
                    </Button>
                  </div>
                  <div className="text-xs text-gray-600">
                    Please
                    save this
                    password
                    and change
                    it after
                    logging
                    in.
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              You can only
              request a
              password reset
              once per day.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
