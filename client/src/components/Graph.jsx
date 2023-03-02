import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Response Time In Millisecondes",
    },
  },
};

export default function Graph({ data }) {
  const labels = Object.values(data)[0].responses.map((_, index) => index + 1);
  const linesData = {
    labels,
    datasets: Object.entries(data).map(([websiteName, websiteData]) => {
      return {
        label: websiteName.toUpperCase(),
        data: websiteData.responses,
        borderColor: websiteData.color,
        backgroundColor: websiteData.color + "7f",
      };
    }),
  };
  return <Line options={options} data={linesData} />;
}
