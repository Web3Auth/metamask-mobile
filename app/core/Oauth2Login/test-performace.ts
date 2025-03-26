/* eslint-disable no-console */
import { ethers } from 'ethers';
import {
  AuthStorageOptions,
  AuthType,
  Env,
  JwtBearerAuth,
  LoginResponse,
  Platform,
  StorageOptions,
  UserStorage
} from '@metamask/profile-sync-controller/sdk';
import { keccak_256 } from '@noble/hashes/sha3';
import byteArrayToHex from '../../util/bytes';
import { randomBytes } from '@noble/hashes/utils';
// import { scrypt } from 'react-native-aes-crypto-forked';

let globalAuth: JwtBearerAuth;

function withTimingAsync(fn: (...args: any[]) => Promise<any>) {
    return async function (...args: any[]) {
        const start = performance.now();
        const result = await fn(...args);
        const end = performance.now();
        console.log(`Execution time: ${end - start}ms`);
        return result;
    };
}

function withTimingAsyncMetric(fn: (...args: any[]) => Promise<void>) {

    return async function (...args: any[]) {
        const runs: number[] = [];

        async function metricRun (...args: any[]) {
            const start = performance.now();
            const result = await fn(...args);
            const end = performance.now();
            runs.push(end - start);
            console.log(`Execution time: ${end - start}ms`);
        };

        for (let i = 0; i < 10; i++) {
            await metricRun(args);
        }
        const average = runs.reduce((a, b) => a + b, 0) / runs.length;
        console.log(`Average execution time: ${average}ms`);
        console.log(`Runs: ${runs}`);
    }
}


const storage : Record<string, unknown> = {};
const env = Env.DEV;



// example implementation that uses local storage to persist storage key (ek in our case)
const keyStorage: StorageOptions = {
    // return ek here
    getStorageKey: async () => storage.storageKey as string,
    setStorageKey: async (val: string) => {
        // should not allow to override storage key
        storage.storageKey = val;
    },
};

async function login() {
    const { address, chainId, signMessage } = await getLoginProps();

  const authStorage: AuthStorageOptions = {
    getLoginResponse: async () => storage.authSession as LoginResponse,
    setLoginResponse: async (val: LoginResponse) => {
      storage.authSession = val;
      return;
    },
  };


  const auth = new JwtBearerAuth({
      type: AuthType.SiWE,
      platform: Platform.PORTFOLIO,
      env,
    }, {
      storage: authStorage
  });

  // REQUIRED: specify the address, domain and the chain id
  // this method has to be called again before starting the SiWE flow for a different account
  auth.prepare({
    address,
    chainId,
    domain: 'localhost',
    // domain: window.location.host,
    signMessage // REQUIRED: signMessage callback
  });

  try {
    console.log(await auth.getAccessToken());
    console.log(await auth.getUserProfile());
  } catch (e) {
    console.error(e);
  }

  globalAuth = auth;
  return auth;
}


async function testWrite( params: { auth?: JwtBearerAuth } ) {
    const auth = params.auth || globalAuth;
    const userStorage = new UserStorage(
        {
            auth,
            env,
        },
        {
            storage: keyStorage,
        }
    );

    const generatedRandomBytes = randomBytes(32);
    const hash = keccak_256.create().update(generatedRandomBytes).digest();

    await userStorage
    .setItem('oauth2.srp', byteArrayToHex(hash) , {
        // nativeScryptCrypto : scrypt, 
    })
    .then(() => {
        console.log('success');
    })
    .catch((error) => {
        console.error(error);
    });


}

async function testRead( params: { auth?: JwtBearerAuth } ) {
    const auth = params.auth || globalAuth;
    const userStorage = new UserStorage(
        {
            auth,
            env,
        },
        {
            storage: keyStorage,
        }
    );

    await userStorage
    .getItem('oauth2.srp', {
        // nativeScryptCrypto : scrypt, 
    })
    .then((setting) => {
        console.log('found notification setting:', setting);
    })
    .catch((error) => {
        console.error(error);
    });
}


export async function testPerformance() {
    console.log('testPerformance');
    const auth = await withTimingAsync(async () => {
        console.log('login');
        return await login().catch((error) => {
            console.error(error);
        });
    })();
    console.log('auth', auth);

    console.log('testWrite');
    await withTimingAsyncMetric(async () => {
        return await testWrite(auth);
    })();

    console.log('testRead');
    await withTimingAsyncMetric(async () => {
        return await testRead(auth);
    })();

}


export async function testPerformance2() {
    console.log('testPerformance2');

    console.log('testWrite');
    await withTimingAsyncMetric(async () => {
        return await testWrite({});
    })();

    console.log('testRead');
    await withTimingAsyncMetric(async () => {
        return await testRead({});
    })();
}

async function getLoginProps() {
  // derive key from ek for signature ?
  const signer = new ethers.Wallet(
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff00',
    ethers.getDefaultProvider()
  );
  const address = await signer.getAddress();
  const chainId = 1;

  return {
    address,
    chainId,
    signMessage: (message: string) => signer.signMessage(message),
  };
}
