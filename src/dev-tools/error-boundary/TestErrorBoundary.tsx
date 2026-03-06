/**
 * TestErrorBoundary Component
 *
 * A test component to demonstrate and verify ErrorBoundary functionality.
 * This component intentionally throws an error when the button is clicked.
 *
 * Usage:
 * 1. Import this component into any screen
 * 2. Click the "Test Error Boundary" button
 * 3. Observe the error handling behavior
 *
 * @example
 * import { TestErrorBoundary } from '@dev-tools/error-boundary/TestErrorBoundary';
 *
 * <TestErrorBoundary />
 */

import React, { useState } from 'react';
import { TextDs,  FlexView } from '@components';
import {TouchableOpacity, StyleSheet} from 'react-native';
import { colors, spacing, getFontStyle, borderRadius } from '@theme';

const BuggyComponent: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    // This will trigger the ErrorBoundary
    throw new Error('Test error: This is an intentional error to test the ErrorBoundary!');
  }

  return (
    <FlexView style={styles.successContainer}>
      <TextDs style={styles.successText}>✅ No error thrown</TextDs>
    </FlexView>
  );
};

export const TestErrorBoundary: React.FC = () => {
  const [shouldThrowError, setShouldThrowError] = useState(false);

  const handleTestError = () => {
    setShouldThrowError(true);
  };

  return (
    <FlexView style={styles.container}>
      <FlexView style={styles.card}>
        <TextDs style={styles.title}>🧪 Error Boundary Test</TextDs>
        <TextDs style={styles.description}>
          Click the button below to trigger an intentional error and test the ErrorBoundary
          functionality.
        </TextDs>

        <TouchableOpacity style={styles.button} onPress={handleTestError}>
          <TextDs style={styles.buttonText}>Test Error Boundary</TextDs>
        </TouchableOpacity>

        <BuggyComponent shouldThrow={shouldThrowError} />

        <TextDs style={styles.hint}>
          Expected behavior:{'\n'}
          • Dev Mode: Alert with error details{'\n'}
          • Production: Simple &ldquo;Something went wrong&rdquo; alert{'\n'}
          • Console: Full error log
        </TextDs>
      </FlexView>
    </FlexView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.base,
  },
  card: {
    backgroundColor: colors.background.secondary,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  title: {
    ...getFontStyle(20, 'bold'),
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  description: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  button: {
    backgroundColor: colors.status.error,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  buttonText: {
    ...getFontStyle(14, 'bold'),
    color: colors.background.primary,
  },
  successContainer: {
    padding: spacing.md,
    backgroundColor: `${colors.status.success}20`,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  successText: {
    ...getFontStyle(12, 'medium'),
    color: colors.status.success,
    textAlign: 'center',
  },
  hint: {
    ...getFontStyle(8, 'regular'),
    color: colors.text.secondary,
    lineHeight: 18,
    marginTop: spacing.sm,
  },
});
