import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useChain } from "../../context/ChainContext";
import { wagmiConfig } from "@/utils/wallet-utils";
import { switchChain } from "@wagmi/core";
import { useState, useEffect } from "react";

export const ConnectButton2 = () => {
  const { chainDetail } = useChain();
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    // Listen for the chain change event in MetaMask
    if (window.ethereum) {
      const handleChainChanged = (chainId: string) => {
        // Switch to the chainDetail when the network changes in MetaMask
        if (chainId !== `0x${Number(chainDetail?.id).toString(16)}`) {
          switchChain(wagmiConfig, {
            chainId: Number(chainDetail?.id),
          });
        }
      };

      window.ethereum.on('chainChanged', handleChainChanged);

      // Cleanup the event listener when the component unmounts
      return () => {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [chainDetail]);

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
  };

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }: {
        account: any;
        chain: any;
        openAccountModal: () => void;
        openChainModal: () => void;
        openConnectModal: () => void;
        authenticationStatus: any;
        mounted: boolean;
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        const buttonClass = `
          flex h-10 px-3 py-1.5 md:p-4 
          justify-center items-center gap-1 mr-2 md:mr-0 
          rounded bg-transparent rounded-md w-full 
          border border-solid border-gray-500 
          text-white text-2xs md:text-sm 
          transition-all duration-200 ease-in-out transform font-medium whitespace-nowrap cursor-pointer
        `;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (connected) {
                return (
                  <div>
                    {chain.id !== Number(chainDetail?.id) ? (
                      <button
                        onClick={async () => {
                          if (window.ethereum) {
                            try {
                              await switchChain(wagmiConfig, {
                                chainId: Number(chainDetail?.id),
                              });
                            } catch (error) {
                              console.error("Network switch failed:", error);
                            }
                          } else {
                            alert("MetaMask or compatible wallet is required to switch networks.");
                          }
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                        type="button"
                        className={buttonClass}
                        id="connect-button"
                      >
                        Switch network
                      </button>
                    ) : (
                      <button
                        onClick={openAccountModal}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                        type="button"
                        className={buttonClass}
                        id="connect-button"
                      >
                        {account.displayName}
                      </button>
                    )}
                  </div>
                );
              } else {
                return (
                  <button
                    onClick={openConnectModal}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    type="button"
                    className={buttonClass}
                    id="connect-button"
                  >
                    Login
                  </button>
                );
              }
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
