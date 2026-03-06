import { Share, Platform } from 'react-native';
import { ENV } from '@config';

export interface ShareEventParams {
  eventId: string;
  eventName: string;
  creatorName?: string;
  formattedDateTime: string;
  eventLocation?: string;
  sportType?: string;
  price?: string | number;
  spotsFilled?: number;
  totalSpots?: number;
  spotsLeft?: number;
}

export interface ShareEventWithPlayersParams extends ShareEventParams {
  participantNames: string[];
}

/**
 * Share event via native sheet (WhatsApp, Messages, etc.).
 * Uses ENV.RALLY_WEB_BASE_URL for link preview (og:title, og:description, og:image on web).
 */
export async function shareEvent(params: ShareEventParams): Promise<void> {
  const { eventId, eventName, creatorName, formattedDateTime, eventLocation, sportType, price, spotsFilled, totalSpots, spotsLeft } = params;
  const shareUrl = `${ENV.RALLY_WEB_BASE_URL}event/${eventId}`;
  
  const firstLine = creatorName 
    ? `Check this event out! ${eventName} by ${creatorName}.`
    : `Check this event out! ${eventName}`;
  
  // Build spots info line
  let spotsInfo = '';
  if (spotsFilled !== undefined && totalSpots !== undefined) {
    spotsInfo = `👥 ${spotsFilled}/${totalSpots}`;
    if (spotsLeft !== undefined && spotsLeft > 0 && spotsLeft < 10) {
      spotsInfo += `       🔥 ${spotsLeft} spots left`;
    }
  }
  
  const message = [
    firstLine,
    '',
    `📅 ${formattedDateTime}`,
    eventLocation ? `📍 ${eventLocation}` : '',
    sportType ? `🏓 ${sportType}` : '',
    spotsInfo,
    price !== undefined && price !== null ? `💰 ${price}` : '',
    '',
    `🔗 Book Now: ${shareUrl}`,
  ]
    .filter(Boolean)
    .join('\n');
  try {
    await Share.share(
      Platform.select({
        ios: { message, title: eventName, url: shareUrl },
        android: { message, title: eventName },
        default: { message, title: eventName },
      }) ?? { message, title: eventName },
    );
  } catch {
    // User cancelled or share failed – no-op
  }
}

/**
 * Share event details plus joined players list via native sheet (WhatsApp, Messages, etc.).
 * Lets organisers share the full attendee list with event info outside the app.
 */
export async function shareEventWithPlayers(params: ShareEventWithPlayersParams): Promise<void> {
  const {
    eventId,
    eventName,
    creatorName,
    formattedDateTime,
    eventLocation,
    sportType,
    price,
    spotsFilled,
    totalSpots,
    spotsLeft,
    participantNames,
  } = params;
  const shareUrl = `${ENV.RALLY_WEB_BASE_URL}event/${eventId}`;
  
  const firstLine = creatorName 
    ? `${eventName} by ${creatorName}.`
    : eventName;
  
  const playersList =
    participantNames.length > 0
      ? participantNames.map((name, i) => `${i + 1}. ${name}`).join('\n')
      : 'No players joined yet.';
  
  // Build spots info line
  let spotsInfo = '';
  if (spotsFilled !== undefined && totalSpots !== undefined) {
    spotsInfo = `👥 ${spotsFilled}/${totalSpots}`;
    if (spotsLeft !== undefined && spotsLeft > 0 && spotsLeft < 10) {
      spotsInfo += `       🔥 ${spotsLeft} spots left`;
    }
  }
      
  const message = [
    firstLine,
    '',
    `📅 ${formattedDateTime}`,
    eventLocation ? `📍 ${eventLocation}` : '',
    sportType ? `🏓 ${sportType}` : '',
    spotsInfo,
    price !== undefined && price !== null ? `💰 ${price}` : '',
    '',
    'Joined players:',
    playersList,
    '',
    `🔗 Book Now: ${shareUrl}`,
  ]
    .filter(Boolean)
    .join('\n');
  try {
    await Share.share(
      Platform.select({
        ios: { message, title: `${eventName} – Player list` },
        android: { message, title: `${eventName} – Player list` },
        default: { message, title: `${eventName} – Player list` },
      }) ?? { message, title: `${eventName} – Player list` },
    );
  } catch {
    // User cancelled or share failed – no-op
  }
}