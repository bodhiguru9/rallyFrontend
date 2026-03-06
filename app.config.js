const dotenv = require('dotenv');
const { expand } = require('dotenv-expand');

// Load .env.local if present
expand(dotenv.config({ path: '.env.local' }));

module.exports = ({ config }) => {
  const baseConfig = config || {};
  const legacyClientId = process.env.GOOGLE_AUTH_CLIENT_ID;
  const googleWebClientId = process.env.GOOGLE_WEB_CLIENT_ID || legacyClientId;
  const googleIosClientId = process.env.GOOGLE_IOS_CLIENT_ID || legacyClientId;
  const googleAndroidClientId = process.env.GOOGLE_ANDROID_CLIENT_ID || legacyClientId;

  return {
    ...baseConfig,
    extra: {
      ...(baseConfig.extra || {}),
      googleOAuth: {
        ...(baseConfig.extra?.googleOAuth || {}),
        iosClientId: googleIosClientId || baseConfig.extra?.googleOAuth?.iosClientId,
        androidClientId: googleAndroidClientId || baseConfig.extra?.googleOAuth?.androidClientId,
        webClientId: googleWebClientId || baseConfig.extra?.googleOAuth?.webClientId,
      },
      googleMaps: {
        ...(baseConfig.extra?.googleMaps || {}),
        androidApiKey: process.env.GOOGLE_MAPS_ANDROID_API_KEY || baseConfig.extra?.googleMaps?.androidApiKey,
        iosApiKey: process.env.GOOGLE_MAPS_IOS_API_KEY || baseConfig.extra?.googleMaps?.iosApiKey,
      },
    },
  };
};
