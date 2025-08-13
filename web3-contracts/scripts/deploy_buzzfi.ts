import { ethers } from "hardhat";

async function deployBuzzFi() {
  const CONTRACT_NAME = "BuzziFi";
  const tokenAddress = "0x1950Df5cA963b4e1905a7A447998233F25E35F56";
  const buzziFi = await ethers.deployContract(CONTRACT_NAME, [
    tokenAddress,
  ]);
  await buzziFi.waitForDeployment();
  console.log(
    "Deployed RFI contract address:",
    await buzziFi.getAddress()
  );
}

async function main() {
  await deployBuzzFi();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
