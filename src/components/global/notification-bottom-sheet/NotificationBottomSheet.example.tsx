/**
 * Example Usage of NotificationBottomSheet Component
 *
 * This file demonstrates how to use the NotificationBottomSheet component
 * in your screens. The component fetches notifications from the API;
 * this example only shows the trigger and callbacks.
 */

import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { TextDs, FlexView } from '@components';
import { NotificationBottomSheet } from './NotificationBottomSheet';
import type { Notification } from './NotificationBottomSheet.types';

export const NotificationExample = () => {
  const [visible, setVisible] = useState(false);

  const handleAcceptSubscription = (notificationId: string) => {
    console.log('Accept subscription:', notificationId);
  };

  const handleDeclineSubscription = (notificationId: string) => {
    console.log('Decline subscription:', notificationId);
  };

  const handleNotificationPress = (notification: Notification) => {
    console.log('Notification pressed:', notification);
  };

  return (
    <FlexView>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <TextDs>Show Notifications</TextDs>
      </TouchableOpacity>

      <NotificationBottomSheet
        visible={visible}
        onClose={() => setVisible(false)}
        onAcceptSubscription={handleAcceptSubscription}
        onDeclineSubscription={handleDeclineSubscription}
        onNotificationPress={handleNotificationPress}
      />
    </FlexView>
  );
};
