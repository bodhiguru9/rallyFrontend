import { TouchableOpacity } from 'react-native';
import { FlexView, ImageDs, TextDs } from '@components';
import { spacing } from '@theme';
import { styles } from '../style/OrganiserHomeContent.styles';

interface EmptyStateProps {
  handleCreateEvent: () => void;
}

export const renderEmptyState = ({ handleCreateEvent }: EmptyStateProps) => (
  <FlexView flex={1} justifyContent="center" alignItems="center" padding={spacing.xl}>
    <FlexView alignItems="center" gap={spacing.lg}>
      <FlexView style={styles.illustrationContainer}>
        <ImageDs
          image="CreateEventEmptyScreen"
          style={styles.emptyStateImage}
          fit="contain"
        />
      </FlexView>
      <FlexView alignItems="center" gap={spacing.sm}>
        <TextDs size={14} weight="regular" color="primary" align="center">
          Create your first Event
        </TextDs>
        <TextDs size={14} weight="regular" color="secondary" align="center">
          Create your first event to view statistics
        </TextDs>
      </FlexView>
      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateEvent}
        activeOpacity={0.8}
      >
        <TextDs size={14} weight="regular" color="white">
          Create Event
        </TextDs>
      </TouchableOpacity>
    </FlexView>
  </FlexView>
);
