import * as crypto from './crypto';
import * as base64Conversor from './base64-conversor';

const JSON_PADDING = 2;

async function buildAesJsonWebKeyByText(
    sourcePseudoSecretKeyText: string): Promise<crypto.IAesJsonWebKey> {

    const textEncoder = new TextEncoder(); // Para converter texto para bytes.
    const sourcePseudoSecretKeyBytes = textEncoder.encode(sourcePseudoSecretKeyText);
    const deterministicKeyBytes = await crypto.getSha256(sourcePseudoSecretKeyBytes);
    const result = crypto.buildAesJsonWebKey(deterministicKeyBytes, deterministicKeyBytes);

    return result;
}

async function buildAesJsonWebKeyElement(selectors: string): Promise<crypto.IAesJsonWebKey> {
    const sourcePseudoSecretKeyElement = document.querySelector(selectors);
    const sourcePseudoSecretKeyText = (sourcePseudoSecretKeyElement instanceof HTMLInputElement) ?
        sourcePseudoSecretKeyElement.value : '';
    const result = await buildAesJsonWebKeyByText(sourcePseudoSecretKeyText);

    return result;
}

async function encryptTextByAesToBase64u(
    aesJsonWebKey: crypto.IAesJsonWebKey, sourceMessageText: string): Promise<string> {

    const textEncoder = new TextEncoder(); // Para converter texto para bytes.
    const sourceMessageBytes = textEncoder.encode(sourceMessageText);
    const encryptedMessageBytes = await crypto.aesCbcEncrypt(aesJsonWebKey, sourceMessageBytes);
    const encryptedMessageInBase64 = base64Conversor.arrayBufferToBase64(encryptedMessageBytes);
    const result = base64Conversor.b64ToB64u(encryptedMessageInBase64);

    return result;
}

async function decryptBase64uByAesToText(
    aesJsonWebKey: crypto.IAesJsonWebKey, encryptedMessageInBase64u: string): Promise<string> {

    const encryptedMessageBytes = base64Conversor.base64ToArrayBuffer(encryptedMessageInBase64u);
    const decryptedMessageBytes = await crypto.aesCbcDecrypt(aesJsonWebKey, encryptedMessageBytes);

    const textEncoder = new TextDecoder(); // Para converter bytes para texto.
    const result = textEncoder.decode(decryptedMessageBytes);

    return result;
}

async function encrypt(): Promise<void> {
    const aesJsonWebKey = await buildAesJsonWebKeyElement('.sourcePseudoSecretKeyText');
    const sourceMessageElement = document.querySelector('.sourceMessageText');
    const sourceMessageText = (sourceMessageElement instanceof HTMLInputElement) ?
        sourceMessageElement.value : '';
    const encryptedMessageInBase64u = await encryptTextByAesToBase64u(aesJsonWebKey, sourceMessageText);

    const encryptedMessageElement = document.querySelector('.encryptedMessageText');
    if (encryptedMessageElement instanceof HTMLInputElement) {
        encryptedMessageElement.value = encryptedMessageInBase64u;
    }
}

async function decrypt(): Promise<void> {
    const encryptedMessageElement = document.querySelector('.encryptedMessageText');
    if (encryptedMessageElement instanceof HTMLInputElement) {
        const aesJsonWebKey = await buildAesJsonWebKeyElement('.sourcePseudoSecretKeyText');
        const decryptedMessageText = await decryptBase64uByAesToText(aesJsonWebKey, encryptedMessageElement.value);
        const decryptedMessageElement = document.querySelector('.decryptedMessageText');
        if (decryptedMessageElement instanceof HTMLInputElement) {
            decryptedMessageElement.value = decryptedMessageText;
        }
    }
}

async function setup(): Promise<void> {
    const encryptElement = document.querySelector('.encrypt');
    if (encryptElement) {
        encryptElement.addEventListener('click', () => encrypt());
    }

    const decrypElement = document.querySelector('.decrypt');
    if (decrypElement) {
        decrypElement.addEventListener('click', () => decrypt());
    }
}

setup().catch((e) => {
    throw e;
});