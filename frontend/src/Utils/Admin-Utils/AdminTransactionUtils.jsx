import { getAccountNumbersByIds, getUserFullNamesByAccountNumbers } from "../General-Utils/FetchUserData";

export const getNormalizedId = (payload) => payload && (payload._id || payload.id || payload.idStr || null);

export const normalizePayload = (tx) => ({
  id: getNormalizedId(tx),
  transactionId: tx.transactionId || 'N/A',
  transactionType: tx.transactionType,
  amount: tx.amount,
  state: tx.state,
  userAccountNumber: tx.userAccountNumber || null,
  targetAccountNumber: tx.targetAccountNumber || null,
  targetUserName: tx.targetUserName || null,
  createdAt: tx.createdAt,
  updatedAt: tx.updatedAt,
});

export const enrichTransactionData = async (tx) => {
  const id = getNormalizedId(tx);

  let userAccountNumber = tx.userAccountNumber || null;
  const targetAccountNumber = tx.targetAccountNumber || null;

  // Resolve missing user account number
  const userId = tx.userId || tx.user?._id || null;
  if (!userAccountNumber && userId) {
    const accountResults = await getAccountNumbersByIds([userId]);
    userAccountNumber = accountResults[0]?.accountNumber || null;
  }

  // Resolve target user name if available
  let targetUserName = null;
  if (targetAccountNumber) {
    const targetNames = await getUserFullNamesByAccountNumbers([targetAccountNumber]);
    targetUserName = targetNames[0]?.fullName || null;
  }

  return {
    id,
    transactionId: tx.transactionId || 'N/A',
    transactionType: tx.transactionType,
    amount: tx.amount,
    state: tx.state,
    userAccountNumber,
    targetAccountNumber,
    targetUserName,
    createdAt: tx.createdAt,
    updatedAt: tx.updatedAt,
  };
};