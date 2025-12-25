const BACK_END_URL = import.meta.env.VITE_API_BACKEND_URL;
const API_BASE_URL = BACK_END_URL; 

export const API = {
    test: {
        testBackend: `${API_BASE_URL}/api/test/ping`,
    },

    auth: {
        register: `${API_BASE_URL}/api/auth/register-new-user`,
        login: `${API_BASE_URL}/api/auth/login`,
        forgotPassword: `${API_BASE_URL}/api/auth/forgot-password`,
        resetPassword: (token) => `${API_BASE_URL}/api/auth/reset-password/${token}`,
    },

    admin: {
        allTransactions: `${API_BASE_URL}/api/admin/all-transactions`,
        pendingTransactions: `${API_BASE_URL}/api/admin/pending-transactions`,
        approveTransaction: `${API_BASE_URL}/api/admin/approve-transaction`,
        rejectTransaction: `${API_BASE_URL}/api/admin/reject-transaction`,
        auditLogs: `${API_BASE_URL}/api/admin/audit-logs`,
        allUsers: `${API_BASE_URL}/api/admin/all-users`,
        getUser: (accountNumber) => `${API_BASE_URL}/api/admin/admin/${accountNumber}`,
        createUser: `${API_BASE_URL}/api/admin/create-user`,
        updateUser: (id) => `${API_BASE_URL}/api/admin/update-user/${id}`,
        deleteUser: (id) => `${API_BASE_URL}/api/admin/delete-user/${id}`,
    },

    supervisor: {
        pendingTransactions: `${API_BASE_URL}/api/supervisor/pending-transactions`,
        approveTransaction: `${API_BASE_URL}/api/supervisor/approve-transaction`,
        rejectTransaction: `${API_BASE_URL}/api/supervisor/reject-transaction`,
        auditLogs: `${API_BASE_URL}/api/supervisor/audit-logs`,
        supervisorChangePassword: `${API_BASE_URL}/api/supervisor/change-password`,
    },

    user: {
        myAccount: `${API_BASE_URL}/api/user/my-account`,
        updateProfile: `${API_BASE_URL}/api/user/update-profile`,
        userChangePassword: `${API_BASE_URL}/api/user/change-password`,
        createTransaction: `${API_BASE_URL}/api/user/create-transaction`,
        transactions: `${API_BASE_URL}/api/user/transactions`,
        cancelTransaction: (id) =>`${API_BASE_URL}/api/user/cancel-transaction/${id}`,
    },

    dashboard: {
        user: `${API_BASE_URL}/api/dashboard/user`,
        admin: `${API_BASE_URL}/api/dashboard/admin`,
        supervisor: `${API_BASE_URL}/api/dashboard/supervisor`,
    },

    general: {
        names: `${API_BASE_URL}/api/data/names`,
        accountNumbers: `${API_BASE_URL}/api/data/accountNumbers`,
        accountNumber: (id) =>`${API_BASE_URL}/api/data/accountNumber/${id}`,
        namesByAccounts: `${API_BASE_URL}/api/data/names-by-accounts`
    }
};

