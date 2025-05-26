import { HandleOAuthLoginResult, LoginHandlerResult } from './OAuthInterface';

export class OAuthServiceTestUtils {
  public static instance: OAuthServiceTestUtils | null = null;

  public static getInstance(): OAuthServiceTestUtils {
    if (!OAuthServiceTestUtils.instance) {
      OAuthServiceTestUtils.instance = new OAuthServiceTestUtils();
    }
    return OAuthServiceTestUtils.instance;
  }

  public static resetInstance(): void {
    OAuthServiceTestUtils.instance = null;
  }

  // These are not real urls, they are used to mock the OAuthService.handleSeedlessAuthenticate and OAuthService.handleOAuthLogin methods
  readonly #mockOAuthServiceLoginURL = 'https://mock-oauth-service-login';
  readonly #mockControllerAuthenticateURL = 'https://mock-controller-authenticate';

  public async getMockedOAuthLoginResponse(
  ): Promise<LoginHandlerResult> {
    const response = await fetch(this.#mockOAuthServiceLoginURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  }

  public async getMockedSeedlessAuthenticateResponse(
  ): Promise<HandleOAuthLoginResult> {
    const response = await fetch(this.#mockControllerAuthenticateURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  }

  public generateMockOAuthLoginResponse(response: LoginHandlerResult) {
    return {
        endpoint: this.#mockOAuthServiceLoginURL,
        response,
        responseCode: 200,
    };
  }

  public generateMockSeedlessAuthenticateResponse(response: HandleOAuthLoginResult) {
    return {
      endpoint: this.#mockControllerAuthenticateURL,
      response,
      responseCode: 200,
    };
  }
}
