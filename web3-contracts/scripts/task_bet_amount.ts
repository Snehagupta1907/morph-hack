import { ethers } from "hardhat";

async function placeBet(amount: any, score: number, id: number) {
  const BUZZIFY_CONTRACT_NAME = "BuzziFi";
  const BuzzifyAddress = "0x06d7841983A17bB370c5CDE5f67B1C6C1e8f77Ed";
  const sender = new ethers.Wallet(
    process.env.DEPLOYER_ACCOUNT_PRIV_KEY as any,
    ethers.provider
  );

  console.log("Deployer address:", sender.address);
  console.log("Betting in pool...");
  const myBuzzifyContract = await ethers.getContractAt(
    BUZZIFY_CONTRACT_NAME,
    BuzzifyAddress,
    sender
  );
  const tx = await myBuzzifyContract.placeBet(amount, score, id);
  await tx.wait();
  console.log("Pool Created Successfully:", tx.hash);
}

async function main() {
  const amount = ethers.parseEther("1");
  const score = 300;
  const id = 0;
  await placeBet(amount, score, id);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
