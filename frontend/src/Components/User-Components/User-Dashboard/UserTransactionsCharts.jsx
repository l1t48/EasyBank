import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { USER_CHART_DURATION } from "../../../Data/Global_variables";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function UserTransactionsCharts({ totalsByType, colors }) {
  const transactionTypes = Object.keys(totalsByType);
  
  const totalsData = {
    labels: transactionTypes,
    datasets: [
      {
        label: "Total Amount by Type",
        data: transactionTypes.map(t => totalsByType[t].totalAmount),
        backgroundColor: [colors.secondary, colors.primaryDigram, colors.accent],
        borderColor: colors.primary,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: colors.primary } },
      tooltip: { titleColor: colors.diagram_text, bodyColor: colors.diagram_text },
    },
    scales: {
      x: { ticks: { color: colors.primary }, grid: { color: colors.border } },
      y: { ticks: { color: colors.primary }, grid: { color: colors.border } },
    },
    animation: { duration: USER_CHART_DURATION, easing: "easeOutBounce" },
  };

  return (
    <>
      <h2 style={{ color: colors.primary }} className="text-center text-lg font-semibold mb-3 duration-300 transition-colors">
        Transactions Total Amount by Type
      </h2>
      <Bar data={totalsData} options={chartOptions} />
    </>
  );
}

export default UserTransactionsCharts;