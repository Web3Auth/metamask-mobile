import { StyleSheet } from 'react-native';
import Device from '../../../util/device';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    padding: 24,
    justifyContent: 'space-between',
    marginBottom: Device.isLargeDevice() ? 16 : 0,
  },
  content: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  walletReadyImage: {
    marginHorizontal: 'auto',
    alignSelf: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'left',
    lineHeight: 22,
    fontWeight: '400',
  },
  descriptionWrapper: {
    width: '100%',
    flexDirection: 'column',
    rowGap: 20,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'column',
    rowGap: 16,
  },
});

export default styles;
