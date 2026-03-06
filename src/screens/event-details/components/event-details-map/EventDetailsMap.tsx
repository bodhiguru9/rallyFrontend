import React, { useEffect } from 'react';
import { View, TouchableOpacity, Linking, Platform } from 'react-native';
import { Map } from 'lucide-react-native';
import { WebView } from 'react-native-webview';
import { colors } from '@theme';
import { useLocationStore } from '@store/location-store';
import { TextDs } from '@components';
import { styles } from './EventDetailsMap.styles';
import type { EventDetailsMapProps } from './EventDetailsMap.types';
import Constants from 'expo-constants';

const WHITE_MAP_TILES = 'https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png';

const getMapsApiKey = (): string => {
  const fromProcess = (process as any)?.env?.GOOGLE_MAPS_ANDROID_API_KEY;
  const fromConstants = (Constants.manifest as { extra?: any } | null)?.extra?.GOOGLE_MAPS_ANDROID_API_KEY
    || (Constants.manifest as { extra?: any } | null)?.extra?.googleMaps?.androidApiKey;
  return fromProcess || fromConstants || '';
};

const buildMapHtml = (
  latitude: number | undefined,
  longitude: number | undefined,
  address: string | undefined,
  apiKey: string,
): string => {
  const hasCoords = typeof latitude === 'number' && typeof longitude === 'number';

  if (apiKey) {
    if (hasCoords) {
      return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <style>html,body{margin:0;padding:0;background:#fff;height:100%;width:100%;} #map{width:100%;height:100%;min-height:150px;background:#fff;}</style>
</head>
<body>
  <div id="map"></div>
  <script src="https://maps.googleapis.com/maps/api/js?key=${apiKey}"></script>
  <script>
    function init() {
      const center = { lat: ${latitude}, lng: ${longitude} };
      const map = new google.maps.Map(document.getElementById('map'), { center: center, zoom: 14, disableDefaultUI: true });
      new google.maps.Marker({ position: center, map: map });
    }
    window.onload = init;
  </script>
</body>
</html>
`;
    }

    const safeAddress = address ? address.replace(/'/g, "\\'") : '';
    return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <style>html,body{margin:0;padding:0;background:#fff;height:100%;width:100%;} #map{width:100%;height:100%;min-height:150px;background:#fff;}</style>
</head>
<body>
  <div id="map"></div>
  <script src="https://maps.googleapis.com/maps/api/js?key=${apiKey}"></script>
  <script>
    function init() {
      const geocoder = new google.maps.Geocoder();
      const map = new google.maps.Map(document.getElementById('map'), { zoom: 14, disableDefaultUI: true });
      geocoder.geocode({ address: '${safeAddress}' }, function(results, status) {
        if (status === 'OK' && results && results[0]) {
          const loc = results[0].geometry.location;
          map.setCenter(loc);
          new google.maps.Marker({ position: loc, map: map });
        } else {
          map.setCenter({ lat: 0, lng: 0 });
        }
      });
    }
    window.onload = init;
  </script>
</body>
</html>
`;
  }

  if (hasCoords) {
    const embedSrc = `https://www.google.com/maps?q=${latitude},${longitude}&z=14&output=embed`;
    return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>html,body{margin:0;padding:0;height:100%;width:100%;} iframe{border:0;width:100%;height:100%;min-height:150px;}</style>
</head>
<body>
  <iframe src="${embedSrc}" allowfullscreen></iframe>
</body>
</html>
`;
  }

  const embedSrc = `https://www.google.com/maps?q=${encodeURIComponent(address ?? '')}&z=14&output=embed`;
  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>html,body{margin:0;padding:0;height:100%;width:100%;} iframe{border:0;width:100%;height:100%;min-height:150px;}</style>
</head>
<body>
  <iframe src="${embedSrc}" allowfullscreen></iframe>
</body>
</html>
`;
};

export const EventDetailsMap: React.FC<EventDetailsMapProps> = ({ style, latitude, longitude, address }) => {
  const {
    locationPermissionStatus,
    lastCoordinates,
    initializeLocation,
    refreshCurrentPosition,
  } = useLocationStore();

  const hasPermission = locationPermissionStatus === 'granted';
  const hasLocation = Boolean(lastCoordinates?.latitude != null && lastCoordinates?.longitude != null);
  const hasMapFromProps = Boolean((latitude != null && longitude != null) || (address && address.length > 0));
  const showMap = hasMapFromProps || (hasPermission && hasLocation);

  // When we have permission, refresh to current position so the map shows user's actual location
  const hasEventLocation =
  (typeof latitude === 'number' && typeof longitude === 'number') ||
  (address && address.length > 0);

// Only fetch user location if event location is NOT present
useEffect(() => {
  if (!hasEventLocation && hasPermission) {
    refreshCurrentPosition();
  }
}, [hasEventLocation, hasPermission]);

  const handlePressPlaceholder = () => {
    initializeLocation();
  };

  const openInGoogleMaps = (latitude: number, longitude: number) => {
    const scheme = Platform.select({
      ios: 'maps:',
      android: 'geo:',
    });
    const url = Platform.select({
      ios: `${scheme}?q=${latitude},${longitude}`,
      android: `${scheme}${latitude},${longitude}?q=${latitude},${longitude}`,
    });
    
    if (url) {
      Linking.openURL(url).catch(() => {
        // Fallback to Google Maps web if native app fails
        const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        Linking.openURL(fallbackUrl);
      });
    }
  };

  if (showMap) {
    const apiKey = getMapsApiKey();
    let useLat: number | undefined;
    let useLng: number | undefined;
    let useAddress: string | undefined;

    if (latitude != null && longitude != null) {
      // Event has coordinates
      useLat = latitude;
      useLng = longitude;
    } else if (address) {
      // Event has address → let Google geocode it
      useAddress = address;
    } else {
      // Fallback to user location
      useLat = lastCoordinates?.latitude;
      useLng = lastCoordinates?.longitude;
    }
    const html = buildMapHtml(useLat, useLng, useAddress, apiKey);
    return (
      <TouchableOpacity
        style={[styles.container, style]}
        onPress={() => {
          if (typeof useLat === 'number' && typeof useLng === 'number') {
            openInGoogleMaps(useLat, useLng);
          } else if (useAddress) {
            const encoded = encodeURIComponent(useAddress);
            const url = `https://www.google.com/maps/search/?api=1&query=${encoded}`;
            Linking.openURL(url).catch(() => {});
          }
        }}
        activeOpacity={0.8}
      >
        <WebView
          source={{ html }}
          style={styles.webView}
          scrollEnabled={false}
          pointerEvents="none"
          originWhitelist={['*']}
        />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePressPlaceholder}
      activeOpacity={0.8}
    >
      <View style={styles.placeholder}>
        <Map size={40} color={colors.text.tertiary} />
        <TextDs style={styles.mapText}>Map View</TextDs>
        <TextDs style={styles.tapHint}>Tap to enable location</TextDs>
      </View>
    </TouchableOpacity>
  );
};
