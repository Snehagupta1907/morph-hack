"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useDataContext } from "@/context/DataContext";
import { ethers } from "ethers";
import { MdOutlineSettings } from "react-icons/md";
import {
  RewardsSection,
  BalanceScore,
  LeaderBoardCard,
  SettingsCard,
  ExchangeComponent,
  ExploreBody,
  SelectedPost,
  CreatePollBody,
  HistoryBody,
} from "./_components/sidebar-body-components";
import {
  RewardHeader,
  ExploreHeader,
  SelectedPostHeader,
  CreatePollHeader,
  SettingsHeader,
  ExchangeHeader,
  AssetsHeader,
  LeaderboardHeader,
  HistoryHeader,
} from "./_components/sidebar-header-components";
import toast from "react-hot-toast";
import { ConnectButton2 } from "@/components/Header/ConnectButton";
import ChainDropdown from "@/components/ChainDropdown";
import LoadingBar from "@/components/LoadingBar";

interface PoolData {
  poolId: number;
  question: string;
  category: string;
  parameter: string;
  pollType: number;
  totalAmount: number;
  totalBets: number;
  finalScore: number;
  startTime: number;
  endTime: number;
  resultDeclareTime: number;
  poolEnded: boolean;
  bettingOpen: boolean;
}

const sidebarItems = [
  "Explore",
  "Create",
  "History",
  "Assets",
  // "Leaderboard",
  "Rewards",
  "Exchange",
];

