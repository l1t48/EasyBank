import { AMOUNT_DECIMAL_PLACES } from "../../../Data/Global_variables";

function UserRecentTransactionsTable({ recentTransactions, colors }) {
  return (
    <>
      <h2 style={{ color: colors.primary }} className="text-center text-lg font-semibold mb-3 duration-300 transition-colors">
        Recent Transactions
      </h2>
      <div className="overflow-x-auto">
        <table style={{ color: colors.primary, borderColor: colors.border }} className="min-w-full font-bold border duration-300 transition-colors">
          <thead style={{ backgroundColor: colors.cardBg }}>
            <tr>
              <th className="p-2 border duration-300 transition-colors" style={{ borderColor: colors.border }}>Type</th>
              <th className="p-2 border duration-300 transition-colors" style={{ borderColor: colors.border }}>Amount</th>
              <th className="p-2 border duration-300 transition-colors" style={{ borderColor: colors.border }}>State</th>
              <th className="p-2 border duration-300 transition-colors" style={{ borderColor: colors.border }}>Creation's Date</th>
              <th className="p-2 border duration-300 transition-colors" style={{ borderColor: colors.border }}>Handling's date</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((tx, idx) => (
              <tr key={idx} style={{ backgroundColor: colors.cardBg }}>
                <td className="p-2 border duration-300 transition-colors" style={{ borderColor: colors.border }}>{tx.transactionType}</td>
                <td className="p-2 border duration-300 transition-colors" style={{ borderColor: colors.border }}>${tx.amount.toFixed(AMOUNT_DECIMAL_PLACES)}</td>
                <td className="p-2 border duration-300 transition-colors" style={{ borderColor: colors.border }}>{tx.state}</td>
                <td className="p-2 border duration-300 transition-colors" style={{ borderColor: colors.border }}>{new Date(tx.createdAt).toLocaleString()}</td>
                <td className="p-2 border duration-300 transition-colors" style={{ borderColor: colors.border }}>{new Date(tx.updatedAt).toLocaleString() || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default UserRecentTransactionsTable;