// context/ChainContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";

interface Network {
  id: number;
  name: string;
  iconUrl: string;
  nativeCurrency: NativeCurrency;
  rpcUrls: RpcUrls;
  blockExplorers: BlockExplorers;
}

interface NativeCurrency {
  name: string;
  symbol: string;
  decimals: number;
}

interface RpcUrls {
  default: DefaultRpcUrls;
}

interface DefaultRpcUrls {
  http: string[];
}

interface BlockExplorers {
  default: DefaultBlockExplorer;
}

interface DefaultBlockExplorer {
  name: string;
  url: string;
}
interface ChainContextProps {
  chainDetail: Network | null;
  setChainDetail: (chain: Network) => void;
}

const ChainContext = createContext<ChainContextProps | undefined>(undefined);

export const ChainProvider = ({ children }: { children: ReactNode }) => {
  const [chainDetail, setChainDetail] = useState<Network | null>(null);

  return (
    <ChainContext.Provider value={{ chainDetail, setChainDetail }}>
      {children}
    </ChainContext.Provider>
  );
};

export const useChain = (): ChainContextProps => {
  const context = useContext(ChainContext);
  if (!context) {
    throw new Error("useChain must be used within a ChainProvider");
  }
  return context;
};
