import React, { useMemo, useState } from 'react';
import { TextDs,  FlexView } from '@components';
import {Image, Pressable, ScrollView, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Award, Calendar, Check, X } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation';
import { colors } from '@theme';
import { styles } from './style/OrganiserSubscriptionScreen.styles';

type TNav = NativeStackNavigationProp<RootStackParamList, 'OrganiserSubscription'>;

export const OrganiserSubscriptionScreen: React.FC = () => {
  const navigation = useNavigation<TNav>();

  // Placeholder until API is added:
  // - when you provide API, replace this with useQuery + response mapping
  const [isSubscribed, setIsSubscribed] = useState(false);

  const actionLabel = useMemo(() => (isSubscribed ? 'Unsubscribe' : 'Subscribe'), [isSubscribed]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlexView style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <X size={22} color={colors.text.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.upgradeBadge} activeOpacity={0.8}>
          <TextDs style={styles.upgradeBadgeText}>Upgrade to Yearly</TextDs>
        </TouchableOpacity>
      </FlexView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <FlexView style={styles.titleBlock}>
          <TextDs style={styles.title}>Rally Premium</TextDs>
          <TextDs style={styles.subtitle}>
            Access approval-only sessions, bulk packages{'\n'}and many more premium tools
          </TextDs>
        </FlexView>

        <FlexView style={styles.planCard}>
          <FlexView style={styles.planHeaderRow}>
            <FlexView style={styles.planIconCircle}>
              <Award size={16} color={colors.primary} />
            </FlexView>
            <TouchableOpacity style={styles.monthlyPill} activeOpacity={0.8}>
              <TextDs style={styles.monthlyPillText}>Monthly Plan</TextDs>
            </TouchableOpacity>
          </FlexView>

          <FlexView style={styles.priceRow}>
            <TextDs style={styles.currency}>₺</TextDs>
            <TextDs style={styles.price}>15.99</TextDs>
            <TextDs style={styles.perMonth}>/month</TextDs>
          </FlexView>

          <TextDs style={styles.renewText}>Auto Renewal on 23 October, 2024</TextDs>

          <FlexView style={styles.featuresList}>
            {[
              'Approval-Only Events',
              'Custom Refund Policy for events',
              'Bulk Packages',
              'Event Registration timings',
              'Event drafts for saving event information',
              'Remove Players from events',
              'Send Bulk updates to players via Whatsapp',
            ].map((f) => (
              <FlexView key={f} style={styles.featureRow}>
                <Check size={16} color={colors.primary} />
                <TextDs style={styles.featureText}>{f}</TextDs>
              </FlexView>
            ))}
          </FlexView>
        </FlexView>

        <FlexView style={styles.paymentCard}>
          <FlexView style={styles.paymentRow}>
            <Calendar size={16} color={colors.text.secondary} />
            <TextDs style={styles.paymentText}>Purchased on 23 Sept, 2024</TextDs>
          </FlexView>

          <FlexView style={styles.cardRow}>
            <TextDs style={styles.cardMasked}>XXXX XXXX XXXX 9801</TextDs>
            <TextDs style={styles.cardExpiry}>12/29</TextDs>
            <TouchableOpacity style={styles.changePill} activeOpacity={0.8}>
              <TextDs style={styles.changePillText}>Change</TextDs>
            </TouchableOpacity>
          </FlexView>
        </FlexView>
      </ScrollView>

      <FlexView style={styles.bottomBar}>
        <Pressable
          style={({ pressed }) => [styles.actionButton, pressed && { opacity: 0.85 }]}
          onPress={() => {
            // Placeholder toggle until API is connected
            setIsSubscribed((prev) => !prev);
          }}
        >
          <TextDs style={styles.actionButtonText}>{actionLabel}</TextDs>
        </Pressable>
      </FlexView>
    </SafeAreaView>
  );
};

