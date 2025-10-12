import axiosInstance from './axiosInstance';

class NotificationService {
  constructor() {
    this.checkInterval = null;
    this.lastCheckTime = null;
    this.isEnabled = false;
  }

  async initialize(userEmail) {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return false;
      }
    }

    if (Notification.permission === 'denied') {
      console.log('Notifications are blocked');
      return false;
    }

    this.userEmail = userEmail;
    this.isEnabled = true;
    this.startPeriodicCheck();
    return true;
  }

  startPeriodicCheck() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    // Check every 30 seconds for new cricket/science tweets
    this.checkInterval = setInterval(() => {
      this.checkForNotifications();
    }, 30000);

    // Initial check
    this.checkForNotifications();
  }

  async checkForNotifications() {
    if (!this.isEnabled || !this.userEmail) return;

    try {
      const response = await axiosInstance.post('/notifications/check-keywords', {
        userEmail: this.userEmail
      });

      if (response.data.notification) {
        this.showNotification(response.data.tweet);
      }
    } catch (error) {
      console.error('Error checking for notifications:', error);
    }
  }

  showNotification(tweet) {
    if (!this.isEnabled || Notification.permission !== 'granted') return;

    const notification = new Notification(`New ${tweet.keywords.join('/')} Tweet!`, {
      body: `@${tweet.author}: ${tweet.content.substring(0, 100)}${tweet.content.length > 100 ? '...' : ''}`,
      icon: '/favicon.ico',
      tag: `tweet-${tweet.id}`,
      requireInteraction: true
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Auto-close after 10 seconds
    setTimeout(() => {
      notification.close();
    }, 10000);
  }

  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.isEnabled = false;
  }

  async updateSettings(enabled) {
    if (!this.userEmail) return;

    try {
      await axiosInstance.patch(`/notifications/toggle/${this.userEmail}`, {
        enabled
      });
      this.isEnabled = enabled;
    } catch (error) {
      console.error('Error updating notification settings:', error);
    }
  }
}

export default new NotificationService();
