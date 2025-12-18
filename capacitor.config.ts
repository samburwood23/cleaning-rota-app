import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cleaningrotaBurwood.app',
  appName: 'Cleaning Rota',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#667eea",
      showSpinner: false
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  },
  // Deep linking configuration
  // This allows URLs like cleaningrota://join/ABC123 to open the app
  android: {
    appendUserAgent: 'CleaningRota'
  },
  ios: {
    scheme: 'cleaningrota'
  }
};

export default config;
