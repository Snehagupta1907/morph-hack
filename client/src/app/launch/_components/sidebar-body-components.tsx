import LoadingBar from "@/components/LoadingBar";
import PostComponent from "./post_component";
import { CgDollar } from "react-icons/cg";
import { FaUserAlt } from "react-icons/fa";
import { RiRadioButtonLine } from "react-icons/ri";
import { useDataContext } from "@/context/DataContext";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { LuArrowUpDown } from "react-icons/lu";
import Link from "next/link";
import { IoInformationCircleOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import toast from "react-hot-toast";
import { XEmbed } from "react-social-media-embed";
import BetsGraph from "@/components/explore/BetsGraph";
import { FaCoins } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import numeral from "numeral";
interface RewardsSectionProps {
  onClick: () => void;
  nftMintedAllReady: boolean;
}
interface Token {
  amount: number;
  symbol: string;
}
interface ExchangeComponentProps {
  fromToken: Token;
  toToken: Token;
  handleFromAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSwap: () => void;
  isCalculating: boolean;
  isTransacting: boolean;
  actionButtonText: string;
  handleAction: () => void;
  maxTokenBalances: any;
}

const RewardsSection: React.FC<RewardsSectionProps> = ({
  onClick,
  nftMintedAllReady,
}) => {
  const { dripTokens } = useDataContext();
  const handleDrip = async () => {
    await dripTokens();
  };
  return (
    <div className="flex w-full flex-col items-center bg-change-secondary-bg  p-6 rounded text-white">
      <div className="w-1/2 p-2 rounded flex flex-col">
        <ol className="relative border-s border-gray-500 dark:border-gray-700">
          <li className="mb-10 ms-4">
            <div className="absolute w-3 h-3 bg-gray-400 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>

            <h3 className="text-lg font-semibold text-gray-200 dark:text-white">
              {nftMintedAllReady ? "Your NFT is minted" : "Mint Your NFT"}
            </h3>
            {nftMintedAllReady ? (
              <div className="mt-3">
                <img
                  src="https://gateway.pinata.cloud/ipfs/bafybeidubittp6kbuu2cc2yfnhrspqke23gec5jvczzjjs23dhtpvpj3tm/"
                  alt="Kendrick Lamar Performance"
                  className="w-full rounded-lg object-cover"
                />
              </div>
            ) : (
              <button
                onClick={onClick}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-black text-white font-medium py-2 rounded-md"
              >
                <span>Mint</span>
                <span>Buzzify NFT</span>
              </button>
            )}
          </li>
          <li className="mb-10 ms-4">
            <div className="absolute w-3 h-3 bg-gray-400 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>

            <h3 className="text-lg font-semibold text-gray-200 dark:text-white">
              Make one prediction claim 100 BUZZ Tokens
            </h3>
            <button
              onClick={handleDrip}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-black text-white font-medium py-2 rounded-md"
            >
              <span>Claim</span>
              <span>200 BUZZ</span>
            </button>
          </li>
          {/* <li className="ms-4">
            <div className="absolute w-3 h-3 bg-gray-400 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
            <h3 className="text-lg font-semibold text-gray-200 dark:text-white">
              Create one prediction claim 100 BUZZ Tokens
            </h3>
            <button className="w-full mt-4 flex items-center justify-center gap-2 bg-black text-white font-medium py-2 rounded-md">
              <span>Claim</span>
              <span>100 BUZZ</span>
            </button>
          </li> */}
        </ol>
      </div>
    </div>
  );
};

interface BalanceScoreProps {
  setSelected: (selected: string) => void;
  setSelectedPost: (selectedPost: any) => void;
}

const BalanceScore: React.FC<BalanceScoreProps> = ({
  setSelected,
  setSelectedPost,
}) => {
  return (
    <>
      <div className="flex w-full flex-col items-center bg-change-secondary-bg  p-6 rounded text-white">
        <div className="w-full max-w-xl">
          <h2 className="text-lg font-semibold mb-4 ">Balance</h2>
          <div className="bg-amber-50 p-4 rounded-md mb-6 text-black">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <img
                  src="https://s2.coinmarketcap.com/static/img/coins/64x64/30171.png"
                  alt="BNB"
                  className="w-6 h-6 mr-2"
                />
                <span>ETH</span>
              </div>
              <div className="text-right">
                <p className="font-semibold">0 ETH</p>
                <p className="text-sm text-gray-500">0.00 USD</p>
              </div>
            </div>
            <div className="flex justify-between items-center mb-2 ">
              <div className="flex items-center">
                <img
                  src="https://s2.coinmarketcap.com/static/img/coins/64x64/30171.png"
                  alt="MNT"
                  className="w-6 h-6 mr-2"
                />
                <span>ETHENA</span>
              </div>
              <div className="text-right">
                <p className="font-semibold">0 sUSDE</p>
                <p className="text-sm text-gray-500">0.00 USD</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <img
                  src="https://s2.coinmarketcap.com/static/img/coins/64x64/30171.png"
                  alt="ETH"
                  className="w-6 h-6 mr-2"
                />
                <span>USDC</span>
              </div>
              <div className="text-right">
                <p className="font-semibold">0 USDC</p>
                <p className="text-sm text-gray-500">0.00 USD</p>
              </div>
            </div>
          </div>
          <button className="w-full py-2 text-[#4A82ED] font-semibold underline mb-8">
            Cash out my balance →
          </button>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">My Score</h2>
            <button
              onClick={() => {
                setSelected("History");
                setSelectedPost(null);
              }}
              className="text-sm text-[#4A82ED]"
            >
              History
            </button>
          </div>

          <div className="bg-gray-100 p-4 text-black rounded-md mb-2 flex justify-between items-center">
            <div className="flex items-center">
              <img
                src="https://s2.coinmarketcap.com/static/img/coins/64x64/30171.png"
                alt="abCHIPS"
                className="w-6 h-6 mr-2"
              />
              <span>BuzzChips</span>
            </div>
            <span className="font-semibold">140.0000</span>
          </div>

          <div className="bg-gray-100 p-4 text-black rounded-md mb-2 flex justify-between items-center">
            <div className="flex items-center">
              <img
                src="https://s2.coinmarketcap.com/static/img/coins/64x64/30171.png"
                alt="Alpha"
                className="w-6 h-6 mr-2"
              />
              <span>Alpha</span>
            </div>
            <span className="font-semibold">0.0000</span>
          </div>

          <div className="bg-gray-100 p-4 text-black rounded-md flex justify-between items-center">
            <div className="flex items-center">
              <img
                src="https://s2.coinmarketcap.com/static/img/coins/64x64/30171.png"
                alt="Beta"
                className="w-6 h-6 mr-2"
              />
              <span>Beta</span>
            </div>
            <span className="font-semibold">0.0000</span>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Missing some rewards?{" "}
            <a href="#" className="text-[#4A82ED] font-semibold">
              Click to claim them!
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

const LeaderBoardCard: React.FC = () => {
  return (
    <div className="flex w-full flex-col items-center bg-change-secondary-bg p-6 rounded text-black">
      <div className="leaderboard-main">
        <div id="leaderboard">
          <div className="leaderboard-ribbon"></div>
          <table className="text-xl">
            <tr>
              <td className="leaderboard-number">1</td>
              <td className="leaderboard-name">Lee Taeyong</td>
              <td className="leaderboard-points">
                258.244{" "}
                <img
                  className="leaderboard-gold-medal"
                  src="https://github.com/malunaridev/Challenges-iCodeThis/blob/master/4-leaderboard/assets/gold-medal.png?raw=true"
                  alt="gold medal"
                />
              </td>
            </tr>
            <tr>
              <td className="leaderboard-number">2</td>
              <td className="leaderboard-name">Mark Lee</td>
              <td className="leaderboard-points">258.242 XP</td>
            </tr>
            <tr>
              <td className="leaderboard-number">2</td>
              <td className="leaderboard-name">Mark Lee</td>
              <td className="leaderboard-points">258.242 XP</td>
            </tr>
            <tr>
              <td className="leaderboard-number">2</td>
              <td className="leaderboard-name">Mark Lee</td>
              <td className="leaderboard-points">258.242 XP</td>
            </tr>
            <tr>
              <td className="leaderboard-number">2</td>
              <td className="leaderboard-name">Mark Lee</td>
              <td className="leaderboard-points">258.242 XP</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
};

function SettingsCard() {
  return (
    <div className="flex w-full flex-col items-center bg-change-secondary-bg  p-6 rounded text-black">
      <div className="w-1/2 p-5 bg-[#F5F3ED]">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Twitter Account
        </h2>
        <button className="w-full flex items-center justify-center gap-2 bg-black text-white font-medium py-2 rounded-md">
          <span>Link</span>
          <span className="text-xl">𝕏</span> {/* X logo */}
          <span>Account</span>
        </button>

        <hr className="my-4 border-gray-400" />

        <h2 className="text-lg font-semibold text-gray-700 mb-2">Email</h2>
        <button className="w-full border border-black text-black font-medium py-2 rounded-md hover:bg-gray-100">
          Verify Email
        </button>

        <hr className="my-4 border-gray-400" />

        <div className="flex justify-end">
          <button className="flex items-center gap-2 text-black font-medium hover:underline">
            <span>↪</span> Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

function ExchangeComponent({
  fromToken,
  toToken,
  handleFromAmountChange,
  handleSwap,
  isCalculating,
  isTransacting,
  actionButtonText,
  handleAction,
  maxTokenBalances,
}: ExchangeComponentProps) {
  return (
    <div className="flex justify-center items-center flex-col">
      <div className="bg-change-trinary-bg w-1/2 rounded-lg p-4 py-8 mt-10">
        <h2 className="text-sm font-semibold mb-4 text-white">Quick Actions</h2>
        <div className="rounded-lg p-4">
          {/* From Input */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white">From</span>
              <span className="text-white">
                Balance: {maxTokenBalances?.fromBalance} {fromToken.symbol}
              </span>
            </div>
            <div className="flex items-center bg-change-secondary-bg  rounded-md p-3">
              <input
                type="number"
                value={fromToken.amount}
                onChange={handleFromAmountChange}
                className="w-full bg-transparent text-white outline-none text-sm"
                placeholder="0.00"
                disabled={isTransacting}
              />
              <button className="text-xs text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium px-2 py-1 rounded transition-colors">
                MAX
              </button>
              <span className="text-white ml-2">{fromToken.symbol}</span>
            </div>
          </div>

          <button
            onClick={handleSwap}
            className="w-full flex justify-center p-2 text-white hover:text-[var(--primary)]"
          >
            <LuArrowUpDown size={20} />
          </button>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white">To (Estimated)</span>
              <span className="text-white">
                Balance: {maxTokenBalances?.toBalance} {toToken.symbol}
              </span>
            </div>
            <div className="flex items-center bg-change-secondary-bg rounded-lg p-3">
              <input
                type="text"
                value={isCalculating ? "Calculating..." : toToken.amount}
                readOnly
                className="w-full bg-transparent text-white outline-none text-sm"
                placeholder="0.00"
              />
              <span className="text-white ml-2">{toToken.symbol}</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleAction}
            disabled={!fromToken.amount || isCalculating || isTransacting}
            className="w-full py-3 bg-change-secondary-bg mt-4 text-white rounded-lg font-medium 
transition-colors "
          >
            {isTransacting ? "Processing..." : actionButtonText}
          </button>
        </div>
      </div>

      <button className="w-full py-2 text-[#4A82ED] font-semibold underline mt-4">
        <Link href="https://faucet.ethena.fi/" target="_blank">
          {" "}
          Need USDe Faucet ? →
        </Link>
      </button>
    </div>
  );
}

function ExploreBody({ transformedPoolsData, setSelectedPost, setSelected }: any) {
  const { getPoolsDetails } = useDataContext();
  
  const handleRefresh = async () => {
    await getPoolsDetails(true);
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Prediction Pools</h2>
        <button
          onClick={handleRefresh}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
        >
          🔄 Refresh Pools
        </button>
      </div>
      
      {transformedPoolsData.length ? (
        <div className="grid grid-cols-2 gap-4">
          {transformedPoolsData.map((item: any, i: any) => (
            <PostComponent
              item={item}
              key={i}
              onSelect={() => setSelectedPost(item)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Pools Available</h3>
          <p className="text-gray-400 mb-6 max-w-md">
            There are currently no prediction pools available. Be the first to create one!
          </p>
        </div>
      )}
    </>
  );
}

function SelectedPost({
  selectedPost,
  setScorePrediction,
  scorePrediction,
  investment,
  setInvestment,
  tokenBalance,
  handleSubmit,
  handleMax,
}: any) {
  const { formatTimestamp, userBetsData, totalPools } = useDataContext();
  const [isBetted, setIsBetted] = useState(false);
  const [betPosition, setBetPosition] = useState<'yes' | 'no' | null>(null);
  const { address } = useAccount();
  console.log(selectedPost);
  useEffect(() => {
    const val =
      userBetsData &&
      userBetsData?.find((item) => item?.poolId === selectedPost?.poolId);
    if (val) {
      setIsBetted(true);
    } else {
      setIsBetted(false);
    }
  }, [userBetsData]);

  // Reset bet position when switching between polls
  useEffect(() => {
    setBetPosition(null);
  }, [selectedPost?.poolId]);

  const handleBetPositionSelect = (position: 'yes' | 'no') => {
    setBetPosition(position);
    // For binary polls, set the score prediction based on position
    if (selectedPost.poll_type === 0) {
      setScorePrediction(position === 'yes' ? 1 : 0);
    }
  };

  return (
    <>
      {selectedPost?.question ? (
        <div className="flex w-full gap-x-8 bg-change-secondary-bg  p-6 rounded text-white">
          <div className="w-[55%] overflow-y-scroll scrollbar-thin">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={`https://effigy.im/a/${address}.svg`}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-semibold text-gray-200">
                  Annonymous #{selectedPost?.poolId}
                </span>
                <span className="text-blue-500">💎</span>
              </div>
              <div className="flex items-center gap-1 text-gray-200">
                <CgDollar size={18} />
                <span className="text-sm font-medium">
                  {selectedPost?.total_amount}
                </span>
                <FaUserAlt size={16} className="ml-2" />
                <span className="text-sm">{selectedPost?.total_bets}</span>
                <span className="flex items-center gap-1 ml-2">
                  {selectedPost?.poolEnded ? (
                    <>
                      <RiRadioButtonLine className="text-red text-xs" />
                      <span>ENDED</span>
                    </>
                  ) : (
                    <>
                      <RiRadioButtonLine className="text-green-500 text-xs" />
                      <span>ONGOING</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Post Content */}
            <div className="mt-3">
              <h2 className="font-bold text-lg text-white">
                {selectedPost?.question}
              </h2>
              <div className="text-gray-300 text-sm mt-4">
                <XEmbed
                  style={{ borderRadius: "none" }}
                  url={selectedPost?.url}
                  width="100%"
                />
              </div>
            </div>

            {/* Hashtags */}
            <div className="mt-2 text-blue-500 text-md font-medium">
              <span># {selectedPost?.category}</span>{" "}
              <span># {selectedPost?.parameter}</span>
            </div>
          </div>
          <div className="bg-change-trinary-bg w-[45%] flex flex-col rounded py-6 px-2 h-1/2 mt-3">
            <div className="bg-change-trinary-bg w-full rounded py-6 px-2 h-1/2 mt-3">
              <div className="flex items-center justify-between px-4 mb-2">
                <h2 className="text-sm font-semibold text-white">
                  Place Your Bet
                </h2>
                {!selectedPost?.bettingOpen && (
                  <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-md">
                    BETTING CLOSED
                  </span>
                )}
              </div>
              <div className="rounded-lg p-4">
                {/* From Input */}

                <div className=" flex px-4 flex-col-reverse bg-change-secondary-bg rounded-sm p-4 items-start gap-2">
                  {selectedPost.poll_type === 0 ? (
                    <>
                      <label className="text-gray-200 text-xs mb-2">
                        Select Your Prediction
                      </label>
                      <div className="grid grid-cols-2 gap-2 w-full">
                        <button
                          className={`px-4 py-2 rounded-md transition-colors ${
                            betPosition === 'yes' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-[#1B1B1A] hover:bg-blue-400 text-white'
                          }`}
                          onClick={() => handleBetPositionSelect('yes')}
                        >
                          Yes
                        </button>
                        <button
                          className={`px-4 py-2 rounded-md transition-colors ${
                            betPosition === 'no' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-[#1B1B1A] hover:bg-blue-400 text-white'
                          }`}
                          onClick={() => handleBetPositionSelect('no')}
                        >
                          No
                        </button>
                      </div>
                      {!betPosition && (
                        <p className="text-red-400 text-xs mt-2">
                          Please select Yes or No to place your bet
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <label className="text-gray-200 text-xs">
                        Score Prediction
                      </label>
                      <input
                        type="number"
                        value={scorePrediction}
                        onChange={(e) => setScorePrediction(e.target.value)}
                        className="w-full bg-transparent text-white outline-none text-sm"
                        placeholder="Guess the Number"
                      />
                    </>
                  )}
                </div>
                <div className="mb-4 mt-4">
                  <label className="text-gray-200 text-xs mb-2">
                    Bet Amount (BUZZ)
                  </label>
                  <div className="flex items-center bg-change-secondary-bg rounded-lg p-3">
                    <input
                      type="number"
                      value={investment}
                      onChange={(e) => setInvestment(e.target.value)}
                      className="w-full bg-transparent text-white outline-none text-sm"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                    <button
                      onClick={handleMax}
                      className="text-xs hover:text-blue-400 font-medium px-2 text-white py-1 rounded transition-colors"
                    >
                      MAX
                    </button>
                    <span className="text-white ml-2 text-xs">BUZZ</span>
                  </div>
                  {(!investment || investment <= 0) && (
                    <p className="text-red-400 text-xs mt-2">
                      Please enter a valid bet amount
                    </p>
                  )}

                  <div className="bg-transparent rounded-xl p-5 shadow-lg w-full max-w-md">
                    <h2 className="text-md font-semibold text-white mb-3">
                      Wallet Overview
                    </h2>

                    <div className="space-y-3 text-xs">
                      {/* USDe Balance */}
                      <div className="flex items-center  justify-between text-white">
                        <div className="flex items-center gap-2">
                          <FaCoins className="text-yellow-400 text-xl" />
                          <span className="text-sm">USDe Balance</span>
                        </div>
                        <span className="text-xs font-medium">
                          {tokenBalance?.usdeBalance
                            ? numeral(tokenBalance?.usdeBalance).format("0.0a")
                            : "0"}{" "}
                          USDe
                        </span>
                      </div>

                      {/* BUZZ Balance */}
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                          <FaCoins className="text-blue-400 text-xs" />
                          <span className="text-sm">BUZZ Balance</span>
                        </div>
                        <span className="text-xs font-medium">
                          {tokenBalance?.buzzBalance
                            ? numeral(tokenBalance?.buzzBalance).format("0.0a")
                            : "0"}{" "}
                          BUZZ
                        </span>
                      </div>

                      {/* Pool End Time */}
                      <div className="flex items-center justify-between text-red-400 mt-4">
                        <div className="flex items-center gap-2">
                          <MdAccessTime className="text-red-500 text-xs" />
                          <span className="text-sm">Pool Ends</span>
                        </div>
                        <span className="text-xs font-medium">
                          {formatTimestamp(selectedPost?.endTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Action Button */}
                {isBetted ? (
                  <button
                    disabled
                    className="w-full py-3 bg-white text-black rounded-lg font-medium hover:bg-blue-300 
        transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                  >
                    Already Place Bet
                  </button>
                ) : !selectedPost?.bettingOpen ? (
                  <div className="w-full py-3 bg-red-500 text-white rounded-lg font-medium text-center text-xs">
                    🚫 BETTING CLOSED
                  </div>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={
                      !investment || 
                      investment <= 0 || 
                      (selectedPost.poll_type === 0 && !betPosition) ||
                      (selectedPost.poll_type === 1 && !scorePrediction)
                    }
                    className="w-full py-3 bg-white text-black rounded-lg font-medium hover:bg-blue-300 
        transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                  >
                    {selectedPost.poll_type === 0 
                      ? `Place ${betPosition ? betPosition.toUpperCase() : ''} Bet`
                      : 'Place Bet'
                    }
                  </button>
                )}
                
                {/* Validation Messages */}
                {!isBetted && (
                  <div className="mt-2 text-xs">
                    {selectedPost.poll_type === 0 && !betPosition && (
                      <p className="text-red-400">Please select Yes or No</p>
                    )}
                    {(!investment || investment <= 0) && (
                      <p className="text-red-400">Please enter a valid bet amount</p>
                    )}
                    {selectedPost.poll_type === 1 && !scorePrediction && (
                      <p className="text-red-400">Please enter a score prediction</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3">
              <BetsGraph
                betsData={totalPools[selectedPost?.poolId as number]?.bets}
              />
            </div>
          </div>
        </div>
      ) : (
        <LoadingBar />
      )}
    </>
  );
}

function CreatePollBody() {
  const [pollData, setPollData] = useState({
    pollName: "",
    endDate: "",
    link: "",
    media: "",
    metric: "",
    type: "",
    question: "Hello My name is Neeraj",
    startDate: "",
  });
  const { address } = useAccount();
  let { createPool, getQuestionsFromAi } = useDataContext();
  const [questionsData, setQuestionsData] = useState<string[]>([]);
  const [minValue, setMinValue] = useState(0);
  const handlePollDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setPollData((prev) => ({ ...prev, [name]: value }));
  };

  function extractTweetInfo(url: string) {
    const regex = /x\.com\/([^\/]+)\/status\/(\d+)/;
    const match = url.match(regex);

    if (match) {
      return {
        username: match[1],
        tweetId: match[2],
      };
    }

    return null;
  }

  function _convertToArray(text: string) {
    // Extract only the first question from the AI response
    if (!text) return [];
    
    // Look for the first question pattern: "**Question 1:** ..."
    const firstQuestionMatch = text.match(/\*\*Question 1:\*\*([^*]+?)(?=\*\*Question 2:\*\*|\*\*$|$)/);
    if (firstQuestionMatch) {
      // Clean up the extracted text by removing any remaining markdown
      let cleanQuestion = firstQuestionMatch[1].trim();
      // Remove any leading ** or trailing **
      cleanQuestion = cleanQuestion.replace(/^\*\*\s*/, '').replace(/\s*\*\*$/, '');
      return [cleanQuestion];
    }
    
    // Alternative pattern: look for "Question 1:" without markdown
    const altPattern = text.match(/Question 1:\s*([^?]+\?)/);
    if (altPattern) {
      return [altPattern[1].trim()];
    }
    
    // Fallback: if the pattern doesn't match, try to extract the first numbered question
    const questions = text?.split(/\d+\.\s+/).filter(Boolean);
    return questions.length > 0 ? [questions[0]] : [];
  }
  const generateQuestions = async () => {
    let { pollName, endDate, link, media, metric, type } = pollData;
    const tweetInfo = extractTweetInfo(link);

    if (!link || !media || !metric || !endDate || !pollName || !type) {
      toast.error("Please Provide All Details");
      return;
    }
    if (!tweetInfo?.tweetId || !tweetInfo?.username) {
      toast.error("Not Valid Url");
      return;
    }

    let data = await getQuestionsFromAi(
      metric,
      tweetInfo?.tweetId,
      tweetInfo?.username,
      type
    );
    console.log("Raw AI response:", data);
    let _questions = _convertToArray(data?.question);
    console.log("Parsed questions:", _questions);
    
    // If no questions were parsed, show an error
    if (!_questions || _questions.length === 0) {
      toast.error("Failed to parse questions from AI response");
      console.error("Failed to parse questions from:", data?.question);
      return;
    }
    
    let _minValue = data?.postData[pollData?.metric];
    setMinValue(_minValue);
    setQuestionsData(_questions);
  };
  const handleCreatePoll = async () => {
    let { startDate, question, link, media, metric, endDate, pollName, type } =
      pollData;
    const dead = Math.floor(new Date(endDate).getTime() / 1000);
    const currentTimestamp = Math.floor(Date.now() / 1000); // Get current timestamp in seconds
    const timeRemaining = dead - currentTimestamp;
    let _type = type === "binary" ? 0 : 1;
    let maxRange = 40;
    await createPool(
      question,        // Pass question as first parameter (will be stored as question in contract)
      timeRemaining,
      pollName,       // Pass pollName as third parameter (will be stored as parameter in contract)
      link,
      media,
      metric,
      _type,
      startDate,
      endDate,
      minValue,
      maxRange
    );
  };
  return (
    <div className="flex justify-center items-center flex-col">
      <div className="max-w-xl w-full bg-change-trinary-bg  text-white p-6 rounded-md mt-0">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Create New Poll
        </h2>

        {/* Deployment Info */}
        <button className="flex items-center text-gray-200 text-sm mx-auto mb-4">
          <IoInformationCircleOutline className="mr-1 text-lg" />
          Deployment Cost Info
        </button>

        {/* Form Fields */}
        <div className="space-y-4">
          {address ? (
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                value={address}
                disabled
                placeholder="Creater Address"
                className="w-full p-3 bg-change-secondary-bg text-xs cursor-not-allowed  text-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <ConnectButton />
          )}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <input
                type="text"
                name="pollName"
                value={pollData.pollName}
                onChange={(e) => handlePollDataChange(e)}
                placeholder="Enter Pool Creater Name"
                className="w-full p-3 bg-change-secondary-bg  text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="deadline" className="block text-blue-400 mb-1">
                Start Date
              </label>
              <input
                type="datetime-local"
                id="startDate"
                name="startDate"
                value={pollData.startDate}
                onChange={(e) => handlePollDataChange(e)}
                className="w-full p-3 bg-change-secondary-bg text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="deadline" className="block text-blue-400 mb-1">
                End Date
              </label>
              <input
                type="datetime-local"
                id="endDate"
                name="endDate"
                value={pollData.endDate}
                onChange={(e) => handlePollDataChange(e)}
                className="w-full p-3 bg-change-secondary-bg text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="media" className="block text-blue-400 mb-1">
                Media
              </label>
              <select
                id="media"
                name="media"
                value={pollData.media}
                onChange={(e) => handlePollDataChange(e)}
                className="w-full p-3 bg-change-secondary-bg text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="null">Media</option>
                <option value="twitter">Twitter</option>
                <option value="instagram">Instagram</option>
                <option value="sport">Sports</option>
                <option value="farcaster">Farcaster</option>
              </select>
            </div>

            <div>
              <label htmlFor="type" className="block text-blue-400 mb-1">
                Market Type
              </label>
              <select
                id="type"
                name="type"
                value={pollData.type}
                onChange={(e) => handlePollDataChange(e)}
                className="w-full p-3 bg-change-secondary-bg text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="null">Market Type</option>
                <option value="binary">Binary</option>
                <option value="range-based">Range Based</option>
              </select>
            </div>
          </div>

          <div>
            <input
              type="url"
              name="link"
              value={pollData.link}
              onChange={(e) => handlePollDataChange(e)}
              placeholder="Put Your Poll Creation Url"
              className="w-full mt-2 p-3 bg-change-secondary-bg  text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <select
              name="metric"
              value={pollData.metric}
              onChange={(e) => handlePollDataChange(e)}
              className="w-full p-3 bg-change-secondary-bg text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="null">Select an Metric</option>
              <option value="views">Views</option>
              <option value="retweets">Retweets</option>
              <option value="shares">Shares</option>
              <option value="likes">Likes</option>
              <option value="comments">Comments</option>
              <option value="bookmark_count">BookMark Count</option>
              <option value="followers">Followers</option>
            </select>
          </div>

          {questionsData?.length > 0 && (
            <>
              <div>
                <label htmlFor="question" className="block text-blue-400 mb-1">
                  AI Generated Question
                </label>
                <select
                  id="question"
                  name="question"
                  value={pollData.question}
                  onChange={(e) =>
                    setPollData({ ...pollData, question: e.target.value })
                  }
                  className="w-full p-3 bg-change-secondary-bg text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="null">Select the generated question</option>
                  {questionsData &&
                    questionsData?.map((item: string, index: number) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </div>
            </>
          )}

          {!questionsData?.length > 0 && (
            <button
              onClick={generateQuestions}
              className="w-10 h-10 border p-2 flex justify-center items-center rounded-full"
            >
              <FaWandMagicSparkles size={20} />
            </button>
          )}

          {true && (
            <button
              onClick={handleCreatePoll}
              className="w-full py-3 bg-blue-400 text-gray-800 rounded-md"
            >
              Create Poll
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function HistoryBody() {
  const { userBetsData, totalPools, claimBet } = useDataContext();
  const handleClaimBet = async (id: number) => {
    await claimBet(id);
  };

  return (
    <>
      <div className="flex justify-center bg-change-trinary-bg rounded-xl p-0 overflow-hidden items-center flex-col">
        <div className="w-full bg-change-secondary-bg rounded-md">
          {/* Header Row */}
          <div className="flex bg-change-primary-bg text-gray-400 uppercase text-xs">
            <div className="flex-1 px-4 py-2">PoolId</div>
            <div className="flex-1 px-4 py-2">Bet Amount</div>
            <div className="flex-1 px-4 py-2">Final Score</div>
            <div className="flex-1 px-4 py-2 hidden md:block">
              Predict Score
            </div>
            <div className="flex-1 px-4 py-2">Claimable Amount</div>

            <div className="flex-1 px-4 py-2">Pool Status</div>
            <div className="flex-1 px-4 py-2">Actions</div>
          </div>
          {/* Data Rows */}
          <div className="flex flex-col text-white">
            {userBetsData?.length > 0 ? (
              userBetsData.map((bet, index) => (
                <div key={index} className="flex border-b border-gray-500 py-2">
                  <div className="flex-1 px-4 text-xs">{bet.poolId}</div>
                  <div className="flex-1 px-4 text-xs">{bet.amount}</div>
                  <div className="flex-1 px-4 text-xs">
                    {totalPools[bet.poolId]?.finalScore
                      ? totalPools[bet.poolId]?.finalScore
                      : "Not Resolve"}
                  </div>
                  <div className="flex-1 px-4 text-xs hidden md:block text-blue-500">
                    {bet.targetScore}
                  </div>
                  <div className="flex-1 px-4 text-xs text-green-500">
                    {bet.claimedAmount
                      ? bet.claimedAmount / 1e18 + " Buzz"
                      : "---"}
                  </div>

                  <div className="flex-1 px-4 text-xs">
                    {bet.status ? "Completed" : "Ongoing"}
                  </div>
                  <div className="flex-1 px-4 text-xs">
                    {bet.status && bet.claimedAmount / 1e18 > 0 && !bet.claimed && (
                      <button
                        onClick={() => handleClaimBet(bet?.poolId)}
                        className="text-white bg-green-500 px-3 py-1 rounded-md"
                      >
                        Claim
                      </button>
                    )}
                    {bet.status && bet.claimedAmount / 1e18 > 0 && bet.claimed && (
                      <span className="text-green-400 font-medium">✓ Claimed</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-400 text-center">
                No bets found.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export {
  RewardsSection,
  BalanceScore,
  LeaderBoardCard,
  SettingsCard,
  ExchangeComponent,
  ExploreBody,
  SelectedPost,
  CreatePollBody,
  HistoryBody,
};
