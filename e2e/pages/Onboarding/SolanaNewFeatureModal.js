import { SolanaNewFeatureModalSelectorsIDs } from '../../selectors/Onboarding/SolanaNewFeatureModal.selectors';
import Gestures from '../../utils/Gestures';
import Matchers from '../../utils/Matchers';

class SolanaNewFeatureModal {
  get container() {
    return Matchers.getElementByID(
      SolanaNewFeatureModalSelectorsIDs.CONTAINER,
    );
  }

  get cancelButton() {
    return Matchers.getElementByID(
      SolanaNewFeatureModalSelectorsIDs.CANCEL_BUTTON,
    );
  }

  async tapCancelButton() {
    await Gestures.waitAndTap(this.cancelButton);
  }
}

export default new SolanaNewFeatureModal();
