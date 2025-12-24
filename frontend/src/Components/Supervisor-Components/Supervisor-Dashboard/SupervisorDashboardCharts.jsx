import { Pie, Doughnut } from "react-chartjs-2";
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
import { SUPERVISOR_CHART_DURATION } from "../../../Data/Global_variables";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function SupervisorDashboardCharts({ dashboard, colors }) {
  const transactionsByStateData = {
    labels: dashboard.transactionsByState.map(t => t._id),
    datasets: [
      {
        label: "Transactions by State",
        data: dashboard.transactionsByState.map(t => t.count),
        backgroundColor: [colors.primaryDigram, colors.accent, colors.secondary],
        borderColor: colors.primary,
        borderWidth: 1,
      },
    ],
  };
  const transactionsByTypeData = {
    labels: dashboard.transactionsByType.map(t => t._id),
    datasets: [
      {
        label: "Transactions by Type",
        data: dashboard.transactionsByType.map(t => t.count),
        backgroundColor: [colors.primaryDigram, colors.secondary, colors.accent],
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
      x: { display: false, ticks: { color: colors.primary }, grid: { color: colors.border } },
      y: { display: false, ticks: { color: colors.primary }, grid: { color: colors.border } },
    },
    animation: { duration: SUPERVISOR_CHART_DURATION, easing: "easeOutBounce" },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-5">
      <div style={{ backgroundColor: colors.cardBg, borderColor: colors.border }} className="p-5 rounded shadow border">
        <h2 style={{ color: colors.primary }} className="text-center text-lg font-semibold mb-3 duration-300 transition-colors">
          Transactions by State
        </h2>
        <Doughnut data={transactionsByStateData} options={chartOptions} />
      </div>
      <div style={{ backgroundColor: colors.cardBg, borderColor: colors.border }} className="p-5 rounded shadow border">
        <h2 style={{ color: colors.primary }} className="text-center text-lg font-semibold mb-3 duration-300 transition-colors">
          Transactions by Type
        </h2>
        <Pie data={transactionsByTypeData} options={chartOptions} />
      </div>
    </div>
  );
}

export default SupervisorDashboardCharts;