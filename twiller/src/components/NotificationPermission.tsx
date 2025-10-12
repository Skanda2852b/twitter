"use client";

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Bell, BellOff } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';

interface NotificationPermissionProps {
  userEmail: string;
}

const NotificationPermission: React.FC<NotificationPermissionProps> = ({ userEmail }) => {
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check browser notification permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    // Test the notifications route first
    testNotificationsRoute().then(() => {
      // Fetch user's notification preference
      fetchNotificationStatus();
    });
  }, [userEmail]);

  const testNotificationsRoute = async () => {
    try {
      console.log('Testing notifications route...');
      const response = await axiosInstance.get('/notifications/test');
      console.log('Notifications route test successful:', response.data);
    } catch (error) {
      console.error('Notifications route test failed:', error);
    }
  };

  const fetchNotificationStatus = async () => {
    try {
      const encodedEmail = encodeURIComponent(userEmail);
      const url = `/notifications/status/${encodedEmail}`;
      console.log('Fetching notification status from:', url);
      console.log('Base URL:', axiosInstance.defaults.baseURL);
      console.log('Full URL:', `${axiosInstance.defaults.baseURL}${url}`);
      
      const response = await axiosInstance.get(url);
      setNotificationEnabled(response.data.notificationEnabled);
    } catch (error: any) {
      console.error('Error fetching notification status:', error);
      console.error('Error details:', error.response?.data);
      console.error('Status:', error.response?.status);
      
      // Fallback: Check localStorage for user preference
      const savedPreference = localStorage.getItem(`notification_${userEmail}`);
      if (savedPreference !== null) {
        setNotificationEnabled(JSON.parse(savedPreference));
      } else {
        // Set default value if user not found
        setNotificationEnabled(true);
      }
    }
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        // Show a test notification
        new Notification('Twiller Notifications', {
          body: 'You will now receive notifications for cricket and science tweets!',
          icon: '/favicon.ico'
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const toggleNotifications = async () => {
    setLoading(true);
    try {
      const encodedEmail = encodeURIComponent(userEmail);
      const response = await axiosInstance.patch(`/notifications/toggle/${encodedEmail}`, {
        enabled: !notificationEnabled
      });
      
      if (response.data.success) {
        setNotificationEnabled(!notificationEnabled);
        // Save to localStorage as backup
        localStorage.setItem(`notification_${userEmail}`, JSON.stringify(!notificationEnabled));
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      // Fallback: Use localStorage
      const newValue = !notificationEnabled;
      setNotificationEnabled(newValue);
      localStorage.setItem(`notification_${userEmail}`, JSON.stringify(newValue));
    } finally {
      setLoading(false);
    }
  };

  const showTestNotification = () => {
    if (permission === 'granted' && notificationEnabled) {
      new Notification('Twiller Test Notification', {
        body: 'This is a test notification for cricket and science tweets!',
        icon: '/favicon.ico'
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {permission === 'default' && (
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">
              Enable notifications to get alerts for cricket and science tweets
            </p>
            <Button onClick={requestNotificationPermission} className="w-full">
              Enable Notifications
            </Button>
          </div>
        )}

        {permission === 'denied' && (
          <div className="text-center">
            <BellOff className="h-8 w-8 mx-auto text-red-500 mb-2" />
            <p className="text-sm text-red-600">
              Notifications are blocked. Please enable them in your browser settings.
            </p>
          </div>
        )}

        {permission === 'granted' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Browser Notifications</p>
                <p className="text-sm text-gray-600">
                  Get notified about cricket and science tweets
                </p>
              </div>
              <Switch
                checked={notificationEnabled}
                onCheckedChange={toggleNotifications}
                disabled={loading}
              />
            </div>

            {notificationEnabled && (
              <Button 
                onClick={showTestNotification}
                variant="outline"
                className="w-full"
              >
                Test Notification
              </Button>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 text-center">
          You'll receive notifications when tweets contain "cricket" or "science"
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPermission;