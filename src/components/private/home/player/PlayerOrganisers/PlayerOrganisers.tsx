import React from 'react';
import { TextDs, FlexView } from '@components';
import { ScrollView, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '@theme';
import type { PlayerOrganisersProps } from './PlayerOrganisers.types';
import { OrganiserCard } from './components/OrganiserCard';
import { styles } from './PlayerOrganisers.styles';

export const PlayerOrganisers: React.FC<PlayerOrganisersProps> = ({
  organisers,
  onOrganiserPress,
}) => {
  const featuredOrganiser = organisers.find((org) => org.isFeatured);
  const regularOrganisers = organisers.filter((org) => !org.isFeatured);

  return (
    <FlexView style={styles.container}>
      <FlexView style={styles.header}>
        <TextDs style={styles.title}>Top Organisers</TextDs>
        <TouchableOpacity style={styles.headerButton}>
          <ChevronRight size={22} color={colors.text.white} />
        </TouchableOpacity>
      </FlexView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Featured Organiser Card */}
        {featuredOrganiser && (
          <FlexView style={styles.featuredContainer}>
            <OrganiserCard
              organiser={featuredOrganiser}
              onPress={onOrganiserPress}
              isFeatured={true}
            />
          </FlexView>
        )}

        {/* Regular Organiser Cards */}
        {regularOrganisers.map((organiser) => (
          <FlexView key={organiser.id} style={styles.cardContainer}>
            <OrganiserCard organiser={organiser} onPress={onOrganiserPress} />
          </FlexView>
        ))}
      </ScrollView>
    </FlexView>
  );
};
