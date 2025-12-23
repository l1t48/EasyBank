export const setupInterceptors = () => {
    const { fetch: originalFetch } = window;

    window.fetch = async (...args) => {
        const response = await originalFetch(...args);
        if (response.status === 401) {
            const tempResponse = response.clone();
            const data = await tempResponse.json().catch(() => ({}));

            if (data.code === "TOKEN_VERSION_MISMATCH") {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/session-expired";
                return new Promise(() => {}); 
            }
        }

        return response;
    };
};