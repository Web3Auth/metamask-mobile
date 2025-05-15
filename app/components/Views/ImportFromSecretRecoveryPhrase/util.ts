import Clipboard from '@react-native-clipboard/clipboard';
import { isE2E } from '../../../util/test/utils';
const E2E_CLIPBOARD_SRP = 'all huge boy erupt choose people leaf awful can twenty point swap';

export const getClipboardText = async () => {
  if (isE2E) return E2E_CLIPBOARD_SRP;
  const text = await Clipboard.getString();
  return text;
};

export const clearClipboard = () => {
  Clipboard.clearString();
};
