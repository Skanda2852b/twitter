import { Switch } from "./ui/switch";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axiosInstance";
import {
  useState,
  useEffect,
} from "react";

export default function NotificationToggle() {
  const { user } = useAuth();
  const [
    enabled,
    setEnabled,
  ] = useState(true);
  const [
    loading,
    setLoading,
  ] = useState(false);

  useEffect(() => {
    if (user?.email) {
      fetchNotificationStatus();
    }
  }, [user]);

  const fetchNotificationStatus =
    async () => {
      try {
        const response =
          await axiosInstance.get(
            `/notifications/status/${user.email}`
          );
        setEnabled(
          response.data
            .notificationEnabled
        );
      } catch (error) {
        console.error(
          "Failed to fetch notification status:",
          error
        );
      }
    };

  const handleToggle = async (
    newEnabled
  ) => {
    try {
      setLoading(true);
      await axiosInstance.patch(
        `/notifications/toggle/${user.email}`,
        {
          enabled: newEnabled,
        }
      );
      setEnabled(newEnabled);
    } catch (error) {
      console.error(
        "Failed to toggle notifications:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-800">
      <div>
        <h3 className="text-white font-semibold">
          Push Notifications
        </h3>
        <p className="text-gray-400 text-sm">
          Get notified when
          tweets contain
          cricket or science
          keywords
        </p>
      </div>
      <Switch
        checked={enabled}
        onCheckedChange={
          handleToggle
        }
        disabled={loading}
      />
    </div>
  );
}
