import React from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { Button, FlexView, ImageDs, TextDs } from '@components';
import { colors, spacing } from '@theme';

export interface WaitlistJoinedModalProps {
  visible: boolean;
  onClose: () => void;
}

export const WaitlistJoinedModal: React.FC<WaitlistJoinedModalProps> = ({
  visible,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: colors.surface.overlay, justifyContent: 'center', padding: spacing.lg }}
        activeOpacity={1}
        onPress={onClose}
      >
        <View>
          <FlexView
            style={{
              experimental_backgroundImage: colors.gradient.mainBackground
            }}
            borderRadius={20}
            alignItems='center'
            justifyContent='center'
            px={8}
            pt={26}
            pb={16}
          >
            <ImageDs image="hourGlass" size={80} style={{ marginBottom: 20 }} />
            <TextDs size={20} weight="bold" align='center' style={{ marginBottom: 4 }}>
              Waitlist Joined
            </TextDs>
            <TextDs size={14} weight="regular" color="secondary" align='center' numberOfLines={3} style={{ marginBottom: 16 }}>
              You will be notified as soon as a spot opens up. First to pay gets the spot!
            </TextDs>
            <FlexView row gap={12} width={"100%"}>
              <Button
                onPress={onClose}
                rounded
                backgroundColor={colors.primaryDark}
                style={{
                  paddingVertical: 6,
                  flex: 1
                }}
              >
                <TextDs size={16} color='white' weight='semibold'>
                  Okay
                </TextDs>
              </Button>
            </FlexView>
          </FlexView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
