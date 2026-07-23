import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.diaka.app',
  appName: 'DIAKA',
  webDir: 'dist/DIAKA-app/browser',
  server: {
    url: 'https://diaka-app.vercel.app',
    cleartext: false
  }
};

export default config;
