import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

export type DeepLinkHandler = (url: string, data: Record<string, string>) => void;

/**
 * Initialize deep linking
 * Handles URLs like: cleaningrota://join/ABC123
 */
export function initializeDeepLinking(onJoinHousehold: (inviteCode: string) => void): void {
  if (!Capacitor.isNativePlatform()) {
    console.log('Deep linking only available on native platforms');
    return;
  }

  // Listen for deep link events
  App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
    console.log('App opened with URL:', event.url);
    handleDeepLink(event.url, onJoinHousehold);
  });

  // Check if app was opened with a URL
  App.getLaunchUrl().then((result) => {
    if (result && result.url) {
      console.log('App launched with URL:', result.url);
      handleDeepLink(result.url, onJoinHousehold);
    }
  });
}

/**
 * Parse and handle deep link URLs
 * Supported formats:
 * - cleaningrota://join/ABC123 (join household)
 * - cleaningrota://task/task-id (view task)
 * - https://yourdomain.com/join/ABC123 (universal link)
 */
function handleDeepLink(url: string, onJoinHousehold: (inviteCode: string) => void): void {
  try {
    const parsed = new URL(url);
    const pathParts = parsed.pathname.split('/').filter(Boolean);

    console.log('Deep link parsed:', { host: parsed.host, path: parsed.pathname, parts: pathParts });

    // Handle different deep link patterns
    if (pathParts[0] === 'join' && pathParts[1]) {
      // Join household: cleaningrota://join/ABC123
      const inviteCode = pathParts[1];
      console.log('Handling join household with code:', inviteCode);
      onJoinHousehold(inviteCode);
    } else if (pathParts[0] === 'task' && pathParts[1]) {
      // View task: cleaningrota://task/task-id
      const taskId = pathParts[1];
      console.log('Navigating to task:', taskId);
      window.location.hash = `#/task/${taskId}`;
    } else if (pathParts[0] === 'household' && pathParts[1]) {
      // View household: cleaningrota://household/household-id
      const householdId = pathParts[1];
      console.log('Navigating to household:', householdId);
      window.location.hash = `#/household/${householdId}`;
    } else {
      console.log('Unknown deep link pattern:', url);
    }
  } catch (error) {
    console.error('Failed to handle deep link:', error);
  }
}

/**
 * Create a shareable invite link
 * Returns both deep link and web fallback
 */
export function createInviteLink(inviteCode: string): { deepLink: string; webLink: string } {
  const deepLink = `cleaningrota://join/${inviteCode}`;
  const webLink = `${window.location.origin}/join/${inviteCode}`;

  return { deepLink, webLink };
}

/**
 * Share invite code using native share dialog
 */
export async function shareInviteCode(inviteCode: string, householdName: string): Promise<void> {
  const { deepLink, webLink } = createInviteLink(inviteCode);

  const shareText = `Join my household "${householdName}" on Cleaning Rota!\n\nInvite code: ${inviteCode}\n\nApp link: ${deepLink}\nWeb link: ${webLink}`;

  if (Capacitor.isNativePlatform() && 'share' in navigator) {
    try {
      await navigator.share({
        title: `Join ${householdName}`,
        text: shareText,
        url: webLink,
      });
      console.log('Shared successfully');
    } catch (error) {
      console.log('Share cancelled or failed:', error);
      // Fallback: copy to clipboard
      fallbackCopyToClipboard(shareText);
    }
  } else {
    // Web fallback: copy to clipboard
    fallbackCopyToClipboard(shareText);
  }
}

/**
 * Fallback: Copy text to clipboard
 */
function fallbackCopyToClipboard(text: string): void {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(
      () => {
        alert('Invite code copied to clipboard!');
      },
      (err) => {
        console.error('Could not copy text: ', err);
        // Last resort: show in alert for manual copy
        alert(`Invite code: ${text}`);
      }
    );
  } else {
    // Very old browsers
    alert(`Invite code: ${text}`);
  }
}

/**
 * Handle app state changes
 * Useful for detecting when app comes back from background
 */
export async function onAppStateChange(callback: (isActive: boolean) => void): Promise<() => void> {
  if (!Capacitor.isNativePlatform()) {
    return () => {};
  }

  const listener = await App.addListener('appStateChange', ({ isActive }) => {
    console.log('App state changed. Is active?', isActive);
    callback(isActive);
  });

  return () => {
    listener.remove();
  };
}

/**
 * Get app information
 */
export async function getAppInfo(): Promise<{ version: string; build: string }> {
  if (!Capacitor.isNativePlatform()) {
    return { version: '1.0.0', build: '1' };
  }

  const info = await App.getInfo();
  return {
    version: info.version,
    build: info.build,
  };
}
