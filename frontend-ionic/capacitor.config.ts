import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'Football-Manager',
  webDir: 'www'
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#ffffff",
      autoHide: true,
      androidScaleType: "CENTER_CROP",
    }
  }
};

export default config;
