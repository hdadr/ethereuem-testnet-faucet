import { createWeb3ReactRoot } from '@web3-react/core';

const Web3ReactProviderDefault = createWeb3ReactRoot("ensProvider");

const Web3providerWithNoSSR = ({ children, getLibrary }) => {
  return <Web3ReactProviderDefault getLibrary={getLibrary}>{children}</Web3ReactProviderDefault>;
};

export default Web3providerWithNoSSR;
