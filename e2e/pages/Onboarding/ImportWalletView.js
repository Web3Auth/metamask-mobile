import { ImportFromSeedSelectorsIDs } from '../../selectors/Onboarding/ImportFromSeed.selectors';
import Matchers from '../../utils/Matchers';
import Gestures from '../../utils/Gestures';
import enContent from '../../../locales/languages/en.json';


class ImportWalletView {
  get container() {
    return Matchers.getElementByID(ImportFromSeedSelectorsIDs.CONTAINER_ID);
  }

  get title() {
    return Matchers.getElementByID(
      ImportFromSeedSelectorsIDs.SCREEN_TITLE_ID,
    );
  }

  get seedPhraseInput() {
    return Matchers.getElementByID(
      ImportFromSeedSelectorsIDs.SEED_PHRASE_INPUT_ID,
    );
  }

  get seedPhraseInfoIcon() {
    return Matchers.getElementByID(
      ImportFromSeedSelectorsIDs.SEED_PHRASE_INFO_ICON_ID,
    );
  }

  get showHideSeedPhraseButton() {
    return Matchers.getElementByID(
      ImportFromSeedSelectorsIDs.SHOW_HIDE_SEED_PHRASE_BUTTON_ID,
    );
  }

  get pasteClearButton() {
    return Matchers.getElementByID(
      ImportFromSeedSelectorsIDs.PASTE_CLEAR_BUTTON_ID,
    );
  }

  get errorMessage() {
    return Matchers.getElementByID(
      ImportFromSeedSelectorsIDs.INVALID_SEED_PHRASE_PLACE_HOLDER_TEXT,
    );
  }

  get continueButton() {
    return Matchers.getElementByID(
      ImportFromSeedSelectorsIDs.SUBMIT_BUTTON_ID,
    );
  }

  get srpPlaceholderText() {
    return Matchers.getElementByText(
      enContent.import_from_seed.srp_placeholder,
    );
  }

  async enterSecretRecoveryPhrase(secretRecoveryPhrase) {
    await Gestures.typeText(
      this.seedPhraseInput,
      secretRecoveryPhrase,
    );
  }

  async clearSecretRecoveryPhrase() {
    await Gestures.clearField(this.seedPhraseInput);
  }

  async tapSeedPhraseInfoIcon() {
    await Gestures.waitAndTap(this.seedPhraseInfoIcon);
  }

  async tapShowHideSeedPhraseButton() {
    await Gestures.waitAndTap(this.showHideSeedPhraseButton);
  }

  async tapPasteClearButton() {
    await Gestures.waitAndTap(this.pasteClearButton);
  }

  async tapContinueButton() {
    await Gestures.waitAndTap(this.continueButton);
  }

  async tapTitle() {
    await Gestures.waitAndTap(this.title);
  }
}

export default new ImportWalletView();
