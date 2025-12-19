const { getIO } = require("../socket");
const User = require("../models/User");
const { SUPERVISOR_APPROVAL_LIMIT } = require("../config/global_variables");
const sendMail = require("./mailer");

/*
|------------------------------------------------------------------------------------------|
| NEW SOCKET EMITTER SETUP (backend/utils/transactionEmitter.js)                           |
|--------------------------------------------------------------------------------------    |
| Function/Role         | Purpose / Targeting Scope                    | Security Status   |
|-----------------------|----------------------------------------------|-----------------  |
| emitTransactionUpdate | 🛑 **DEPRECATED** Global broadcast to ALL    | **INSECURE**      |
| (OLD FUNCTION)        | connected clients.                           |                   |
|-----------------------|----------------------------------------------|-----------------  |
| emitToUser            | Send to a single user's devices (user:ID room).| SECURE/TARGETED |
|-----------------------|----------------------------------------------|-----------------  |
| emitToRole            | Send to all Supervisors or Admins (role:NAME).| SECURE/TARGETED  |
|-----------------------|----------------------------------------------|-----------------  |
| toPublicJson          | Helper: Sanitizes transaction data by role.  | **CRUCIAL**       |
|-----------------------|----------------------------------------------|-----------------  |
| notifyTransactionUpdate| **Main Orchestrator:** Use to replace the    | SECURE/TARGETED  |
| (NEW FUNCTION)        | old function. Handles filtering and all staff/ |                 |
|                       | user notifications for status changes.        |                   |
|--------------------------------------------------------------------------------------    |
*/

function emitTransactionUpdate(transaction) {
  try {
    const io = getIO();
    // This is the insecure part: global broadcast
    io.emit("transactionUpdated", transaction);
    console.warn("WARNING: Called deprecated emitTransactionUpdate. Switch to notifyTransactionUpdate for targeted emissions.");
  } catch (err) {
    console.error("Socket emit error:", err);
  }
}

async function emitToUser(userId, event, payload) {
  try {
    getIO().to(`user:${userId}`).emit(event, payload);
  } catch (err) {
    console.error(`Error emitting to user:${userId}:`, err);
  }
}


async function emitToAccount(accountNumber, event, payload) {
  try {
    getIO().to(`account:${accountNumber}`).emit(event, payload);
  } catch (err) {
    console.error(`Error emitting to account:${accountNumber}:`, err);
  }
}

async function emitToRole(roleName, event, payload) {
  try {
    getIO().to(`role:${roleName.toString().toLowerCase()}`).emit(event, payload);
  } catch (err) {
    console.error(`Error emitting to role:${roleName}:`, err);
  }
}

function toPublicJson(tx, audience = "user", performer = null) {
  if (!tx) return null;

  const base = {
    id: tx._id,
    transactionId: tx.transactionId || tx._id,
    amount: tx.amount,
    transactionType: tx.transactionType,
    userId: tx.userId,
    state: tx.state,
    createdAt: tx.createdAt,
    targetAccountNumber: tx.targetAccountNumber || null,
  };

  if (audience === "supervisor") {
    const performerAccountNumber = performer?.accountNumber || null;
    const performerName = performer?.name || null;
    return {
      ...base,
      userAccountNumber: performerAccountNumber,
      userName: performerName
    };
  }

  if (audience === "admin") {
    const performerAccountNumber = performer?.accountNumber || null;
    const performerName = performer?.name || null;
    return {
      ...base,
      userAccountNumber: performerAccountNumber,
      userName: performerName
    };
  }

  return base;
}

async function _fetchPerformerDetails(userId) {
  if (!userId) return null;
  try {
    const perf = await User.findById(userId).select("accountNumber firstName lastName").lean();
    if (perf) {
      return {
        accountNumber: perf.accountNumber || null,
        name: `${perf.firstName || ""} ${perf.lastName || ""}`.trim() || null
      };
    }
  } catch (err) {
    console.error("Helper: Error fetching performer details.", err);
  }
  return null;
}

async function _notifyTargetTransfer(transaction, event) {
  if (!transaction.targetAccountNumber) return;

  const targetUser = await User.findOne({ accountNumber: transaction.targetAccountNumber }).select("_id email firstName").lean();
  if (targetUser && targetUser._id) {
    await emitToUser(targetUser._id.toString(), event, {
      id: transaction._id,
      transactionId: transaction.transactionId,
      targetAccountNumber: transaction.targetAccountNumber,
      notice: event === 'transactionApproved' ? "incoming_transfer" : "transfer_rejected",
      state: transaction.state,
      amount: transaction.amount,
      transactionType: transaction.transactionType
    });

    if (targetUser.email) {
      const subject = event === 'transactionApproved'
        ? `Incoming transfer ${transaction.transactionId}`
        : `Transfer ${transaction.transactionId} ${transaction.state}`;
      const html = event === 'transactionApproved'
        ? `<p>Hi ${targetUser.firstName},</p>
           <p>You received <strong>$${transaction.amount}</strong> from transaction <strong>${transaction.transactionId}</strong>.</p>`
        : `<p>Hi ${targetUser.firstName},</p>
           <p>Your incoming transfer <strong>${transaction.transactionId}</strong> was <strong>${transaction.state}</strong>.</p>`;
      await sendMail(targetUser.email, subject, html);
    }
  }
}


async function _notifyStaff(transaction, event, performer) {
  const supPayload = toPublicJson(transaction, "supervisor", performer);
  const adminPayload = toPublicJson(transaction, "admin", performer);

  if (supPayload && transaction.amount < SUPERVISOR_APPROVAL_LIMIT) {
    await emitToRole("supervisor", event, supPayload);
  }

  if (adminPayload) {
    await emitToRole("admin", event, adminPayload);
  }
}

async function notifyTransactionUpdate(transaction, options = {}) {
  try {
    const event = options.event || "transactionUpdated";
    const performer = await _fetchPerformerDetails(transaction.userId);

    const userPayload = toPublicJson(transaction, "user", performer);
    if (transaction.userId) {
      await emitToUser(transaction.userId.toString(), event, userPayload);
      if (transaction.userId) { 
        const performingUser = await User.findById(transaction.userId).select("email firstName").lean();
        if (performingUser?.email) {
          await sendMail(
            performingUser.email,
            `Transaction ${transaction.transactionId} is ${transaction.state}`,
            `<p>Hi ${performingUser.firstName},</p>
            <p>Your transaction <strong>${transaction.transactionId}</strong> was <strong>${transaction.state}</strong>.</p>`
          );
        }
      }

    }

    await _notifyTargetTransfer(transaction, event);
    await _notifyStaff(transaction, event, performer);

  } catch (err) {
    console.error("notifyTransactionUpdate orchestration error:", err);
  }
}

module.exports = {
  emitTransactionUpdate, 
  emitToUser,
  emitToAccount,
  emitToRole,
  notifyTransactionUpdate,
  toPublicJson
};