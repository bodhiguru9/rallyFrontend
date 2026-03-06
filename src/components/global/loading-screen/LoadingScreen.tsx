import { StyleSheet } from 'react-native';
import { FlexView } from '@designSystem/atoms/FlexView';
import { ImageDs } from '@designSystem/atoms/image';
import { colors } from '@theme';

export const LoadingScreen = () => {
  return (
    <FlexView style={styles.container}>
      <ImageDs image="WhiteBigLogo" style={styles.logo} fit="contain" />
    </FlexView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.blueGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});
