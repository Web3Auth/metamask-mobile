// import Crypto from 'react-native-quick-crypto';
// eslint-disable-next-line import/no-nodejs-modules
// import Crypto from 'react-native-crypto';
// eslint-disable-next-line import/no-nodejs-modules
import Crypto from 'crypto';

// TODO: FIX ME
// eslint-disable-next-line no-console
global.crypto = {
  ...Crypto,
  ...global.crypto,
};
