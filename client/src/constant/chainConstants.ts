import { http } from "viem";

const morphSepolia = {
  id: 2810,
  name: 'Morph Sepolia',
  network: "",
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc-quicknode-holesky.morphl2.io'],
    }, public: {
      http: ['https://rpc-quicknode-holesky.morphl2.io'],
    }
  },
  blockExplorers: {
    default: {
      name: 'Morph Testnet Explorer',
      url: 'https://explorer-holesky.morphl2.io',
      apiUrl: 'https://explorer-api-testnet.morphl2.io/api',
    },
  },
  testnet: true,
};
export const chainArray = [morphSepolia];
export const transportsObject = {
  [morphSepolia.id]: http(),
};
