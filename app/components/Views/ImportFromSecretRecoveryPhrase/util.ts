import Clipboard from '@react-native-clipboard/clipboard';
import { isE2E } from '../../../util/test/utils';
import { SeedlessOnboardingTestUtilts } from '../../../util/test/seedlessOnboardingTestUtilts';

export const getClipboardText = async () => {
  // Do mock response if running in e2e mode
  if (isE2E) {
    const mockClipboardText = await SeedlessOnboardingTestUtilts.getInstance().getMockedClipboardTextResponse();

    // When mock is present, set the clipboard text to the mock value
    if (mockClipboardText) {
      return Clipboard.setString(mockClipboardText);
    }
  }

  const text = await Clipboard.getString();
  return text;
};

export const clearClipboard = () => {
  Clipboard.clearString();
};
