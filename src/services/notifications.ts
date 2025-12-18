import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

export interface NotificationPermissionStatus {
  granted: boolean;
  denied: boolean;
}

/**
 * Initialize push notifications for the app
 * Call this on app startup
 */
export async function initializePushNotifications(): Promise<void> {
  // Only run on native platforms
  if (!Capacitor.isNativePlatform()) {
    console.log('Push notifications only available on native platforms');
    return;
  }

  try {
    // Request permission
    const permResult = await PushNotifications.requestPermissions();

    if (permResult.receive === 'granted') {
      // Register with FCM/APNs
      await PushNotifications.register();

      console.log('Push notifications registered successfully');
    } else {
      console.log('Push notification permission denied');
    }

    // Listen for registration success
    PushNotifications.addListener('registration', (token) => {
      console.log('Push registration success, token: ' + token.value);
      // TODO: Send this token to your backend to send notifications
      // You could store it in Supabase user profile
    });

    // Listen for registration errors
    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error on registration: ' + JSON.stringify(error));
    });

    // Listen for incoming notifications
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push notification received: ', notification);
      // Handle notification when app is in foreground
    });

    // Listen for notification taps (when app is in background)
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push notification action performed', notification);
      // Navigate to relevant screen based on notification data
      handleNotificationAction(notification.notification.data);
    });

  } catch (error) {
    console.error('Failed to initialize push notifications:', error);
  }
}

/**
 * Check if push notifications are enabled
 */
export async function checkNotificationPermissions(): Promise<NotificationPermissionStatus> {
  if (!Capacitor.isNativePlatform()) {
    return { granted: false, denied: false };
  }

  const result = await PushNotifications.checkPermissions();
  return {
    granted: result.receive === 'granted',
    denied: result.receive === 'denied',
  };
}

/**
 * Request push notification permissions
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    return false;
  }

  const result = await PushNotifications.requestPermissions();
  return result.receive === 'granted';
}

/**
 * Handle notification actions (when user taps notification)
 */
function handleNotificationAction(data: any) {
  // Navigate based on notification type
  if (data.type === 'task_assigned') {
    // Navigate to dashboard
    window.location.hash = '#/dashboard';
  } else if (data.type === 'task_completed') {
    // Navigate to specific task
    window.location.hash = `#/task/${data.taskId}`;
  } else if (data.type === 'household_invite') {
    // Navigate to invite screen
    window.location.hash = `#/join/${data.inviteCode}`;
  }
}

/**
 * Send local notification (doesn't require backend)
 * Useful for task reminders, rotation alerts, etc.
 */
export async function sendLocalNotification(title: string, body: string, data?: any): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    console.log('Local notification:', title, body);
    return;
  }

  // Note: Local notifications require @capacitor/local-notifications plugin
  // For now, we'll just log. Add the plugin if you want this feature.
  console.log('Would send local notification:', { title, body, data });
}

/**
 * Notification helpers for specific app events
 */

export async function notifyTaskAssigned(taskName: string, assignedTo: string): Promise<void> {
  await sendLocalNotification(
    'New Task Assigned',
    `${assignedTo} has been assigned: ${taskName}`,
    { type: 'task_assigned', taskName, assignedTo }
  );
}

export async function notifyTaskCompleted(taskName: string, completedBy: string): Promise<void> {
  await sendLocalNotification(
    'Task Completed! 🎉',
    `${completedBy} completed: ${taskName}`,
    { type: 'task_completed', taskName, completedBy }
  );
}

export async function notifyWeeklyRotation(): Promise<void> {
  await sendLocalNotification(
    'New Week, New Tasks! 🔄',
    'Your tasks have rotated for this week. Check your dashboard!',
    { type: 'weekly_rotation' }
  );
}

export async function notifyHouseholdInvite(householdName: string, inviteCode: string): Promise<void> {
  await sendLocalNotification(
    'Household Invite',
    `You've been invited to join ${householdName}!`,
    { type: 'household_invite', householdName, inviteCode }
  );
}
