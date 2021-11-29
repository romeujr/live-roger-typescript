const B64_OFFSET = 4;
const REST_THREE = 3;
const REST_TWO = 2;

export function b64ToB64u(value: string): string {
    let result = value.replace(/=/g, '');
    result = result.replace(/\+/g, '-');
    result = result.replace(/\//g, '_');
    return result;
}

export function b64uToB64(value: string): string {
    let result = (value) ? value.toString().trim() : '';
    if (result.length % B64_OFFSET === REST_TWO) {
        result = `${result}==`;
    } else if (value.length % B64_OFFSET === REST_THREE) {
        result = `${result}=`;
    }
    result = result.replace(/-/g, '+');
    result = result.replace(/_/g, '/');
    return result;
}

export function base64ToArrayBuffer(value: string): Uint8Array {
    const result = Uint8Array.from(atob(b64uToB64(value)), (i) => i.charCodeAt(0));
    return result;
}

export function arrayBufferToBase64(value: Readonly<ArrayBuffer>): string {
    const uint8Array = new Uint8Array(value);
    const textFromArray = String.fromCharCode(...uint8Array);
    const result = btoa(textFromArray);
    return result;
}
