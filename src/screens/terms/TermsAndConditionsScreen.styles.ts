import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C9E9E6', // Light mint/cyan background matching signup
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    width: 39, // 23px + 8px padding on each side
    height: 38, // 22px + 8px padding on each side
    borderRadius: 30,
    backgroundColor: 'rgba(61, 111, 146, 0.50)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Roboto',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  lastUpdated: {
    fontSize: 12,
    fontWeight: '400',
    color: '#666666',
    marginBottom: 20,
    fontStyle: 'italic',
    fontFamily: 'Roboto',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginTop: 20,
    marginBottom: 10,
    fontFamily: 'Roboto',
  },
  paragraph: {
    fontSize: 14,
    fontWeight: '400',
    color: '#333333',
    lineHeight: 22,
    marginBottom: 12,
    textAlign: 'justify',
    fontFamily: 'Roboto',
  },
  importantText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 22,
    marginBottom: 12,
    textAlign: 'justify',
    fontFamily: 'Roboto',
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginTop: 10,
    marginBottom: 8,
    fontFamily: 'Roboto',
  },
  bulletPoint: {
    fontSize: 14,
    fontWeight: '400',
    color: '#333333',
    lineHeight: 22,
    marginBottom: 8,
    marginLeft: 10,
    fontFamily: 'Roboto',
  },
  contactInfo: {
    fontSize: 14,
    fontWeight: '400',
    color: '#3D6F92',
    lineHeight: 22,
    marginBottom: 6,
    fontFamily: 'Roboto',
  },
  bottomSpacer: {
    height: 20,
  },
});
