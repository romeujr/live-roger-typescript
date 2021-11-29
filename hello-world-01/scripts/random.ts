const START_INDEX = 0;
const BYTE_FIRST_VALUE = 0;
const BYTE_LAST_VALUE = 255;
const BYTE_NUMBER_OF_VALUES = 256;
const HEXADECIMAL_CODE = 16;
const HEXADECIMAL_SLICE = -2;
const UID_INDEX_A = 0;
const UID_INDEX_B = 8;
const UID_INDEX_C1 = 12;
const UID_INDEX_C2 = 13;
const UID_INDEX_D = 16;
const UID_INDEX_E = 20;
const UID_INDEX_F = 32;

async function toHexString(uint8Array: Readonly<Uint8Array>): Promise<string> {
    const result = new Promise<string>((resolve, reject) => {
        const hexString = Array.from(uint8Array).map((byte: number) => {
            const data = (byte >= BYTE_FIRST_VALUE) && (byte <= BYTE_LAST_VALUE) ? byte : undefined;
            const value = (undefined !== data) ?
                (`0${(data).toString(HEXADECIMAL_CODE)}`).slice(HEXADECIMAL_SLICE) : '?';
            if ('?' === value) {
                reject(new Error(`Invalid input data: byte = ${byte}, value = ${value}`));
            }
            return value;
        }).join('');
        resolve(hexString);
    });
    return result;
}

export function buildRandomArray(length: number): Uint8Array {
    const data = Array<number>();
    for (let i = START_INDEX; i < length; i++) {
        const value = Math.trunc(Math.random() * BYTE_NUMBER_OF_VALUES);
        data.push(value);
    }
    const result = new Uint8Array(data);
    return result;
}

export async function buildNewUid(): Promise<string> {
    const result = new Promise<string>((resolve, reject) => {
        const randomArray = buildRandomArray(HEXADECIMAL_CODE);
        toHexString(randomArray).then((data) => {
            const header = `${data.substring(UID_INDEX_A, UID_INDEX_B)}-${data.substring(UID_INDEX_B, UID_INDEX_C1)}`;
            const body = `${data.substring(UID_INDEX_C2, UID_INDEX_D)}-${data.substring(UID_INDEX_D, UID_INDEX_E)}`;
            const footer = `${data.substring(UID_INDEX_E, UID_INDEX_F)}`;
            const value = `${header}-4${body}-${footer}`;
            resolve(value);
        }).catch((e) => {
            reject(e);
        });
    });
    return result;
}
