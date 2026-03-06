import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { PackageCard } from '../PackageCard';
import type { PackageData } from '../../data/organiserEventDetails.data';

interface PackagesSectionProps {
  packages: PackageData[];
  onPackagePress: (id: string) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({
  packages,
  onPackagePress,
}) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {packages.map((pkg) => (
        <PackageCard
          key={pkg.id}
          title={pkg.title}
          validity={pkg.validity}
          sport={pkg.sport}
          eventType={pkg.eventType}
          numberOfEvents={pkg.numberOfEvents}
          price={pkg.price}
          currency={pkg.currency}
          onPress={() => onPackagePress(pkg.id)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
