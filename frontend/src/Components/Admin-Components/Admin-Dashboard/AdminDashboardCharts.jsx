import { Bar, Pie, Doughnut } from "react-chartjs-2";
const ChartMap = { Bar, Pie, Doughnut};

function AdminDashboardCharts({ title, data, options, chartType, colors, isHorizontal = false }) {
    const ChartComponent = ChartMap[chartType];
    const finalOptions = isHorizontal 
        ? { ...options, indexAxis: "y", scales: { ...options.scales, x: options.scales.y, y: options.scales.x } }
        : options;
    if (!ChartComponent) return null;
    return (
        <div style={{ backgroundColor: colors.cardBg, borderColor: colors.border }} className="p-5 rounded shadow border duration-300 transition-colors">
            <h2 style={{ color: colors.primary }} className="text-center text-lg font-semibold mb-3 duration-300 transition-colors">
                {title}
            </h2>
            <ChartComponent data={data} options={finalOptions} />
        </div>
    );
}

export default AdminDashboardCharts;