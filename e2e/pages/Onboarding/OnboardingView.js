import { OnboardingSelectorIDs } from '../../selectors/Onboarding/Onboarding.selectors';
import Matchers from '../../utils/Matchers';
import Gestures from '../../utils/Gestures';

class OnboardingView {
  get container() {
    return Matchers.getElementByID(OnboardingSelectorIDs.CONTAINER_ID);
  }

  get existWalletButton() {
    return Matchers.getElementByID(OnboardingSelectorIDs.EXIST_WALLET_BUTTON);
  }

  get newWalletButton() {
    return Matchers.getElementByID(OnboardingSelectorIDs.NEW_WALLET_BUTTON);
  }

  async tapCreateWallet() {
    await Gestures.waitAndTap(this.newWalletButton);
  }

  async tapExistWalletButton() {
    await Gestures.waitAndTap(this.existWalletButton);
  }
}

export default new OnboardingView();
