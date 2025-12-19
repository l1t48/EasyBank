import { AMOUNT_DECIMAL_PLACES } from "../../../Data/Global_variables";

function UserDashboardMetrics({ dashboard, colors }) {
  const metrics = [
    { label: "Account Number", value: dashboard.accountNumber || "N/A" },
    { label: "Balance", value: `$${dashboard.balance.toFixed(AMOUNT_DECIMAL_PLACES)}` },
    { label: "Latest Transaction", value: dashboard.latestTransactionType || "N/A" },
    { label: "Total Transactions", value: dashboard.transactionsCount },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 p-5">
      {metrics.map((metric, index) => (
        <div
          key={index}
          style={{ color: colors.primary, backgroundColor: colors.cardBg, borderColor: colors.border }}
          className="rounded-sm shadow p-4 flex flex-col items-center border duration-300 transition-colors"
        >
          <h2 className="text-lg font-semibold mb-2 duration-300 transition-colors">{metric.label}</h2>
          <p className="text-2xl font-bold duration-300 transition-colors">{metric.value}</p>
        </div>
      ))}
    </div>
  );
}

export default UserDashboardMetrics;