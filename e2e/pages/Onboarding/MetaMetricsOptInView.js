import { MetaMetricsOptInSelectorsIDs } from '../../selectors/Onboarding/MetaMetricsOptIn.selectors';
import Matchers from '../../utils/Matchers';
import Gestures from '../../utils/Gestures';

class MetaMetricsOptIn {
  get container() {
    return Matchers.getElementByID(
      MetaMetricsOptInSelectorsIDs.METAMETRICS_OPT_IN_CONTAINER_ID,
    );
  }

  get optInMetricsContent() {
    return Matchers.getElementByID(
      MetaMetricsOptInSelectorsIDs.OPTIN_METRICS_PRIVACY_POLICY_DESCRIPTION_CONTENT_1_ID,
    );
  }

  get iAgreeButton() {
    return Matchers.getElementByID(
      MetaMetricsOptInSelectorsIDs.OPTIN_METRICS_I_AGREE_BUTTON_ID,
    );
  }

  get noThanksButton() {
    return Matchers.getElementByID(
      MetaMetricsOptInSelectorsIDs.OPTIN_METRICS_NO_THANKS_BUTTON_ID,
    );
  }

  get iUnderstandCheckBox() {
    return Matchers.getElementByID(
      MetaMetricsOptInSelectorsIDs.OPTIN_METRICS_CHECKBOX_ID,
    );
  }

  async tapAgreeButton() {
    await Gestures.swipe(this.optInMetricsContent, 'up', 'fast', 0.9);
    await Gestures.waitAndTap(this.iAgreeButton);
  }

  async tapNoThanksButton() {
    await Gestures.swipe(this.optInMetricsContent, 'up', 'fast', 0.9);
    await Gestures.waitAndTap(this.noThanksButton);
  }

  async tapIUnderstandCheckBox() {
    await Gestures.waitAndTap(this.iUnderstandCheckBox);
  }
}

export default new MetaMetricsOptIn();
