import { OnboardingSuccessSelectorIDs } from '../../selectors/Onboarding/OnboardingSuccess.selectors';
import Matchers from '../../utils/Matchers';
import Gestures from '../../utils/Gestures';

class OnboardingSuccessView {
  get container() {
    return Matchers.getElementByID(OnboardingSuccessSelectorIDs.CONTAINER_ID);
  }

  get doneButton() {
    return Matchers.getElementByID(OnboardingSuccessSelectorIDs.DONE_BUTTON);
  }

  get title() {
    return Matchers.getElementByID(OnboardingSuccessSelectorIDs.TITLE_ID);
  }

  async tapDone() {
    await Gestures.waitAndTap(this.doneButton);
  }
}

export default new OnboardingSuccessView();
