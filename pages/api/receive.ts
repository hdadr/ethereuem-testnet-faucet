import { ethers } from "ethers";
import { FAUCET_ETH_PRIVKEY, FAUCET_PUBLIC_ADDRESS, MAXIMUM_AMOUNT_ALLOWED_PER_TX } from "../../constants/faucet";
import { INFURA_PROJECT_ID } from "../../constants/infura";
import { TESTNETS } from "../../constants/testnets";
import { NextApiRequest, NextApiResponse } from "next";

type RequestBody = {
  amount: number;
  address: string;
  networkName: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const result = validateRequest(req.body);
  if (result.hasError) {
    return res.status(400).json({ status: "error", errorMessages: result.errors });
  }
  const { amount, address, networkName } = req.body;
  const provider = new ethers.providers.InfuraProvider(networkName, INFURA_PROJECT_ID);
  const signer = new ethers.Wallet(FAUCET_ETH_PRIVKEY, provider);
  console.log("prov");

  const [gasPrice, nonce] = await Promise.all([provider.getGasPrice(), provider.getTransactionCount(FAUCET_PUBLIC_ADDRESS, "latest")]);
  console.log([gasPrice, nonce]);

  const signedTx = await signer.signTransaction({
    from: FAUCET_PUBLIC_ADDRESS,
    to: address,
    value: ethers.utils.parseEther(amount.toString()),
    nonce,
    gasLimit: ethers.utils.hexlify("0x100000"),
    gasPrice,
  });
  console.log("end");

  res.status(200).json({ signedTx });
}

function validateRequest({ amount, address, networkName }: RequestBody) {
  let result: { errors: string[]; hasError: boolean } = { errors: [], hasError: false };

  if (!isNetworkSupported(networkName)) {
    result = { errors: ["unsupported testnet network id"], hasError: true };
  }
  if (!isAmountValid(amount)) {
    result = { errors: [...result.errors, "amount value is not valid"], hasError: true };
  }
  if (!ethers.utils.isAddress(address)) {
    result = { errors: [...result.errors, "invalid ethereum address"], hasError: true };
  }

  return result;
}

const isNetworkSupported = (name: string) => {
  return TESTNETS.some((testnet) => name === testnet.name);
};

const isAmountValid = (amount: number) => {
  let result = true;
  if (isNaN(amount)) result = false;
  if (amount <= 0 || amount > MAXIMUM_AMOUNT_ALLOWED_PER_TX) result = false;

  return result;
};
