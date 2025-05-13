import { OnboardingSelectorIDs, OnboardingSelectorText } from '../../selectors/SeedlessOnboarding/Onboarding.selectors';
import Matchers from '../../utils/Matchers';
import Gestures from '../../utils/Gestures';

class WalletSetupMainView {
  get container() {
    return Matchers.getElementByID(OnboardingSelectorIDs.CONTAINER_ID);
  }

  get createNewWalletButton() {
    return Matchers.getElementByID(OnboardingSelectorIDs.CREATE_A_NEW_WALLET_BUTTON);
  }

  get haveAnExistingWalletButton() {
    return Matchers.getElementByID(
      OnboardingSelectorIDs.HAVE_AN_EXISTING_WALLET_BUTTON,
    );
  }

  get title() {
    return Matchers.getElementByText(OnboardingSelectorText.TITLE);
  }


  async tapTitle() {
    await Gestures.waitAndTap(this.title);
  }

  async tapCreateNewWalletButton() {
    await Gestures.waitAndTap(this.createNewWalletButton);
  }

  async tapHaveAnExistingWalletButton() {
    await Gestures.waitAndTap(this.haveAnExistingWalletButton);
  }

}

export default new WalletSetupMainView();
