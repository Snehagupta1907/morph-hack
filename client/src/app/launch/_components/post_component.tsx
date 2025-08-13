import { useDataContext } from "@/context/DataContext";
import Link from "next/link";
import React from "react";
import { FaTwitter } from "react-icons/fa";
import { RiRadioButtonLine } from "react-icons/ri";
import { LuDollarSign } from "react-icons/lu";
import { FaRegClock } from "react-icons/fa6";
import { FaUserSecret } from "react-icons/fa";
interface Post {
  id: number;
  poolId: number;
  url: string;
  question: string;
  category: string;
  parameter: string;
  poll_type: number;
  total_amount: number;
  total_bets: number;
  finalScore: number;
  startTime: number;
  endTime: number;
  resultDeclareTime: number;
  poolEnded: boolean;
  bettingOpen: boolean;
}
const PostComponent = ({
  item,
  onSelect,
}: {
  item: Post;
  onSelect: () => void;
}) => {
  const { formatTimestamp } = useDataContext();
  const formatCurrency = (amount: number | string | undefined) => {
    return amount ? `${Number(amount).toLocaleString()}` : "0";
  };
  
  // Debug logging
  console.log(`PostComponent ${item?.poolId}:`, {
    poolEnded: item?.poolEnded,
    bettingOpen: item?.bettingOpen,
    question: item?.question?.substring(0, 50) + "..."
  });

  return (
    <>
      <div
        onClick={onSelect}
        className="relative bg-gray-900 rounded-xl shadow-lg p-5 cursor-pointer transition-transform transform hover:scale-105 hover:shadow-2xl"
      >
        {/* Twitter Button - Positioned at Top Left */}
        <Link
          href={item?.url || "#"}
          target="_blank"
          className="absolute top-3 left-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition"
        >
          <FaTwitter className="text-xl" />
        </Link>

        {/* Question */}
        <h2 className="font-semibold text-md text-white mt-10">{item?.question}</h2>

        {/* Tags Section */}
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-black uppercase">
          {item?.category && (
            <span className="bg-slate-300 px-2 py-1 rounded-md">
              #{item.category}
            </span>
          )}
          {item?.parameter && (
            <span className="bg-green-700 px-2 py-1 rounded-md">
              #{item.parameter}
            </span>
          )}
        </div>

        {/* Market Info */}
        <div className="mt-4 flex justify-between items-center text-sm text-gray-300">
          <div className="flex flex-wrap gap-3 text-sm font-medium">
            {/* Total Amount */}
            <span className="flex items-center gap-1 text-green-500 bg-green-100 px-2 py-1 rounded-md">
              <LuDollarSign className="text-green-600" />
              <span className="font-semibold">
                {formatCurrency(item?.total_amount)}
              </span>
            </span>

            {/* Start Time */}
            <span className="flex items-center gap-1 text-red bg-orange-100 px-2 py-1 rounded-md">
              <FaRegClock className="text-red" />
              <span className="ml-2">{formatTimestamp(item?.endTime)}</span>
            </span>

            {/* Total Bets */}
            <span className="flex items-center gap-1 text-purple-500 bg-purple-100 px-2 py-1 rounded-md">
              <FaUserSecret className="text-purple-600" />
              <span>{item?.total_bets || 0}</span>
            </span>
          </div>
          {/* Status Indicator */}
          <div className="flex flex-col gap-1 items-end">
            <span className="flex items-center gap-2">
              <RiRadioButtonLine
                className={item?.poolEnded ? "text-red" : "text-green-500"}
              />
              <span className="uppercase font-bold">
                {item?.poolEnded ? "ENDED" : "ONGOING"}
              </span>
            </span>
            {/* Betting Status Tag */}
            {!item?.bettingOpen && (
              <span className="flex items-center gap-1 text-xs bg-red-500 text-white px-2 py-1 rounded-md">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                BETTING CLOSED
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default PostComponent;
