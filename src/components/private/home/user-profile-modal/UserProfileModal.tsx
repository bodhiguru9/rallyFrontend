import React from 'react';
import { FlexView } from '@designSystem/atoms/FlexView';
import { TextDs } from '@designSystem/atoms/TextDs';
import { Modal, TouchableOpacity, Pressable } from 'react-native';
import { LogOut, Mail, Phone, X } from 'lucide-react-native';
import { colors } from '@theme';
import { Avatar } from '../../sign-up/profile-setup/Avatar';
import type { UserProfileModalProps } from './UserProfileModal.types';
import { styles } from './UserprofileModal.styles';
import { getUserInitials } from '@utils';

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  visible,
  user,
  onClose,
  onLogout,
}) => {
  if (!user) {
    return null;
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <FlexView style={styles.modalContainer}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <FlexView style={styles.modalContent}>
              {/* Close Button */}
              <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
                <X size={24} color={colors.text.secondary} />
              </TouchableOpacity>

              {/* User Avatar */}
              <FlexView style={styles.avatarContainer}>
                <Avatar
                  imageUri={user.profilePic}
                  initials={getUserInitials(user.fullName)}
                  size="lg"
                />
              </FlexView>

              {/* User Info */}
              <FlexView style={styles.userInfo}>
                <TextDs style={styles.userName}>{user.fullName}</TextDs>
                {user.mobileNumber && (
                  <FlexView style={styles.phoneContainer}>
                    <Phone size={16} color={colors.text.secondary} />
                    <TextDs style={styles.phoneNumber}>{user.mobileNumber}</TextDs>
                  </FlexView>
                )}
                {user.email && (
                  <FlexView style={styles.emailContainer}>
                    <Mail size={16} color={colors.text.secondary} />
                    <TextDs style={styles.email}>{user.email}</TextDs>
                  </FlexView>
                )}
              </FlexView>

              {/* Divider */}
              <FlexView style={styles.divider} />

              {/* Logout Button */}
              <TouchableOpacity style={styles.logoutButton} onPress={onLogout} activeOpacity={0.7}>
                <LogOut size={20} color={colors.status.error} />
                <TextDs style={styles.logoutText}>Logout</TextDs>
              </TouchableOpacity>
            </FlexView>
          </Pressable>
        </FlexView>
      </Pressable>
    </Modal>
  );
};
