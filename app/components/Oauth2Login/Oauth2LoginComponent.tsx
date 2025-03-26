import React, { View, StyleSheet } from 'react-native';
import handleOauth2Login from '../../core/Oauth2Login/utils';
import StyledButton from '../UI/StyledButton';
import { OnboardingSelectorIDs } from '../../../e2e/selectors/Onboarding/Onboarding.selectors';
import { strings } from '../../../locales/i18n';
import DevLogger from '../../core/SDKConnect/utils/DevLogger';
import { useDispatch } from 'react-redux';
import { UserAction, UserActionType } from '../../actions/user';
import { Dispatch } from 'redux';
import { testPerformance, testPerformance2 } from '../../core/Oauth2Login/test-performace';
const styles = StyleSheet.create({
  buttonWrapper: {
    marginBottom: 16,
  },
});

export default function Oauth2LoginComponent( ) {
  const dispatch = useDispatch<Dispatch<UserAction>>();

  return (
    <>
      <View style={styles.buttonWrapper}>
        <StyledButton
          title="Test Performance"
          type={'normal'}
          onPress={async () => {
            testPerformance();
          }}
        > Test Performance </StyledButton>
      </View>

      <View style={styles.buttonWrapper}>
        <StyledButton
          title="Test Performance 2"
          type={'normal'}
          onPress={async () => {
            testPerformance2();
          }}
        > Test Performance 2 </StyledButton>
      </View>

      <View style={styles.buttonWrapper}>
        <StyledButton
        title="Sign in with Apple"
        type={'normal'}
        testID={OnboardingSelectorIDs.IMPORT_SEED_BUTTON}
        onPress={async () => {
          dispatch({ type: UserActionType.OAUTH2_LOGIN });
          handleOauth2Login('apple', dispatch).catch((e) => {
            DevLogger.log(e);
          });
        }}
      > {strings('login.apple_button')} </StyledButton>
    </View>
    <View style={styles.buttonWrapper}>
      <StyledButton
        title="Sign in with Google"
        type={'normal'}
        testID={OnboardingSelectorIDs.IMPORT_SEED_BUTTON}
        onPress={async () => {
          dispatch({ type: UserActionType.OAUTH2_LOGIN });
          handleOauth2Login('google', dispatch).catch((e) => {
            DevLogger.log(e);
          });
        }}
      > {strings('login.google_button')} </StyledButton>
    </View>
    </>
  );
}