const LaunchPage: React.FC = () => {
  const { address, chain } = useAccount();
  const {
    totalPools,
    tokenBalance,
    placeBet,
    mintNft,
    nftMintedAllReady,
    convertUSDetoBuzz,
    convertBuzztoUSDe,
  } = useDataContext();

  const [investment, setInvestment] = useState(0);
  const [scorePrediction, setScorePrediction] = useState(0);
  const [selected, setSelected] = useState("Explore");
  const [selectedPost, setSelectedPost] = useState<PoolData | null>(null);

  const [fromToken, setFromToken] = useState({
    symbol: "USDe",
    amount: 0, // Default value instead of tokenBalance.usdeBalance
  });
  const [toToken, setToToken] = useState({
    symbol: "BUZZ",
    amount: 0, // Default value instead of tokenBalance.buzzBalance
  });
  const [maxTokenBalances, setMaxTokenBalances] = useState({
    fromBalance: 0, // Default value instead of tokenBalance.usdeBalance
    toBalance: 0, // Default value instead of tokenBalance.buzzBalance
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [actionButtonText, setActionButtonText] = useState("Exchange");
  const [isTransacting, setIsTransacting] = useState(false);

  const handleSubmit = async () => {
    console.log(selectedPost, "selectedPost");
    if (selectedPost?.poolId === null || selectedPost?.poolId === undefined) return; //pool id can be zero 
    console.log(selectedPost.poolId, scorePrediction, investment);
    await placeBet(
      selectedPost.poolId,
      ethers.utils.parseEther(investment.toString()),
      scorePrediction
    );
  };

  const handleSwap = () => {
    setFromToken((prev) => ({
      symbol: prev.symbol === "USDe" ? "BUZZ" : "USDe",
      amount: 0,
    }));
    setToToken((prev) => ({
      symbol: prev.symbol === "BUZZ" ? "USDe" : "BUZZ",
      amount: 0,
    }));

    // Safely access tokenBalance values
    const safeUsdeBalance = tokenBalance?.usdeBalance || 0;
    const safeBuzzBalance = tokenBalance?.buzzBalance || 0;

    if (fromToken.symbol === "USDe") {
      setMaxTokenBalances({
        fromBalance: safeBuzzBalance,
        toBalance: safeUsdeBalance,
      });
    } else {
      setMaxTokenBalances({
        fromBalance: safeUsdeBalance,
        toBalance: safeBuzzBalance,
      });
    }
  };

  const handleAction = useCallback(async () => {
    if (!address || !fromToken.amount) {
      toast.error("Missing required information");
      return;
    }
    setIsTransacting(true);
    if (fromToken.symbol === "USDe") {
      console.log("converting USDe to Buzz");
      await convertUSDetoBuzz(fromToken.amount);
      setIsTransacting(false);
      setIsCalculating(false);
    } else {
      console.log("converting Buzz to USDe");
      await convertBuzztoUSDe(fromToken.amount);
      setIsTransacting(false);
      setIsCalculating(false);
    }
  }, [address, fromToken.amount]);

  const handleFromAmountChange = (e: any) => {
    setIsCalculating(true);
    if (fromToken.symbol === "USDe") {
      setFromToken((prev) => ({ ...prev, amount: +e.target.value }));
      setToToken((prev) => ({
        ...prev,
        amount: +e.target.value * 10,
      }));
      setIsCalculating(false);
    } else {
      setFromToken((prev) => ({ ...prev, amount: +e.target.value }));
      setToToken((prev) => ({
        ...prev,
        amount: +e.target.value / 10,
      }));
      setIsCalculating(false);
    }
  };

  const mintYourNft = async () => {
    await mintNft();
  };

  const handleMax = () => {
    const safeBuzzBalance = tokenBalance?.buzzBalance || 0;
    setInvestment(safeBuzzBalance);
  };

  return (
    <div className="flex items-center justify-center h-[100vh] bg-change-primary-bg orbitron-launch">
      <div className="w-[85%] h-[90%] shadow-lg rounded-lg flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-change-secondary-bg shadow-lg p-4 flex flex-col">
          <h1 className="text-2xl font-bold text-white"> 💰 BUZZIFY 💸</h1>
          <nav className="flex flex-col mt-6 space-y-3">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item}
                label={item}
                active={selected === item}
                onClick={() => {
                  setSelected(item);
                  setSelectedPost(null);
                }}
              />
            ))}
          </nav>
          {/* User Profile */}
          <div className="mt-2 flex flex-col p-0 gap-y-2 w-full">
            <div className="flex justify-between mt-2 w-full">
              <ConnectButton2 />
              <button onClick={() => setSelected("Settings")}>
                <MdOutlineSettings size={25} />
              </button>
            </div>
            <ChainDropdown />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="flex items-center bg-change-secondary-bg  opacity-90 shadow-lg px-4 py-3 justify-center">
            {selected === "Explore" && !selectedPost && (
              <>
                <ExploreHeader />
              </>
            )}
            {selected === "Explore" && selectedPost && (
              <>
                <SelectedPostHeader
                  selectedPost={selectedPost}
                  setSelectedPost={setSelectedPost}
                />
              </>
            )}
            {selected === "History" && (
              <>
                <HistoryHeader />
              </>
            )}
            {selected === "Create" && (
              <>
                <CreatePollHeader />
              </>
            )}
            {selected === "Settings" && (
              <>
                <SettingsHeader />
              </>
            )}
            {selected === "Exchange" && (
              <>
                <ExchangeHeader />
              </>
            )}
            {selected === "Assets" && (
              <>
                <AssetsHeader />
              </>
            )}
            {selected === "Leaderboard" && (
              <>
                <LeaderboardHeader />
              </>
            )}{" "}
            {selected === "Rewards" && (
              <>
                <RewardHeader />
              </>
            )}
          </header>

          {/* Content Section */}
          <div className="p-6 bg-change-secondary-bg shadow-lg h-full overflow-y-scroll scrollbar-thin">
            {selected === "Explore" && !selectedPost && (
              <>
                <ExploreBody
                  transformedPoolsData={totalPools}
                  setSelectedPost={setSelectedPost}
                  setSelected={setSelected}
                />
              </>
            )}
            {selected === "Settings" && <SettingsCard />}
            {selectedPost && (
              <>
                <SelectedPost
                  selectedPost={selectedPost}
                  investment={investment}
                  setInvestment={setInvestment}
                  scorePrediction={scorePrediction}
                  setScorePrediction={setScorePrediction}
                  handleSubmit={handleSubmit}
                  handleMax={handleMax}
                  tokenBalance={tokenBalance}
                />
              </>
            )}
            {selected === "Rewards" && (
              <RewardsSection
                onClick={mintYourNft}
                nftMintedAllReady={nftMintedAllReady}
              />
            )}

            {selected === "Assets" && (
              <>
                <div className="flex justify-center items-center flex-col">
                  <BalanceScore
                    setSelected={setSelected}
                    setSelectedPost={setSelectedPost}
                  />
                </div>
              </>
            )}
            {selected === "Exchange" && (
              <>
                <ExchangeComponent
                  fromToken={fromToken}
                  toToken={toToken}
                  isCalculating={isCalculating}
                  actionButtonText={actionButtonText}
                  isTransacting={isTransacting}
                  handleFromAmountChange={handleFromAmountChange}
                  handleSwap={handleSwap}
                  handleAction={handleAction}
                  maxTokenBalances={maxTokenBalances}
                />
              </>
            )}
            {selected === "Leaderboard" && <LeaderBoardCard />}
            {selected === "Create" && <CreatePollBody />}

            {selected === "History" && (
              <>
                <HistoryBody />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarItem: React.FC<{
  label: string;
  active?: boolean;
  onClick?: () => void;
}> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center p-2 rounded-lg ${active ? "bg-gray-200 text-black" : "hover:bg-gray-200 hover:text-black"}`}
  >
    <span className="ml-3 font-semibold">➡ {label}</span>
  </button>
);

export default LaunchPage;
