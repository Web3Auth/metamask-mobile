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

const nWordSRP = (word, number) => Array(number).fill(word).join(' ');

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

  });

  describe('On Import Wallet View', () => {
    it('should enter "Import Wallet View" from', async () => {
      await OnboardingView.tapImportWalletFromSeedPhrase();
      await Assertions.checkIfVisible(ImportWalletView.container);
    });

    it('should not split SRP when there is only 1 word', async () => {
      await ImportWalletView.enterSecretRecoveryPhrase('one');
      await Assertions.checkIfNotVisible(await ImportWalletView.getSeedPhraseAtIndex(0), 50);
    });

    it('should split SRP when there is more than 1 word', async () => {
      await ImportWalletView.clearSecretRecoveryPhrase();
      await ImportWalletView.enterSecretRecoveryPhrase(nWordSRP('one', 2));
      await Assertions.checkIfVisible(await ImportWalletView.getSeedPhraseAtIndex(1), 50);
      await Assertions.checkIfNotVisible(await ImportWalletView.getSeedPhraseAtIndex(2), 50);
      await ImportWalletView.tapTitle();
      await ImportWalletView.tapPasteClearButton();
    });

    it('should only enable "Continue" button when valid SRP is entered and at 12,15, 18, 21, or 24 words', async () => {
      for (let i = 11; i <= 24; i++) {
        // Skip the tests for 17, 20, 23 words to reduce the test time
        if( i === 17 || i === 20 || i === 23 ) continue;
        await ImportWalletView.enterSecretRecoveryPhrase(nWordSRP('one', i));

        switch (i) {
          case 12:
          case 15:
          case 18:
          case 21:
          case 24:
            await Assertions.checkIfEnabled(ImportWalletView.continueButton);
            break;
          default:
            await Assertions.checkIfDisabled(ImportWalletView.continueButton);
            break;
        }

        await ImportWalletView.tapTitle();
        await ImportWalletView.tapPasteClearButton();
      }
    });

    // TODO: should be fixed when UI is updated
    it.skip('should only enter maximum 24 words', async () => {
      await ImportWalletView.enterSecretRecoveryPhrase(nWordSRP('one', 25));

      await ImportWalletView.tapTitle();
      await ImportWalletView.tapPasteClearButton();
    });

    it('should show error message when SRP is invalid at some words', async () => {
      const invalidSRP = [nWordSRP('one', 3), 'asdfxyz', nWordSRP('one', 8)].join(' ');
      await ImportWalletView.enterSecretRecoveryPhrase(invalidSRP);
      await Assertions.checkIfTextIsDisplayed(ImportWalletView.spellcheckErrorMessage, 50);
      await Assertions.checkIfDisabled(ImportWalletView.continueButton);
      await ImportWalletView.tapTitle();
      await ImportWalletView.tapPasteClearButton();
    });

    it('should prevent import when every word is valid but SRP is invalid', async () => {
      await ImportWalletView.enterSecretRecoveryPhrase(nWordSRP('one', 12));
      await ImportWalletView.tapContinueButton();
      await Assertions.checkIfTextIsDisplayed(ImportWalletView.spellcheckErrorMessage, 50);
      await ImportWalletView.tapTitle();
      await ImportWalletView.tapPasteClearButton();
    });

    it('should be able to paste Seed Phrase from clipboard', async () => {
      await ImportWalletView.tapTitle();
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

  });

  describe('On Create Password View', () => {
    it('should navigate to "Create Password View" when "Continue" button is pressed', async () => {
      await ImportWalletView.tapTitle();
      await ImportWalletView.tapPasteClearButton();
      await ImportWalletView.tapTitle();
      await ImportWalletView.tapContinueButton();
      await Assertions.checkIfVisible(CreatePasswordView.container, 500);
    });

    it('should check if password confirmation not match', async () => {
      await CreatePasswordView.enterPassword('123456789');
      await CreatePasswordView.reEnterPassword('12345678');
      await Assertions.checkIfTextIsDisplayed(CreatePasswordView.passwordError, 50);
    });

    it('should check if password empty', async () => {
      await CreatePasswordView.resetPasswordInputs();
      await Assertions.checkIfTextIsDisplayed(CreatePasswordView.passwordError, 50);
    });

    it('should be able to input Password', async () => {
      await CreatePasswordView.resetPasswordInputs();
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
