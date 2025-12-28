/**
 * In Production (Vercel): We use relative paths so the vercel.json rewrite takes over.
 * In Development (Local): Vite's proxy handles these same relative paths.
 */
const API_BASE_URL = ""; 

export const API = {
    test: {
        testBackend: `/api/test/ping`,
    },

    auth: {
        register: `/api/auth/register-new-user`,
        login: `/api/auth/login`,
        forgotPassword: `/api/auth/forgot-password`,
        resetPassword: (token) => `/api/auth/reset-password/${token}`,
    },

    admin: {
        allTransactions: `/api/admin/all-transactions`,
        pendingTransactions: `/api/admin/pending-transactions`,
        approveTransaction: `/api/admin/approve-transaction`,
        rejectTransaction: `/api/admin/reject-transaction`,
        auditLogs: `/api/admin/audit-logs`,
        allUsers: `/api/admin/all-users`,
        getUser: (accountNumber) => `/api/admin/admin/${accountNumber}`,
        createUser: `/api/admin/create-user`,
        updateUser: (id) => `/api/admin/update-user/${id}`,
        deleteUser: (id) => `/api/admin/delete-user/${id}`,
    },

    supervisor: {
        pendingTransactions: `/api/supervisor/pending-transactions`,
        approveTransaction: `/api/supervisor/approve-transaction`,
        rejectTransaction: `/api/supervisor/reject-transaction`,
        auditLogs: `/api/supervisor/audit-logs`,
        supervisorChangePassword: `/api/supervisor/change-password`,
    },

    user: {
        myAccount: `/api/user/my-account`,
        updateProfile: `/api/user/update-profile`,
        userChangePassword: `/api/user/change-password`,
        createTransaction: `/api/user/create-transaction`,
        transactions: `/api/user/transactions`,
        cancelTransaction: (id) => `/api/user/cancel-transaction/${id}`,
    },

    dashboard: {
        user: `/api/dashboard/user`,
        admin: `/api/dashboard/admin`,
        supervisor: `/api/dashboard/supervisor`,
    },

    general: {
        names: `/api/data/names`,
        accountNumbers: `/api/data/accountNumbers`,
        accountNumber: (id) => `/api/data/accountNumber/${id}`,
        namesByAccounts: `/api/data/names-by-accounts`
    }
};

// const BACK_END_URL = import.meta.env.VITE_API_BACKEND_URL;
// const API_BASE_URL = BACK_END_URL; 

// export const API = {
//     test: {
//         testBackend: `${API_BASE_URL}/api/test/ping`,
//     },

//     auth: {
//         register: `${API_BASE_URL}/api/auth/register-new-user`,
//         login: `${API_BASE_URL}/api/auth/login`,
//         forgotPassword: `${API_BASE_URL}/api/auth/forgot-password`,
//         resetPassword: (token) => `${API_BASE_URL}/api/auth/reset-password/${token}`,
//     },

//     admin: {
//         allTransactions: `${API_BASE_URL}/api/admin/all-transactions`,
//         pendingTransactions: `${API_BASE_URL}/api/admin/pending-transactions`,
//         approveTransaction: `${API_BASE_URL}/api/admin/approve-transaction`,
//         rejectTransaction: `${API_BASE_URL}/api/admin/reject-transaction`,
//         auditLogs: `${API_BASE_URL}/api/admin/audit-logs`,
//         allUsers: `${API_BASE_URL}/api/admin/all-users`,
//         getUser: (accountNumber) => `${API_BASE_URL}/api/admin/admin/${accountNumber}`,
//         createUser: `${API_BASE_URL}/api/admin/create-user`,
//         updateUser: (id) => `${API_BASE_URL}/api/admin/update-user/${id}`,
//         deleteUser: (id) => `${API_BASE_URL}/api/admin/delete-user/${id}`,
//     },

//     supervisor: {
//         pendingTransactions: `${API_BASE_URL}/api/supervisor/pending-transactions`,
//         approveTransaction: `${API_BASE_URL}/api/supervisor/approve-transaction`,
//         rejectTransaction: `${API_BASE_URL}/api/supervisor/reject-transaction`,
//         auditLogs: `${API_BASE_URL}/api/supervisor/audit-logs`,
//         supervisorChangePassword: `${API_BASE_URL}/api/supervisor/change-password`,
//     },

//     user: {
//         myAccount: `${API_BASE_URL}/api/user/my-account`,
//         updateProfile: `${API_BASE_URL}/api/user/update-profile`,
//         userChangePassword: `${API_BASE_URL}/api/user/change-password`,
//         createTransaction: `${API_BASE_URL}/api/user/create-transaction`,
//         transactions: `${API_BASE_URL}/api/user/transactions`,
//         cancelTransaction: (id) =>`${API_BASE_URL}/api/user/cancel-transaction/${id}`,
//     },

//     dashboard: {
//         user: `${API_BASE_URL}/api/dashboard/user`,
//         admin: `${API_BASE_URL}/api/dashboard/admin`,
//         supervisor: `${API_BASE_URL}/api/dashboard/supervisor`,
//     },

//     general: {
//         names: `${API_BASE_URL}/api/data/names`,
//         accountNumbers: `${API_BASE_URL}/api/data/accountNumbers`,
//         accountNumber: (id) =>`${API_BASE_URL}/api/data/accountNumber/${id}`,
//         namesByAccounts: `${API_BASE_URL}/api/data/names-by-accounts`
//     }
// };

