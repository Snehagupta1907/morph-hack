import React, { useState, useEffect, ReactNode } from "react";
import { useAccount } from "wagmi";
import { useEthersSigner } from "@/utils/signer";
import { ethers, BigNumber, Contract } from "ethers";
import toast from "react-hot-toast";

/**
 * CONTRACT-ONLY REFACTORING COMPLETED:
 * 
 * ✅ REPLACED WITH CONTRACT CALLS:
 * - Market creation: No more API call after contract interaction
 * - Fetch all markets: Now fetches directly from smart contract
 * - Pool details: Already was contract-based
 * - User bets: Already was contract-based
 * 
 * ❌ STILL NEED API CALLS (cannot be replaced):
 * - AI question generation: External AI service
 * - Faucet service: Centralized token minting service
 * 
 * This makes the dApp more decentralized and reduces API dependencies.
 */
// Only keeping postWithHeaders for AI questions and getWithHeaders for faucet
// These cannot be replaced with contract calls as they are external services
import { postWithHeaders, getWithHeaders } from "@/config";
import {
  tokenAbi,
  mainContractABI,
  Addresses,
  nftContractAbi,
  conversionContractAbi,
} from "@/constant/index";
import { useChain } from "./ChainContext";

// Context types
interface DataContextProps {
  tokenBalance: {
    usdeBalance: number;
    buzzBalance: number;
  };
  getContractInstance: (
    contractAddress: string,
    contractAbi: any
  ) => Promise<Contract | undefined>;
  getTokenBalance: () => Promise<BigNumber | undefined>;
  createPool: (
    pollName: string,
    deadline: number,
    question: string,
    link: string,
    parameter: string,
    keyword: string,
    type: number,
    startDate: string,
    endDate: string,
    minRange: number,
    maxRange: number
  ) => Promise<void>;
  placeBet: (
    poolId: number,
    amount: BigNumber,
    targetScore: number
  ) => Promise<void>;
  claimBet: (poolId: number) => Promise<void>;
  getPoolsDetails: (forceRefresh?: boolean) => Promise<any>;
  totalPools: [] | undefined;
  userBetsData: [] | undefined;
  loading: boolean;
  setResultScore: (poolId: number, score: number) => Promise<void>;
  activePoolId: number;
  setActivePoolId: (id: number) => void;
  formatTimestamp: (timestamp: number) => string;
  mintNft: () => Promise<void>;
  nftMintedAllReady: boolean;
  convertUSDetoBuzz: (amount: number) => Promise<void>;
  convertBuzztoUSDe: (amount: number) => Promise<void>;
  getQuestionsFromAi: (
    metric: string,
    postId: string,
    username: string,
    predictionType: string
  ) => Promise<any | undefined>;
  dripTokens: () => Promise<void>;
}

interface DataContextProviderProps {
  children: ReactNode;
}

// Context initialization
const DataContext = React.createContext<DataContextProps | undefined>(
  undefined
);

