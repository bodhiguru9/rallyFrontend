import React, { useMemo } from 'react';
import { FlexView, TextDs } from '@components';
import { FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { Organiser } from '@screens/home/Home.types';
import { spacing } from '@theme';
import { ArrowIcon } from '@components/global/ArrowIcon';
import { OrganiserAvatar } from './OrganiserAvatar';
import type { RootStackParamList } from '@navigation';

type TopOrganisersSectionNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface TopOrganisersSectionProps {
  topOrganisers: Organiser[];
  onOrganiserPress: (id: string, communityName?: string) => void;
  isAuthenticated?: boolean;
}

export const TopOrganisersSection: React.FC<TopOrganisersSectionProps> = ({
  topOrganisers,
  onOrganiserPress,
  isAuthenticated = false,
}) => {
  const navigation = useNavigation<TopOrganisersSectionNavigationProp>();
  const data = useMemo(() => topOrganisers ?? [], [topOrganisers]);

  const handleArrowPress = () => {
    navigation.navigate('TopOrganiserPage');
  };

  return (
    <FlexView style={styles.container}>
      <FlexView style={styles.header}>
        <TextDs size={16} weight='semibold'>Top Organisers</TextDs>
        {isAuthenticated && (
          <ArrowIcon variant="right" size="small" onClick={handleArrowPress} />
        )}
      </FlexView>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => String(item.userId ?? item.id ?? '')}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <OrganiserAvatar organiser={item} onPress={onOrganiserPress} />
        )}
      />
    </FlexView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    marginTop: 10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  listContent: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.base,
    gap: spacing.xl,
  },
});
