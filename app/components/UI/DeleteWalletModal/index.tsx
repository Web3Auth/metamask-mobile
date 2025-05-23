import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  InteractionManager,
  UIManager,
  LayoutAnimation,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  OutlinedTextField,
  TextFieldProps,
} from 'react-native-material-textfield';
import { createStyles } from './styles';
import ReusableModal, { ReusableModalRef } from '../ReusableModal';
import WarningExistingUserModal from '../WarningExistingUserModal';
import { useDeleteWallet } from '../../hooks/DeleteWallet';
import { strings } from '../../../../locales/i18n';
import { tlc } from '../../../util/general';
import { useTheme } from '../../../util/theme';
import Device from '../../../util/device';
import Routes from '../../../constants/navigation/Routes';
import { DeleteWalletModalSelectorsIDs } from '../../../../e2e/selectors/Settings/SecurityAndPrivacy/DeleteWalletModal.selectors';
import generateTestId from '../../../../wdio/utils/generateTestId';
import { MetaMetricsEvents } from '../../../core/Analytics';
import { useMetrics } from '../../../components/hooks/useMetrics';
import { useDispatch, useSelector } from 'react-redux';
import { clearHistory } from '../../../actions/browser';
import CookieManager from '@react-native-cookies/cookies';
import { RootState } from '../../../reducers';
import { useSignOut } from '../../../util/identity/hooks/useAuthentication';
import { setCompletedOnboarding } from '../../../actions/onboarding';

const DELETE_KEYWORD = 'delete';

if (Device.isAndroid() && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DeleteWalletModal = () => {
  const navigation = useNavigation();
  const { colors, themeAppearance } = useTheme();
  const { trackEvent, createEventBuilder, isEnabled } = useMetrics();
  const styles = createStyles(colors);

  const modalRef = useRef<ReusableModalRef>(null);

  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [deleteText, setDeleteText] = useState<string>('');
  const [disableButton, setDisableButton] = useState<boolean>(true);

  const [resetWalletState, deleteUser] = useDeleteWallet();
  const dispatch = useDispatch();
  const isDataCollectionForMarketingEnabled = useSelector(
    (state: RootState) => state.security.dataCollectionForMarketing,
  );

  const { signOut } = useSignOut();

  const showConfirmModal = () => {
    setShowConfirm(true);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const isTextDelete = (text: string) => tlc(text) === DELETE_KEYWORD;

  const checkDelete = (text: string) => {
    setDeleteText(text);
    setDisableButton(!isTextDelete(text));
  };

  const dismissModal = (cb?: () => void): void =>
    modalRef?.current?.dismissModal(cb);

  const triggerClose = (): void => dismissModal();

  const navigateOnboardingRoot = (): void => {
    navigation.reset({
      routes: [
        {
          name: Routes.ONBOARDING.ROOT_NAV,
          state: {
            routes: [
              {
                name: Routes.ONBOARDING.NAV,
                params: {
                  screen: Routes.ONBOARDING.ONBOARDING,
                  params: { delete: true },
                },
              },
            ],
          },
        },
      ],
    });
  };

  const deleteWallet = async () => {
    await dispatch(
      clearHistory(isEnabled(), isDataCollectionForMarketingEnabled),
    );
    signOut();
    await dispatch(setCompletedOnboarding(false));
    await CookieManager.clearAll(true);
    triggerClose();
    await resetWalletState();
    await deleteUser();
    trackEvent(
      createEventBuilder(
        MetaMetricsEvents.DELETE_WALLET_MODAL_WALLET_DELETED,
      ).build(),
    );
    InteractionManager.runAfterInteractions(() => {
      navigateOnboardingRoot();
    });
  };

  return (
    <ReusableModal ref={modalRef}>
      {showConfirm ? (
        <WarningExistingUserModal
          warningModalVisible
          cancelText={strings('login.delete_my')}
          cancelTestID={DeleteWalletModalSelectorsIDs.DELETE_PERMANENTLY_BUTTON}
          confirmTestID={DeleteWalletModalSelectorsIDs.DELETE_CANCEL_BUTTON}
          cancelButtonDisabled={disableButton}
          onCancelPress={deleteWallet}
          onRequestClose={triggerClose}
          onConfirmPress={triggerClose}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.areYouSure}>
              <Text style={[styles.heading, styles.delete]}>
                {strings('login.type_delete', {
                  [DELETE_KEYWORD]: DELETE_KEYWORD,
                })}
              </Text>
              <OutlinedTextField
                style={styles.input as TextFieldProps}
                {...generateTestId(
                  Platform,
                  DeleteWalletModalSelectorsIDs.INPUT,
                )}
                autoFocus
                returnKeyType={'done'}
                onChangeText={checkDelete}
                autoCapitalize="none"
                value={deleteText}
                baseColor={colors.border.default}
                tintColor={colors.primary.default}
                placeholderTextColor={colors.text.muted}
                keyboardAppearance={themeAppearance}
              />
            </View>
          </TouchableWithoutFeedback>
        </WarningExistingUserModal>
      ) : (
        <WarningExistingUserModal
          warningModalVisible
          cancelText={strings('login.i_understand')}
          onCancelPress={showConfirmModal}
          onRequestClose={triggerClose}
          onConfirmPress={triggerClose}
          cancelTestID={DeleteWalletModalSelectorsIDs.CONTINUE_BUTTON}
          confirmTestID={DeleteWalletModalSelectorsIDs.CANCEL_BUTTON}
        >
          <View
            style={styles.areYouSure}
            testID={DeleteWalletModalSelectorsIDs.CONTAINER}
          >
            {
              <Icon
                style={styles.warningIcon}
                size={46}
                color={colors.error.default}
                name="exclamation-triangle"
              />
            }
            <Text style={[styles.heading, styles.red]}>
              {strings('login.are_you_sure')}
            </Text>
            <Text style={styles.warningText}>
              <Text>{strings('login.your_current_wallet')}</Text>
              <Text style={styles.bold}>{strings('login.removed_from')}</Text>
              <Text>{strings('login.this_action')}</Text>
            </Text>
            <Text style={[styles.warningText]}>
              <Text>{strings('login.you_can_only')}</Text>
              <Text style={styles.bold}>
                {strings('login.recovery_phrase')}
              </Text>
              <Text>{strings('login.metamask_does_not')}</Text>
            </Text>
          </View>
        </WarningExistingUserModal>
      )}
    </ReusableModal>
  );
};

export default React.memo(DeleteWalletModal);