const DataContextProvider: React.FC<DataContextProviderProps> = ({
  children,
}) => {
  const NFT_URI =
    "https://gateway.pinata.cloud/ipfs/bafkreifsghmurcvqcer5axfj4jaryfa42gxmqgqv3pkjl56g2k6bcigq4u/";
  const [tokenBalance, setTokenBalance] = useState<BigNumber | undefined>({
    usdeBalance: 0,
    buzzBalance: 0,
  });
  const { address } = useAccount();
  const [totalPools, setTotalPools] = useState<{}>({});
  const [userBetsData, setUserBetsData] = useState(null);
  const [nftMintedAllReady, setNftMintedAllReady] = useState(false);
  const { chainDetail } = useChain();
  const [activeChain, setActiveChainId] = useState<number | undefined>(
    52085143
  );
  const [loading, setLoading] = useState(false);
  const [activePoolId, setActivePoolId] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    setActiveChainId(chainDetail?.id);
  }, [chainDetail?.id]);

  const signer = useEthersSigner({ chainId: activeChain });

  const getContractInstance = async (
    contractAddress: string,
    contractAbi: any
  ): Promise<Contract | undefined> => {
    try {
      const contractInstance = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );
      return contractInstance;
    } catch (error) {
      console.log("Error in deploying contract");
      return undefined;
    }
  };

  const getTokenBalance = async () => {
    try {
      const buzzTokenContract = await getContractInstance(
        Addresses[activeChain]?.tokenAddress,
        tokenAbi
      );
      const usdeTokenContract = await getContractInstance(
        Addresses[activeChain]?.usdeAddress,
        tokenAbi
      );
      if (buzzTokenContract || usdeTokenContract) {
        let buzzTokenBalance = await buzzTokenContract?.balanceOf(address);
        let usdeTokenBalance = await usdeTokenContract?.balanceOf(address);
        setTokenBalance({
          usdeBalance: +usdeTokenBalance
            .div(BigNumber.from(10).pow(18))
            .toString(),
          buzzBalance: +buzzTokenBalance
            .div(BigNumber.from(10).pow(18))
            .toString(),
        });
        return tokenBalance;
      }
    } catch (error) {
      console.log("Error in getting token balance");
      return BigNumber.from(0);
    }
  };

  const convertUSDetoBuzz = async (amount: any) => {
    let id = toast.loading("Converting USDe to BUZZ...");
    try {
      amount = ethers.utils.parseEther(amount.toString());
      const conversionContract = await getContractInstance(
        Addresses[activeChain]?.conversionAddress,
        conversionContractAbi
      );

      const tokenContract = await getContractInstance(
        Addresses[activeChain]?.usdeAddress,
        tokenAbi
      );

      if (tokenContract) {
        const allowance = await tokenContract.allowance(
          address,
          Addresses[activeChain]?.conversionAddress
        );
        if (allowance.lt(amount)) {
          const tx = await tokenContract.approve(
            Addresses[activeChain]?.conversionAddress,
            amount
          );
          await tx.wait();
        }
      }
      if (conversionContract) {
        await conversionContract.convertUSDetoBuzz(amount);
        await getTokenBalance();
        toast.success("USDe converted to BUZZ successfully", { id });
        return;
      }
    } catch (error) {
      console.log("Error in converting USDe to BUZZ", error);
      toast.error("Error in converting USDe to BUZZ", { id });
    }
  };

  const convertBuzztoUSDe = async (amount: any) => {
    let id = toast.loading("Converting BUZZ to USDe...");
    try {
      amount = ethers.utils.parseEther(amount.toString());
      const conversionContract = await getContractInstance(
        Addresses[activeChain]?.conversionAddress,
        conversionContractAbi
      );

      const tokenContract = await getContractInstance(
        Addresses[activeChain]?.tokenAddress,
        tokenAbi
      );

      if (tokenContract) {
        const allowance = await tokenContract.allowance(
          address,
          Addresses[activeChain]?.conversionAddress
        );
        if (allowance.lt(amount)) {
          const tx = await tokenContract.approve(
            Addresses[activeChain]?.conversionAddress,
            amount
          );
          await tx.wait();
        }
      }
      if (conversionContract) {
        await conversionContract.convertBuzztoUSDe(amount);
        toast.success("BUZZ converted to USDe successfully", { id });
        await getTokenBalance();
        return;
      }
    } catch (error) {
      console.log("Error in converting BUZZ to USDe", error);
      toast.error("Error in converting BUZZ to USDe", { id });
    }
  };

  const mintNft = async () => {
    let id = toast.loading("Minting NFT...");
    try {
      const nftContract = await getContractInstance(
        Addresses[activeChain]?.nftContractAddress,
        nftContractAbi
      );
      if (nftContract) {
        let balance = await nftContract.balanceOf(address);
        if (balance.toNumber() >= 1) {
          toast.error("You already have an NFT", { id });
          return;
        }
        const tx = await nftContract.mintNFT(address, NFT_URI);
        await tx.wait();
        toast.success("NFT minted successfully", { id });
        await isNftMinted();
      }
      return;
    } catch (error) {
      toast.error("Error in minting NFT", { id });
      return;
    }
  };

  // CONTRACT-ONLY: Creates pool directly on smart contract
  const createPool = async (
    pollName: string,
    deadline: number,
    question: string,
    link: string,
    media: string,
    metric: string,
    type: number,
    startTime: string,
    endTime: string,
    minRange: number,
    maxRange: number
  ) => {
    let id = toast.loading("Creating pool...");
    try {
      const mainContract = await getContractInstance(
        Addresses[activeChain]?.mainContractAddress,
        mainContractABI
      );
      if (mainContract) {
        const tx = await mainContract.createPool(
          pollName,        // _poolName
          link,            // _url  
          media,           // _parameter
          metric,          // _category
          type,            // _polltype
          deadline,        // _endTime
          {
            from: address,
            value: BigNumber.from(ethers.utils.parseUnits("100", "wei")),
          }
        );

        await tx.wait();

        // Pool created successfully on contract - no need for API call
        console.log("Pool created on contract with hash:", tx?.hash);

        await getPoolsDetails();
        toast.success("Pool created successfully", { id });
      }
      return;
    } catch (error) {
      console.log("Error in creating pool", error);
      toast.error("Error in creating pool", { id });
      return;
    }
  };

  // CONTRACT-ONLY: Fetches all markets from smart contract
  const fetchAllMarkets = async () => {
    try {
      console.log("Fetching markets from contract...");
      // This function now just calls getPoolsDetails which fetches from contract
      await getPoolsDetails();
    } catch (error) {
      console.log("Error fetching markets from contract:", error);
    }
  };
  const placeBet = async (
    poolId: number,
    amount: BigNumber,
    predictScore: number
  ) => {
    let id = await toast.loading("Placing bet...");
    try {
      console.log("Placing bet with params:", { poolId, amount, predictScore, activeChain });
      console.log("Contract address:", Addresses[activeChain]?.mainContractAddress);
      console.log("Token balance:", tokenBalance?.buzzBalance);
      console.log("Amount to bet:", amount.toString());
      console.log("Amount in BUZZ:", ethers.utils.formatEther(amount));
      console.log("Balance check:", tokenBalance?.buzzBalance < parseFloat(ethers.utils.formatEther(amount)));
      
      // Check if user has sufficient balance
      if (!tokenBalance?.buzzBalance || tokenBalance.buzzBalance < parseFloat(ethers.utils.formatEther(amount))) {
        throw new Error("Insufficient BUZZ balance");
      }
      
      const mainContract = await getContractInstance(
        Addresses[activeChain]?.mainContractAddress,
        mainContractABI
      );
      
      if (!mainContract) {
        throw new Error("Failed to get main contract instance");
      }
      
      console.log("Main contract instance:", mainContract);
      
      const parsedAmount =amount;
      console.log("Parsed amount:", parsedAmount.toString());
      
      const tokenContract = await getContractInstance(
        Addresses[activeChain]?.tokenAddress,
        tokenAbi
      );

      if (tokenContract) {
        const allowance = await tokenContract.allowance(
          address,
          Addresses[activeChain]?.mainContractAddress
        );
        console.log("Current allowance:", allowance.toString());
        console.log("Required amount:", parsedAmount.toString());
        
        if (allowance.lt(parsedAmount)) {
          console.log("Approving tokens...");
          const tx = await tokenContract.approve(
            Addresses[activeChain]?.mainContractAddress,
            parsedAmount
          );
          await tx.wait();
          console.log("Approval successful");
        } else {
          console.log("Sufficient allowance already exists");
        }
      }

      console.log("Calling placeBet on contract...");
      const tx = await mainContract.placeBet(parsedAmount, predictScore, poolId);
      console.log("Transaction sent:", tx.hash);
      
      await tx.wait();
      console.log("Transaction confirmed");
      
      await getPoolsDetails();
      await getTokenBalance(); // Refresh token balance after bet
      toast.success("Bet placed successfully", { id });
      return;
    } catch (error) {
      console.error("Error in placing bet:", error);
      toast.error(`Error in placing bet: ${error.message}`, { id });
      return;
    }
  };

  const claimBet = async (poolId: number) => {
    let id = await toast.loading("Claiming bet...");
    try {
      const mainContract = await getContractInstance(
        Addresses[activeChain]?.mainContractAddress,
        mainContractABI
      );

      if (mainContract) {
        const tx = await mainContract.claimBet(poolId);
        await tx.wait();
        await getPoolsDetails();
        toast.success("Bet claimed successfully", { id });
      }
      return;
    } catch (error) {
      toast.error("Error in claiming bet", { id });
      return;
    }
  };

  const setResultScore = async (poolId: number, finalScore: number) => {
    let id = await toast.loading("Setting result...");
    try {
      const mainContract = await getContractInstance(
        Addresses[activeChain]?.mainContractAddress,
        mainContractABI
      );

      if (mainContract) {
        const tx = await mainContract.setResult(poolId, finalScore);
        await tx.wait();
        toast.success("Result set successfully", { id });
        await getPoolsDetails();
      }
      return;
    } catch (error) {
      toast.error("Error in setting result", { id });
      return;
    }
  };

  // API-REQUIRED: Faucet service - cannot be replaced with contract call
  // This is a centralized service that mints tokens to users
  const dripTokens = async () => {
    const id = toast.loading("Dripping Tokens ...");
    try {
      if (!activeChain) {
        return;
      }
      let data = await getWithHeaders(
        `/api/faucet/drip-Tokens?receiver=${address}&rpc_url=${Addresses[activeChain]?.rpc_url}&tokenAddress=${Addresses[activeChain]?.tokenAddress}`,
        {
          "x-user-address": address,
        }
      );
      await getTokenBalance();
      toast.success(data?.data?.message, { id });
      return data?.data?.message;
    } catch (error) {
      console.log("Error", error);
      toast.error("Error in dripping", { id });
    }
  };

  const getPoolsDetails = async (forceRefresh?: boolean) => {
    let poolDetails = {
      pool_data: {
        pools: [] as any,
      } as any,
    };
    setLoading(true);

    try {
      const mainContract = await getContractInstance(
        Addresses[activeChain]?.mainContractAddress,
        mainContractABI
      );

      let maxPoolId = await mainContract?.getPoolId();

      let userBets = [] as any;
              if (mainContract) {
          for (let i = 0; i < maxPoolId; i++) {
            const pool = await mainContract.pools(i);
            const poolStatus = await mainContract.getPoolStatus(i);
            console.log("Pool status:", poolStatus,i);
          
          // Debug logging
          console.log(`Pool ${i} status:`, {
            poolEnded: pool.poolEnded,
            poolStatusPoolEnded: poolStatus.poolEnded,
            bettingOpen: poolStatus.bettingOpen,
            endTime: +pool.endTime.toString(),
            currentTime: +poolStatus.currentTime.toString(),
            timeUntilEnd: +poolStatus.timeUntilEnd.toString()
          });
          
          let poolObj = {
            poolId: i,
            question: pool.question,
            url: pool.url,
            parameter: pool.parameter,
            category: pool.category,
            poll_type: pool.poll_type,
            total_amount: +pool.total_amount
              .div(BigNumber.from(10).pow(18))
              .toString(),
            total_bets: +pool.total_bets.toString(),
            finalScore: +pool.finalScore.toString(),
            startTime: +pool.startTime.toString(),
            endTime: +pool.endTime.toString(),
            poolEnded: poolStatus.poolEnded, // Use updated status from getPoolStatus
            bettingOpen: poolStatus.bettingOpen,
          };
          
          console.log(`Pool ${i} object:`, {
            poolId: poolObj.poolId,
            poolEnded: poolObj.poolEnded,
            bettingOpen: poolObj.bettingOpen
          });
          poolDetails.pool_data.pools.push(poolObj);
          let bets = await mainContract.getBets(i);
          console.log("Bets:", bets);

          let poolBets = [];
          for (let y = 0; y < bets.length; y++) {
            // Get the actual claim status from getUserBetStatus (the correct source)
            const userBetStatus = await mainContract.getUserBetStatus(i, bets[y].user);
            
            let betObj = {
              poolId: i,
              user: bets[y].user,
              amount: +bets[y].amount
                .div(BigNumber.from(10).pow(18))
                .toString(),
              targetScore: +bets[y].targetScore.toString(),
              claimedAmount: +userBetStatus.claimedAmount.toString(), // Use from getUserBetStatus
              claimed: userBetStatus.claimed, // Use from getUserBetStatus
              status: poolStatus.poolEnded,
            };
            if (bets[y].user == address) {
              userBets.push(betObj);
            }
            poolBets.push(betObj);
          }
          await setUserBetsData(userBets);
          poolDetails.pool_data.pools[i].bets = poolBets;
        }

        console.log("Setting total pools:", poolDetails?.pool_data?.pools);
        console.log("Final pool data to be set:", poolDetails?.pool_data?.pools.map(p => ({ poolId: p.poolId, poolEnded: p.poolEnded, bettingOpen: p.bettingOpen })));
        setTotalPools(poolDetails?.pool_data?.pools);
        setLoading(false);
        
        // Force a re-render by updating a timestamp
        setLastUpdate(Date.now());
        
        return poolDetails;
      }
    } catch (error) {
      console.log(error, "Error in getting pool detail");
      setLoading(false);
      return poolDetails;
    }
  };

  // API-REQUIRED: AI question generation - cannot be replaced with contract call
  // This is an external AI service that generates prediction questions
  const getQuestionsFromAi = async (
    metric: string,
    postId: string,
    username: string,
    predictionType: string
  ) => {
    let id = toast.loading("Hey I'm Trix Generating Questions For You  ...");
    try {
      let data = await postWithHeaders(
        "/api/prediction-question",
        {
          metric,
          postId,
          username,
          predictionType,
        },
        {
          "x-user-address": address,
        }
      );
      console.log(data, "data");
      toast.success("Here are your questions ", { id });
      return data?.data;
    } catch (error) {
      toast.error("Failed to Form Questions", { id });
      console.log(error);
    }
  };

  const isNftMinted = async () => {
    try {
      const nftContract = await getContractInstance(
        Addresses[activeChain]?.nftContractAddress,
        nftContractAbi
      );

      if (nftContract) {
        let balance = await nftContract.balanceOf(address);
        if (balance.toNumber() >= 1) {
          setNftMintedAllReady(true);
        }
      }
    } catch (error) {
      console.log("Error in getting nft minted");
    }
  };
  useEffect(() => {
    if (!signer) return;
    getTokenBalance();
    getPoolsDetails();
    isNftMinted();
    fetchAllMarkets();
  }, [signer, activeChain]);

  function formatTimestamp(timestamp: number) {
    const date = new Date(timestamp * 1000); // Convert to milliseconds
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  }

  return (
    <DataContext.Provider
      value={{
        tokenBalance,
        getContractInstance,
        getTokenBalance,
        createPool,
        placeBet,
        claimBet,
        getPoolsDetails,
        totalPools,
        userBetsData,
        loading,
        setResultScore,
        activePoolId,
        setActivePoolId,
        formatTimestamp,
        mintNft,
        nftMintedAllReady,
        convertUSDetoBuzz,
        convertBuzztoUSDe,
        getQuestionsFromAi,
        dripTokens,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = React.useContext(DataContext);
  if (context === undefined) {
    throw new Error("useDataContext must be used within a DataContextProvider");
  }
  return context;
};

export default DataContextProvider;
