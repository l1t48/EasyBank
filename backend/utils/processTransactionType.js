// | Function Name              | Description |
// |-----------------------------|-------------|
// | processTransactionType      | Processes a transaction (withdrawal, deposit, transfer) by updating user balances and transaction types accordingly |

const User = require("../models/User");

async function processTransactionType(transaction) {
    const user = await User.findById(transaction.userId);
    if (!user) throw new Error("User not found");
    if (transaction.transactionType === "Withdrawal") {
        if (user.balance < transaction.amount)
            throw new Error("Insufficient balance");
        user.balance -= transaction.amount;
        user.latestTransactionType = "Withdrawal";
        await user.save();
    }
    if (transaction.transactionType === "Deposit") {
        user.balance += transaction.amount;
        user.latestTransactionType = "Deposit";
        await user.save();
    }
    if (transaction.transactionType === "Transfer") {
        const targetUser = await User.findOne({ accountNumber: transaction.targetAccountNumber });
        if (user.balance < transaction.amount)
            throw new Error("Insufficient balance");
        user.balance -= transaction.amount;
        targetUser.balance += transaction.amount;
        user.latestTransactionType = "Send";
        targetUser.latestTransactionType = "Receive";
        await user.save();
        await targetUser.save();
    }
}

module.exports = processTransactionType;
