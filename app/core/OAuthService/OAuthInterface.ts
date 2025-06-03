import { Web3AuthNetwork } from '@metamask/seedless-onboarding-controller';

export enum OAuthLoginResultType {
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface HandleOAuthLoginResult {
  type: OAuthLoginResultType;
  existingUser: boolean;
  accountName?: string;
  error?: string;
}

export enum AuthConnection {
  Google = 'google',
  Apple = 'apple',
}

export enum OauthAccessType {
  OFFLINE = 'offline',
  ONLINE = 'online',
}

export enum OauthGrantType {
  AUTHORIZATION_CODE = 'authorization_code',
  REFRESH_TOKEN = 'refresh_token',
}

export interface LoginHandlerCodeResult {
  authConnection: AuthConnection;
  code: string;
  clientId: string;
  redirectUri?: string;
  codeVerifier?: string;
}

export interface LoginHandlerIdTokenResult {
  authConnection: AuthConnection;
  idToken: string;
  clientId: string;
  redirectUri?: string;
  codeVerifier?: string;
}

export interface RefreshTokenParams {
  authConnection: AuthConnection;
  clientId: string;
  web3AuthNetwork: Web3AuthNetwork;
  refreshToken: string;
}

export type LoginHandlerResult =
  | LoginHandlerCodeResult
  | LoginHandlerIdTokenResult;

export type HandleFlowParams = LoginHandlerResult & {
  web3AuthNetwork: Web3AuthNetwork;
};

export interface OAuthUserInfo {
  email: string;
  sub: string;
}

export interface AuthRequestCodeParams {
  code: string;
  client_id: string;
  login_provider: AuthConnection;
  network: Web3AuthNetwork;
  redirect_uri?: string;
  code_verifier?: string;
  access_type?: OauthAccessType;
  grant_type?: OauthGrantType;
}

export interface AuthRequestIdTokenParams {
  id_token: string;
  client_id: string;
  login_provider: AuthConnection;
  network: Web3AuthNetwork;
  redirect_uri?: string;
  code_verifier?: string;
  access_type?: OauthAccessType;
}

export interface AuthRequestRefreshTokenParams {
  refresh_token: string;
  client_id: string;
  login_provider: AuthConnection;
  network: Web3AuthNetwork;
  grant_type: OauthGrantType.REFRESH_TOKEN;
}

export type AuthRequestParams =
  | AuthRequestCodeParams
  | AuthRequestIdTokenParams;

export interface AuthResponse {
  id_token: string;
  indexes: number[];
  endpoints: Record<string, string>;
  success: boolean;
  message: string;
  jwt_tokens: Record<string, string>;
  refresh_token?: string;
  revoke_token?: string;
}

export type AuthRefreshTokenResponse = Pick<
  AuthResponse,
  'jwt_tokens' | 'refresh_token' | 'revoke_token'
>;

export interface AuthRevokeTokenResponse {
  refresh_token: string;
  revoke_token: string;
}

export interface LoginHandler {
  get authConnection(): AuthConnection;
  get scope(): string[];
  get authServerPath(): string;
  login(): Promise<LoginHandlerResult>;
}
