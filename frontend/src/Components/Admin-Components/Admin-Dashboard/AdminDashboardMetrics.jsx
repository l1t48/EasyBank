function AdminDashboardMetrics({ metrics, colors }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 p-5">
      {metrics.map((metric, index) => (
        <div
          key={index}
          style={{ color: colors.primary, backgroundColor: colors.cardBg, borderColor: colors.border }}
          className="rounded-sm shadow p-4 flex flex-col items-center animate-fade-in border"
        >
          <h2 className="text-lg font-semibold mb-2 duration-300 transition-colors">{metric.label}</h2>
          <p className="text-2xl font-bold duration-300 transition-colors">{metric.value}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboardMetrics;