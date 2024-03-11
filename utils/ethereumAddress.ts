import { ethers } from 'ethers';

// TODO check ENS validator on net if there is a better one?
export const isValidENS = (address: string) => {
  const addressParts = address.trim().split(".");

  const lastElement = addressParts[addressParts.length - 1];
  const endsWithETH = lastElement && lastElement.toLocaleLowerCase() === "eth";
  return Boolean(endsWithETH);
};

export const validate = (address: string): { isOk: boolean; addressType?: "ENS" | "HEX" } => {
  const isENS = isValidENS(address);
  const validEthereumAddress = isENS || ethers.utils.isAddress(address);

  if (!validEthereumAddress) return { isOk: false };

  if (isENS) return { isOk: true, addressType: "ENS" };
  return { isOk: true, addressType: "HEX" };
};
