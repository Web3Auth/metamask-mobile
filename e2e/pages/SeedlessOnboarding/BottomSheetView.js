import { OnboardingSelectorIDs, OnboardingSelectorText } from '../../selectors/SeedlessOnboarding/Onboarding.selectors';
import Matchers from '../../utils/Matchers';
import Gestures from '../../utils/Gestures';

class BottomSheetView {
  get container() {
    return Matchers.getElementByID(OnboardingSelectorIDs.BOTTOM_SHEET_CONTAINER);
  }

  get googleButton() {
    return Matchers.getElementByID(OnboardingSelectorIDs.GOOGLE_BUTTON);
  }

  get appleButton() {
    return Matchers.getElementByID(
      OnboardingSelectorIDs.APPLE_BUTTON,
    );
  }

  get continueWithSrpButton() {
    return Matchers.getElementByID(OnboardingSelectorIDs.CONTINUE_WITH_SRP_BUTTON);
  }

  get title() {
    return Matchers.getElementByText(OnboardingSelectorText.BOTTOM_SHEET_TITLE);
  }


  async tapGoogleButton() {
    await Gestures.waitAndTap(this.googleButton);
  }

  async tapAppleButton() {
    await Gestures.waitAndTap(this.appleButton);
  }

  async tapContinueWithSrpButton() {
    await Gestures.waitAndTap(this.continueWithSrpButton);
  }

}

export default new BottomSheetView();
