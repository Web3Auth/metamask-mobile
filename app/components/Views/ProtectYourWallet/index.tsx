import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../util/theme';
import Text, {
  TextVariant,
  TextColor,
} from '../../../component-library/components/Texts/Text';
import { strings } from '../../../../locales/i18n';
import { getNavigationOptionsTitle } from '../../UI/Navbar';
import { useNavigation } from '@react-navigation/native';
import SelectSRP from '../SelectSRP';
import { useSelector } from 'react-redux';
import {
  selectSeedlessOnboardingAuthConnection,
  selectSeedlessOnboardingUserEmail,
  selectSeedlessOnboardingUserId,
} from '../../../selectors/seedlessOnboardingController';
import Banner, {
  BannerAlertSeverity,
  BannerVariant,
} from '../../../component-library/components/Banners/Banner';

const ProtectYourWallet = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const authConnection = useSelector(selectSeedlessOnboardingAuthConnection);
  const userEmail = useSelector(selectSeedlessOnboardingUserEmail);
  const seedlessOnboardingUserId = useSelector(selectSeedlessOnboardingUserId);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const styles = StyleSheet.create({
    root: {
      flex: 1,
      flexDirection: 'column',
    },
    socialBox: {
      padding: 16,
      marginHorizontal: 8,
    },
    box: {
      backgroundColor: colors.background.muted,
      padding: 16,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    boxRight: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 8,
    },
    accessory: {
      marginTop: 16,
      marginHorizontal: 24,
    },
  });

  useEffect(() => {
    navigation.setOptions(
      getNavigationOptionsTitle(
        strings('protect_your_wallet.title'),
        navigation,
        false,
        colors,
      ),
    );
  }, [navigation, colors]);

  const [finalUserEmail, setFinalUserEmail] = useState(userEmail);
  useEffect(() => {
    if (userEmail) {
      if (userEmail.endsWith('@privaterelay.appleid.com')) {
        setFinalUserEmail(undefined);
      } else {
        setFinalUserEmail(userEmail);
      }
    }
  }, [userEmail]);

  return (
    <View style={styles.root}>
      {authConnection && seedlessOnboardingUserId && (
        <Banner
          variant={BannerVariant.Alert}
          severity={BannerAlertSeverity.Success}
          title={strings('protect_your_wallet.login_with_social')}
          description={
            <Text variant={TextVariant.BodyMD} color={TextColor.Default}>
              {finalUserEmail}
            </Text>
          }
          style={styles.accessory}
        />
      )}
      {!authConnection && !seedlessOnboardingUserId && (
        <Banner
          variant={BannerVariant.Alert}
          severity={BannerAlertSeverity.Error}
          title={strings('app_settings.social_login_linked')}
          style={styles.accessory}
        />
      )}

      <SelectSRP />
    </View>
  );
};

export default ProtectYourWallet;
