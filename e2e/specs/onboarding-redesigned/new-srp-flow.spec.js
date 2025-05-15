import OnboardingCarouselView from '../../pages/Onboarding/OnboardingCarouselView';
import OnboardingView from '../../pages/Onboarding/OnboardingView';
import ImportWalletView from '../../pages/Onboarding/ImportWalletView';
import TestHelpers from '../../helpers';
import Assertions from '../../utils/Assertions';
import { Regression } from '../../tags';
import CreatePasswordView from '../../pages/Onboarding/CreatePasswordView';
import { acceptTermOfUse } from '../../viewHelper';
import MetaMetricsOptInView from '../../pages/Onboarding/MetaMetricsOptInView';
import OnboardingSuccessView from '../../pages/Onboarding/OnboardingSuccessView';

const VALID_SRP = 'all huge boy erupt choose people leaf awful can twenty point swap';
const INVALID_SRP = 'asdf huge boy erupt choose people leaf awful can twenty point swap';

const enterSRPFlow = async () => {
  await OnboardingCarouselView.tapOnGetStartedButton();
  await acceptTermOfUse();
};

const hideKeyboard = async () => {
  // tap on title to hide keyboard
  await ImportWalletView.tapTitle();
};

describe(Regression('New SRP flow'), () => {
  beforeAll(async () => {
    jest.setTimeout(150000);
    await TestHelpers.launchApp();
  });

  describe('On Onboarding View', () => {
    it('should display Onboarding View', async () => {
      await enterSRPFlow();
      await Assertions.checkIfVisible(OnboardingView.container);
    });

    it('should enable button "Have an existing wallet"', async () => {
      await Assertions.checkIfEnabled(OnboardingView.importSeedButton);
    });

    it('should navigate to "Import Wallet View" when "Have an existing wallet" button is pressed', async () => {
      await OnboardingView.tapImportWalletFromSeedPhrase();
      await Assertions.checkIfVisible(ImportWalletView.container);
    });
  });

  describe('On Import Wallet View', () => {

    // TODO: comment out when UI bug fixed
    // it('should display error message when invalid SRP is entered', async () => {
    //   await ImportWalletView.enterSecretRecoveryPhrase(INVALID_SRP);
    //   await Assertions.checkIfVisible(ImportWalletView.errorMessage);
    // });

    // it('should enable "Continue" button when valid SRP is entered', async () => {
    //   await ImportWalletView.clearSecretRecoveryPhrase();
    //   await ImportWalletView.enterSecretRecoveryPhrase(VALID_SRP);
    //   await Assertions.checkIfEnabled(ImportWalletView.continueButton);
    // });

    it('should be able to paste Seed Phrase from clipboard', async () => {
      await hideKeyboard();
      await ImportWalletView.tapPasteClearButton();
      // TODO: assert SRP is pasted correctly
      // await Assertions.checkIfElementToHaveText( ImportWalletView.seedPhraseInput ,'all huge boy erupt choose people leaf awful can twenty point swap');
      await Assertions.checkIfEnabled(ImportWalletView.continueButton);
    });

    it('should hide all seed phrase words when "Show/Hide Seed Phrase" button is pressed', async () => {
      await ImportWalletView.tapShowHideSeedPhraseButton();
      await Assertions.checkIfTextIsNotDisplayed('all');

      await ImportWalletView.tapShowHideSeedPhraseButton();
      await Assertions.checkIfTextIsDisplayed('all');
    });

    it('should clear seed phrase when "Clear" button is pressed', async () => {
      await ImportWalletView.tapPasteClearButton();
      await Assertions.checkIfVisible(ImportWalletView.srpPlaceholderText, 500);
    });

    it('should navigate to "Create Password View" when "Continue" button is pressed', async () => {
      await hideKeyboard();
      await ImportWalletView.tapPasteClearButton();
      await hideKeyboard();
      await ImportWalletView.tapContinueButton();
      await Assertions.checkIfVisible(CreatePasswordView.container, 500);
    });

  });

  describe('On Create Password View', () => {
    it('should be able to input Password', async () => {
      await CreatePasswordView.enterPassword('123456789');
      await CreatePasswordView.reEnterPassword('123456789');
      await CreatePasswordView.tapIUnderstandCheckBox();
      await CreatePasswordView.tapCreatePasswordButton();
      await Assertions.checkIfVisible(MetaMetricsOptInView.container);
    });
  });

  describe('On Meta Metrics Opt In View', () => {
    it('should be able to agree to Meta Metrics', async () => {
      await MetaMetricsOptInView.tapIUnderstandCheckBox();
      await MetaMetricsOptInView.tapAgreeButton();
    });

    it('should navigate to Onboarding Success View', async () => {
      await Assertions.checkIfVisible(OnboardingSuccessView.container);
      await Assertions.checkIfVisible(OnboardingSuccessView.title);
      await Assertions.checkIfEnabled(OnboardingSuccessView.doneButton);
    });

    it('should complete SRP import flow', async () => {
      await OnboardingSuccessView.tapDone();
    });
  });
});
