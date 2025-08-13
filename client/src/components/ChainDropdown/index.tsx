"use client";
import { useChain } from "@/context/ChainContext";
import React, { useEffect, useState } from "react";
import Dropdown from "../Resusables/Dropdown";
import { chainArray } from "@/constant/chainConstants";

const ChainDropdown = () => {
  const { setChainDetail, chainDetail } = useChain();
  const chains = chainArray;
  const [savedChainId, setSavedChainId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedChainId = localStorage?.getItem("selectedChainId");
      setSavedChainId(storedChainId);
    }
  }, []);

  useEffect(() => {
    if (savedChainId) {
      const savedChain = chains.find(
        (chain) => chain.id?.toString() === savedChainId
      );
      if (savedChain) {
        setChainDetail(savedChain);
      }
    }
  }, [savedChainId, setChainDetail]);

  const handleSelectChain = (chain: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedChainId", chain?.id);
    }
  };

  return (
    <Dropdown
      items={chains}
      label="Supported Chains"
      onSelect={handleSelectChain}
      selectedItem={chainDetail}
    />
  );
};

export default ChainDropdown;
