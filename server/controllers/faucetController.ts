import { Request, Response } from "express";
import dotenv from "dotenv";
import { ethers } from "ethers";
import User, { IUser } from "../dao/user";
import { _checkUserFaucetClaimed } from "../services/userService";
import { TOKEN_ABI } from "../constant";
import { createUser } from "../services/userService";
dotenv.config();

export const dripFaucet = async (
  req: Request,
  res: Response
): Promise<any | undefined> => {
  const { receiver, rpc_url, tokenAddress } = req.query;

  if (!receiver || !tokenAddress || !rpc_url) {
    return res.status(400).json({ message: "Deatils are Missing !!!" });
  }

  console.log(receiver, tokenAddress, rpc_url);

 
  const isClaimed = await _checkUserFaucetClaimed(receiver as `0xstring`);
  try {
    if (isClaimed) {
      return res.status(200).json({
        message: "You Already Claimed",
      });
    }
    const provider = new ethers.JsonRpcProvider(
      "https://testnet.rpc.ethena.fi/"
    );
    console.log(provider);
    const signer = new ethers.Wallet("0x" + process.env.PRIVATE_KEY, provider);
    if (!signer) {
      return res.status(400).json({ message: "Signer is required" });
    }
    const contract = new ethers.Contract(
      tokenAddress as `0xstring`,
      TOKEN_ABI,
      signer
    );

    let tx = await contract.transfer(receiver, ethers.parseEther("200"), {
      from: signer.address,
    });
    await tx.wait();
    let existingUser = await User.findOne({ address: receiver });
    if (existingUser) {
      existingUser.isFaucetClaimed = true;
      await existingUser.save();
    }

    return res.status(200).json({
      message: "Dripped successfully !!!",
      transaction: `https://testnet.explorer.ethena.fi/tx/${tx.hash}`,
    });
  } catch (error) {
    console.log(error);
  }
};
