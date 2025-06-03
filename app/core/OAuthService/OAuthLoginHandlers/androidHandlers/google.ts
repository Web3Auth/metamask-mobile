import {
  LoginHandlerIdTokenResult,
  AuthConnection,
} from '../../OAuthInterface';
import { signInWithGoogle } from 'react-native-google-acm';
import { BaseLoginHandler } from '../baseHandler';
import { OAuthErrorType, OAuthError } from '../../error';

/**
 * AndroidGoogleLoginHandler is the login handler for the Google login on android.
 */
export class AndroidGoogleLoginHandler extends BaseLoginHandler {
  readonly #scope = ['email', 'profile'];

  get authConnection() {
    return AuthConnection.Google;
  }

  get scope() {
    return this.#scope;
  }

  get authServerPath() {
    return 'api/v1/oauth/id_token';
  }

  /**
   * This method is used to login with google seemsless via react-native-google-acm.
   *
   * @returns LoginHandlerIdTokenResult
   */
  async login(): Promise<LoginHandlerIdTokenResult> {
    try {
      const result = await signInWithGoogle({
        serverClientId: this.clientId,
        nonce: this.nonce,
        autoSelectEnabled: true,
        filterByAuthorizedAccounts: false,
      });

      if (result?.type === 'google-signin') {
        return {
          authConnection: this.authConnection,
          idToken: result.idToken,
          clientId: this.clientId,
        };
      }

      throw new OAuthError(
        'handleGoogleLogin: Unknown error',
        OAuthErrorType.UnknownError,
      );
    } catch (error) {
      if (error instanceof OAuthError) {
        throw error;
      } else if (error instanceof Error) {
        if (error.message.includes('cancelled')) {
          throw new OAuthError(
            'handleGoogleLogin: User cancelled the login process',
            OAuthErrorType.UserCancelled,
          );
        } else {
          throw new OAuthError(error, OAuthErrorType.UnknownError);
        }
      } else {
        throw new OAuthError(
          'handleGoogleLogin: Unknown error',
          OAuthErrorType.UnknownError,
        );
      }
    }
  }
}
