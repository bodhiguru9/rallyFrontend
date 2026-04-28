import React from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Platform,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { ArrowUpCircle, Download, X } from 'lucide-react-native';

interface UpdateModalProps {
  visible: boolean;
  type: 'optional' | 'mandatory';
  onUpdate: () => void;
  onDismiss: () => void;
  currentVersion: string;
}

const { width } = Dimensions.get('window');

export const UpdateModal: React.FC<UpdateModalProps> = ({
  visible,
  type,
  onUpdate,
  onDismiss,
  currentVersion,
}) => {
  if (!visible) return null;

  const isMandatory = type === 'mandatory';

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
        
        <View style={styles.container}>
          <View style={styles.card}>
            {!isMandatory && (
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={onDismiss}
                activeOpacity={0.7}
              >
                <X size={20} color="#666" />
              </TouchableOpacity>
            )}

            <View style={styles.iconContainer}>
              <ArrowUpCircle size={48} color="#FF3B30" strokeWidth={1.5} />
            </View>

            <Text style={styles.title}>Update Available</Text>
            <Text style={styles.description}>
              {isMandatory
                ? "A critical update is required to continue using Rally. Please update to the latest version."
                : "We've added new features and improvements! Update now for the best experience."}
            </Text>

            <View style={styles.versionBadge}>
              <Text style={styles.versionText}>Current Version: {currentVersion}</Text>
            </View>

            <TouchableOpacity
              style={styles.updateButton}
              onPress={onUpdate}
              activeOpacity={0.8}
            >
              <Download size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.updateButtonText}>Update Now</Text>
            </TouchableOpacity>

            {!isMandatory && (
              <TouchableOpacity
                style={styles.skipButton}
                onPress={onDismiss}
                activeOpacity={0.7}
              >
                <Text style={styles.skipButtonText}>Maybe Later</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  container: {
    width: width * 0.85,
    maxWidth: 400,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  versionBadge: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 24,
  },
  versionText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  updateButton: {
    backgroundColor: '#000',
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  updateButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    height: 48,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#8E8E93',
    fontSize: 15,
    fontWeight: '500',
  },
});
