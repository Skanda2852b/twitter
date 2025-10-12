"use client";

import React, {
  useState,
  useRef,
  useEffect,
} from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  Upload,
  X,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";

const AudioTweetComposer = ({
  onAudioTweetPosted,
}) => {
  const { user } = useAuth();
  const [
    isRecording,
    setIsRecording,
  ] = useState(false);
  const [
    isPlaying,
    setIsPlaying,
  ] = useState(false);
  const [
    audioBlob,
    setAudioBlob,
  ] = useState(null);
  const [
    audioUrl,
    setAudioUrl,
  ] = useState(null);
  const [
    duration,
    setDuration,
  ] = useState(0);
  const [
    recordingTime,
    setRecordingTime,
  ] = useState(0);
  const [
    isUploading,
    setIsUploading,
  ] = useState(false);
  const [
    otpSent,
    setOtpSent,
  ] = useState(false);
  const [otp, setOtp] =
    useState("");
  const [
    otpVerified,
    setOtpVerified,
  ] = useState(false);
  const [
    content,
    setContent,
  ] = useState("");

  const mediaRecorderRef =
    useRef(null);
  const audioRef =
    useRef(null);
  const intervalRef =
    useRef(null);

  // Check if current time is within 2-7 PM IST
  const isWithinAudioTime =
    () => {
      const now = new Date();
      const istOffset =
        5.5 * 60 * 60 * 1000;
      const istTime =
        new Date(
          now.getTime() +
            istOffset
        );
      const hours =
        istTime.getUTCHours();
      return (
        hours >= 14 &&
        hours < 19
      ); // 2 PM to 7 PM IST
    };

  const startRecording =
    async () => {
      if (
        !isWithinAudioTime()
      ) {
        alert(
          "Audio tweets are only allowed between 2:00 PM - 7:00 PM IST"
        );
        return;
      }

      try {
        const stream =
          await navigator.mediaDevices.getUserMedia(
            { audio: true }
          );
        mediaRecorderRef.current =
          new MediaRecorder(
            stream
          );

        const chunks = [];
        mediaRecorderRef.current.ondataavailable =
          (event) => {
            chunks.push(
              event.data
            );
          };

        mediaRecorderRef.current.onstop =
          () => {
            const blob =
              new Blob(
                chunks,
                {
                  type: "audio/webm",
                }
              );
            setAudioBlob(
              blob
            );
            setAudioUrl(
              URL.createObjectURL(
                blob
              )
            );
            stream
              .getTracks()
              .forEach(
                (track) =>
                  track.stop()
              );
          };

        mediaRecorderRef.current.start();
        setIsRecording(true);
        setRecordingTime(0);

        // Start timer
        intervalRef.current =
          setInterval(() => {
            setRecordingTime(
              (prev) => {
                const newTime =
                  prev + 1;
                if (
                  newTime >=
                  300
                ) {
                  // 5 minutes limit
                  stopRecording();
                }
                return newTime;
              }
            );
          }, 1000);
      } catch (error) {
        console.error(
          "Error accessing microphone:",
          error
        );
        alert(
          "Error accessing microphone. Please check permissions."
        );
      }
    };

  const stopRecording =
    () => {
      if (
        mediaRecorderRef.current &&
        isRecording
      ) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        clearInterval(
          intervalRef.current
        );
      }
    };

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const deleteAudio = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
    setRecordingTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const sendOTP =
    async () => {
      try {
        const response =
          await axiosInstance.post(
            "/auth/send-otp",
            {
              email:
                user.email,
              type: "audio_upload",
            }
          );

        if (
          response.data
            .success
        ) {
          setOtpSent(true);
          alert(
            "OTP sent to your email"
          );
        }
      } catch (error) {
        console.error(
          "Error sending OTP:",
          error
        );
        alert(
          "Error sending OTP. Please try again."
        );
      }
    };

  const verifyOTP =
    async () => {
      try {
        const response =
          await axiosInstance.post(
            "/auth/verify-otp",
            {
              email:
                user.email,
              otp: otp,
              type: "audio_upload",
            }
          );

        if (
          response.data
            .success
        ) {
          setOtpVerified(
            true
          );
          alert(
            "OTP verified successfully!"
          );
        } else {
          alert(
            "Invalid OTP"
          );
        }
      } catch (error) {
        console.error(
          "Error verifying OTP:",
          error
        );
        alert(
          "Error verifying OTP. Please try again."
        );
      }
    };

  const uploadAudio =
    async () => {
      if (
        !audioBlob ||
        !otpVerified
      ) {
        alert(
          "Please record audio and verify OTP first"
        );
        return;
      }

      if (
        audioBlob.size >
        100 * 1024 * 1024
      ) {
        alert(
          "Audio file exceeds 100MB limit"
        );
        return;
      }

      if (
        recordingTime > 300
      ) {
        alert(
          "Audio duration exceeds 5 minutes limit"
        );
        return;
      }

      setIsUploading(true);

      try {
        const formData =
          new FormData();
        formData.append(
          "audio",
          audioBlob
        );
        formData.append(
          "author",
          user._id
        );
        formData.append(
          "content",
          content
        );
        formData.append(
          "duration",
          recordingTime
        );
        formData.append(
          "size",
          audioBlob.size
        );
        formData.append(
          "email",
          user.email
        );

        const response =
          await axiosInstance.post(
            "/audio/upload",
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        if (
          response.data
            .success
        ) {
          alert(
            "Audio tweet posted successfully!"
          );
          onAudioTweetPosted &&
            onAudioTweetPosted(
              response.data
                .tweet
            );

          // Reset form
          setAudioBlob(null);
          setAudioUrl(null);
          setContent("");
          setOtpVerified(
            false
          );
          setOtpSent(false);
          setOtp("");
        }
      } catch (error) {
        console.error(
          "Error uploading audio:",
          error
        );
        alert(
          error.response?.data
            ?.error ||
            "Error uploading audio"
        );
      } finally {
        setIsUploading(false);
      }
    };

  const formatTime = (
    seconds
  ) => {
    const mins = Math.floor(
      seconds / 60
    );
    const secs = seconds % 60;
    return `${mins}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended =
        () =>
          setIsPlaying(false);
      audioRef.current.onloadedmetadata =
        () => {
          setDuration(
            audioRef.current
              .duration
          );
        };
    }
  }, [audioUrl]);

  if (!isWithinAudioTime()) {
    return (
      <Card className="mb-4">
        <CardContent className="p-4 text-center">
          <p className="text-gray-500">
            Audio tweets are
            only available
            between 2:00 PM -
            7:00 PM IST
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Record Audio Tweet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!otpSent ? (
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">
              You need to
              verify your
              email with OTP
              before recording
              audio
            </p>
            <Button
              onClick={
                sendOTP
              }
              className="w-full"
            >
              Send OTP to
              Email
            </Button>
          </div>
        ) : !otpVerified ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Enter the OTP
              sent to your
              email:
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
                placeholder="Enter OTP"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                maxLength={6}
              />
              <Button
                onClick={
                  verifyOTP
                }
                disabled={
                  !otp
                }
              >
                Verify
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2">
              {!audioBlob ? (
                <Button
                  onClick={
                    isRecording
                      ? stopRecording
                      : startRecording
                  }
                  className={`flex-1 ${
                    isRecording
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {isRecording ? (
                    <MicOff className="h-4 w-4 mr-2" />
                  ) : (
                    <Mic className="h-4 w-4 mr-2" />
                  )}
                  {isRecording
                    ? "Stop Recording"
                    : "Start Recording"}
                </Button>
              ) : (
                <div className="flex gap-2 flex-1">
                  <Button
                    onClick={
                      playAudio
                    }
                    variant="outline"
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    onClick={
                      deleteAudio
                    }
                    variant="outline"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {isRecording && (
              <div className="text-center">
                <p className="text-sm text-red-600">
                  Recording:{" "}
                  {formatTime(
                    recordingTime
                  )}{" "}
                  / 5:00
                </p>
              </div>
            )}

            {audioBlob && (
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  Duration:{" "}
                  {formatTime(
                    recordingTime
                  )}{" "}
                  | Size:{" "}
                  {(
                    audioBlob.size /
                    1024 /
                    1024
                  ).toFixed(
                    2
                  )}{" "}
                  MB
                </div>

                <textarea
                  value={
                    content
                  }
                  onChange={(
                    e
                  ) =>
                    setContent(
                      e.target
                        .value
                    )
                  }
                  placeholder="Add a caption for your audio tweet (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={2}
                />

                <Button
                  onClick={
                    uploadAudio
                  }
                  disabled={
                    isUploading ||
                    recordingTime >
                      300 ||
                    audioBlob.size >
                      100 *
                        1024 *
                        1024
                  }
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <Upload className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Post
                      Audio
                      Tweet
                    </>
                  )}
                </Button>

                {(recordingTime >
                  300 ||
                  audioBlob.size >
                    100 *
                      1024 *
                      1024) && (
                  <p className="text-sm text-red-600 text-center">
                    Audio
                    exceeds
                    limits (5
                    min /
                    100MB)
                  </p>
                )}
              </div>
            )}

            {audioUrl && (
              <audio
                ref={audioRef}
                src={audioUrl}
                controls
                className="w-full"
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AudioTweetComposer;
