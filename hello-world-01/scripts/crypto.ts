const AES_KEY_SIZE = 32;
const AES_IV_SIZE = 16;

export interface IAesJsonWebKey {
    readonly alg: string;
    readonly k: Readonly<ArrayBuffer>;
    readonly iv: Readonly<ArrayBuffer>;
}

function getAesCbcAlgorithm(iv: Readonly<ArrayBuffer>): AesCbcParams {
    const result: AesCbcParams = {
        name: 'AES-CBC',
        iv: iv
    };
    return result;
}

export function buildAesJsonWebKey(aesKey: ArrayBuffer, initializationVector: ArrayBuffer): IAesJsonWebKey {
    const result: IAesJsonWebKey = {
        alg: 'AES-CBC-PKCS7',
        k: aesKey.slice(0, AES_KEY_SIZE),
        iv: initializationVector.slice(0, AES_IV_SIZE),
    };
    return result;
}

export async function aesCbcEncrypt(
    aesKey: Readonly<IAesJsonWebKey>,
    inputData: Readonly<ArrayBuffer>
): Promise<ArrayBuffer> {
    const { subtle } = window.crypto;
    const aesCbcAlgorithm = getAesCbcAlgorithm(aesKey.iv);
    const cryptoKey = await subtle.importKey('raw', aesKey.k, aesCbcAlgorithm.name, false, ['encrypt']);
    const result = await subtle.encrypt(aesCbcAlgorithm, cryptoKey, inputData) as ArrayBuffer;
    return result;
}

export async function aesCbcDecrypt(
    aesKey: Readonly<IAesJsonWebKey>,
    inputData: Readonly<ArrayBuffer>
): Promise<ArrayBuffer> {
    const { subtle } = window.crypto;
    const aesCbcAlgorithm = getAesCbcAlgorithm(aesKey.iv);
    const cryptoKey = await subtle.importKey('raw', aesKey.k, aesCbcAlgorithm.name, false, ['decrypt']);
    const result = await subtle.decrypt(aesCbcAlgorithm, cryptoKey, inputData) as ArrayBuffer;
    return result;
}

export async function getSha256(
    inputData: Readonly<ArrayBuffer>
): Promise<ArrayBuffer> {
    const { subtle } = window.crypto;
    const result = await subtle.digest('SHA-256', inputData);
    return result;
}
