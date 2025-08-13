import React from "react";
import { useDataContext } from "@/context/DataContext";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Bet {
  user: string;
  amount: number;
  targetScore: number;
  claimedAmount: number;
  claimed: boolean;
}

const BetsGraph = (betsData:[]) => {
  const createHistogramData = (bets: Bet[]) => {
    const ranges = [
      { range: "0-100", totalAmount: 0 },
      { range: "100-200", totalAmount: 0 },
      { range: "200-300", totalAmount: 0 },
      { range: "300-400", totalAmount: 0 },
      { range: "400-500", totalAmount: 0 },
    ];

    console.log(bets,"bets");
    bets?.betsData?.forEach((bet) => {
      if (bet.targetScore >= 0 && bet.targetScore < 100) {
        ranges[0].totalAmount += bet.amount;
      } else if (bet.targetScore >= 100 && bet.targetScore < 200) {
        ranges[1].totalAmount += bet.amount;
      } else if (bet.targetScore >= 200 && bet.targetScore < 300) {
        ranges[2].totalAmount += bet.amount;
      } else if (bet.targetScore >= 300 && bet.targetScore < 400) {
        ranges[3].totalAmount += bet.amount;
      } else if (bet.targetScore >= 400 && bet.targetScore <= 500) {
        ranges[4].totalAmount += bet.amount;
      }
    });

    return ranges;
  };

  const histogramData = createHistogramData(
    betsData || []
  );
  const data = {
    labels: histogramData.map((range) => range.range),
    datasets: [
      {
        label: "Total Amount",
        data: histogramData.map((range) => range.totalAmount),
        backgroundColor: "rgba(99, 132, 255, 0.7)",
        borderColor: "rgba(99, 132, 255, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255, 206, 86, 0.8)",
        hoverBorderColor: "rgba(255, 206, 86, 1)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#ffffff",
        },
      },
      title: {
        display: true,
        text: "",
        color: "#ffffff",
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleColor: "#ffffff",
        bodyColor: "#080C27",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Score Ranges",
          color: "#ffffff",
        },
        ticks: {
          color: "#ffffff",
        },
      },
      y: {
        title: {
          display: true,
          text: "Total Amount",
          color: "#ffffff",
        },
        ticks: {
          color: "#ffffff",
        },

        beginAtZero: true,
      },
    },
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuad",
    },
  };

  return (
    <>
      <Bar data={data} options={options} height={250} />
    </>
  );
};

export default BetsGraph;
