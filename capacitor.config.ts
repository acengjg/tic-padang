import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ticpadang.app',
  appName: 'TIC Padang',
  webDir: 'dist',
  server: {
    // URL VPS production
    url: 'http://103.141.74.87:3001',
    cleartext: true // allow HTTP
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#006400", // padang-green
      showSpinner: false
    }
  }
};

export default config;
