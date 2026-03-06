
import { TextDs, FlexView } from '@components';
import { Seperator } from './Seperator';
import { colors } from '@theme';

/**
 * Example usage of the Seperator component
 */
export const SeperatorExample = () => {
  return (
    <FlexView style={{ padding: 16 }}>
      {/* Basic separator */}
      <TextDs>Section 1</TextDs>
      <Seperator />
      <TextDs>Section 2</TextDs>

      {/* Separator with custom spacing */}
      <Seperator spacing="lg" />
      <TextDs>Section 3</TextDs>

      {/* Separator with custom color */}
      <Seperator color={colors.primary} spacing="md" />
      <TextDs>Section 4</TextDs>

      {/* Separator with custom thickness */}
      <Seperator thickness={2} color={colors.accent} spacing="sm" />
      <TextDs>Section 5</TextDs>

      {/* Custom styled separator */}
      <Seperator
        spacing="xl"
        color="rgba(0, 0, 0, 0.1)"
        thickness={1}
        style={{ marginHorizontal: 20 }}
      />
    </FlexView>
  );
};
