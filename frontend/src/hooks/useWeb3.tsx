import { createWeb3Modal, useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useChainId, useDisconnect } from 'wagmi';
import { wagmiConfig, WALLET_CONNECT_PROJECT_ID } from '../utils/wagmi';
import { useCallback } from 'react';

createWeb3Modal({
  wagmiConfig: wagmiConfig,
  projectId: WALLET_CONNECT_PROJECT_ID,
  themeVariables: {
    '--w3m-font-family': 'Inter',
  },
});

export const useWeb3 = () => {
  const { isConnected, status, address } = useAccount();
  const chainId = useChainId()
  const { disconnect } = useDisconnect()
  const { open } = useWeb3Modal();

  const connectWallet = useCallback(() => {
    if (!isConnected) {
      open();
    }
  },[isConnected, open])

  const disconnectWallet = useCallback(() => {
    if (isConnected) {
      disconnect();
    }
  },[isConnected, disconnect])

  return { connectWallet, disconnectWallet, status, address, chainId, isConnected}
};