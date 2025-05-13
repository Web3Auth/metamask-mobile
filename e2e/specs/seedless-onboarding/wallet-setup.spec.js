import TestHelpers from '../../helpers';
import OnboardingCarouselView from '../../pages/SeedlessOnboarding/OnboardingCarouselView';
import Assertions from '../../utils/Assertions';
import { Regression } from '../../tags';
import TermsOfUseModal from '../../pages/SeedlessOnboarding/TermsOfUseModal';
import WalletSetupMainView from '../../pages/SeedlessOnboarding/WalletSetupMainView';
import BottomSheetView from '../../pages/SeedlessOnboarding/BottomSheetView';

import { signInWithGoogle } from 'react-native-google-acm';

jest.mock('react-native-google-acm', () => ({
  signInWithGoogle: jest.fn(),
}));

describe(Regression('Seedless Onboarding - Wallet Setup'), () => {
  beforeAll(async () => {
    jest.setTimeout(150000);
    await TestHelpers.launchApp();
  });

  it('should displayed wallet setup screen after accepting term of use', async () => {
    await OnboardingCarouselView.tapOnGetStartedButton();
    await TermsOfUseModal.tapAgreeCheckBox();
    await TermsOfUseModal.tapScrollEndButton();
    await TermsOfUseModal.tapAcceptButton();
    await Assertions.checkIfVisible(WalletSetupMainView.title);
    await Assertions.checkIfVisible(WalletSetupMainView.createNewWalletButton);
    await Assertions.checkIfEnabled(WalletSetupMainView.createNewWalletButton);
    await Assertions.checkIfVisible(WalletSetupMainView.haveAnExistingWalletButton);
    await Assertions.checkIfEnabled(WalletSetupMainView.haveAnExistingWalletButton);
  });

  it('should displayed bottom sheet after tapping on create new wallet button', async () => {
    await WalletSetupMainView.tapCreateNewWalletButton();
    await Assertions.checkIfVisible(BottomSheetView.title);
    await Assertions.checkIfVisible(BottomSheetView.googleButton);
    await Assertions.checkIfVisible(BottomSheetView.appleButton);
    await Assertions.checkIfVisible(BottomSheetView.continueWithSrpButton);
  });

  it('should displayed bottom sheet after tapping on have an existing wallet button', async () => {
    await WalletSetupMainView.tapTitle();
    await WalletSetupMainView.tapHaveAnExistingWalletButton();
    await Assertions.checkIfVisible(BottomSheetView.title);
    await Assertions.checkIfVisible(BottomSheetView.googleButton);
    await Assertions.checkIfVisible(BottomSheetView.appleButton);
    await Assertions.checkIfVisible(BottomSheetView.continueWithSrpButton);
  });

});
