import Crypto from 'react-native-quick-crypto';

global.crypto = {
  createHmac: Crypto.createHmac,
  createHash: Crypto.createHash,
  createCipheriv: Crypto.createCipheriv,
  createDecipheriv: Crypto.createDecipheriv,
  ...global.crypto,
};
