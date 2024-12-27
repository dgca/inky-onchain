import { hexToBytes } from "viem";

export function renderImageBytes(hexString: string) {
  const bytesData = hexToBytes(hexString as `0x${string}`);

  const binString = Array.from(bytesData, (byte) =>
    String.fromCodePoint(byte),
  ).join("");

  return btoa(binString);
}
