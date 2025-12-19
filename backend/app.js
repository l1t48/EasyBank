require("dotenv").config();
const express = require("express");
const helmetMiddleware = require("./middlewares/helmetMiddleware");
const corsMiddleware = require("./middlewares/corsMiddleware");

const test_ping = require("./routes/test/test");

const fetchUsersData = require("./routes/general/fetchUsersData");

const login = require("./routes/authentication/login");
const register = require("./routes/authentication/register");
const password = require("./routes/authentication/password");

const userDashboard = require("./routes/user/dashboard");
const userTransactionOperations = require("./routes/user/transactions_operations");
const userAccountOperations = require("./routes/user/account_operations");

const supervisorDashboard = require("./routes/supervisor/dashboard");
const supervisorTransactionsOperations = require("./routes/supervisor/transactions_operations");
const supervisorAccountOperations = require("./routes/supervisor/account_operations");
const supervisorAuditLogs = require("./routes/supervisor/audit_logs");

const adminDashboard = require("./routes/admin/dashboard");
const adminTransactionsOperations = require("./routes/admin/transactions_operations");
const adminUserMangement = require("./routes/admin/users_management");
const adminAuditLogs = require("./routes/admin/audit_logs");

const app = express();

app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "20kb" }));
app.set("trust proxy", 1);

app.use("/api/test", test_ping);

app.use("/api/dashboard", supervisorDashboard);
app.use("/api/supervisor", supervisorTransactionsOperations);
app.use("/api/supervisor", supervisorAccountOperations);
app.use("/api/supervisor", supervisorAuditLogs);

app.use("/api/dashboard", userDashboard);
app.use("/api/user", userTransactionOperations);
app.use("/api/user", userAccountOperations);

app.use("/api/dashboard", adminDashboard);
app.use("/api/admin", adminTransactionsOperations);
app.use("/api/admin", adminUserMangement);
app.use("/api/admin", adminAuditLogs);

app.use("/api/data", fetchUsersData);

app.use("/api/auth", login);
app.use("/api/auth", register);
app.use("/api/auth", password)


module.exports = app;
