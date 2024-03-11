import { useWeb3React } from '@web3-react/core';
import { NetworkConnector } from '@web3-react/network-connector';
import { ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';

export const network = new NetworkConnector({
  urls: { 1: "https://mainnet.infura.io/v3/5ca1f28e5ac34221aff446fa0518d908" },
  defaultChainId: 1,
});

const useENS = (initialAddress?: string) => {
  const { library, activate } = useWeb3React("ensProvider");
  const [ensName, setENSName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resolveNameToAddress = async (ens: string) => {
    return await library.resolveName(ens);
  };

  const resolveAddressToName = useCallback(
    async (address: string) => {
      try {
        setLoading(true);
        const ensName = await library.lookupAddress(address);
        setENSName(ensName);
      } catch {
        //TODO
      } finally {
        setLoading(false);
      }
    },
    [library]
  );

  useEffect(() => {
    activate(network);

    if (initialAddress && ethers.utils.isAddress(initialAddress)) {
      resolveAddressToName(initialAddress);
    }
  }, [library, initialAddress, activate, resolveAddressToName]);

  return { ensName, loading, resolveNameToAddress, resolveAddressToName };
};

export default useENS;
