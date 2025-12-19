import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../Services/APIs";
import { useAuth } from "../../Context/AuthContext";
import Toast from "../../Context/Toast";

import { REDIRECTION_TIME } from "../../Data/Global_variables";

function LoginForm() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
    const [toastMsg, setToastMsg] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState("info");

    const navigate = useNavigate();

    async function forgotPassword(e) {
        e.preventDefault();
        setError(null);
        try {
            const res = await fetch(API.auth.forgotPassword, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Request failed");
                return;
            }
            setError(null);
            setToastMsg(data.message || "Check your email for reset link");
            setToastType("info");
            setShowToast(true);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        try {
            const res = await fetch(API.auth.login, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            setMessage(data.message)

            if (!res.ok) {
                setError(
                    data.error ||
                    (data.errors && data.errors[0]?.msg) ||
                    "Login failed"
                );
                setToastMsg("Login Failed");
                setToastType("error");
                setShowToast(true);
                return;
            }

            setToastMsg("Login Successful!");
            setToastType("success");
            setShowToast(true);

            login(data.token, data.user);

            setTimeout(() => {
                navigate("/dashboard");
            }, REDIRECTION_TIME);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    }

    return (
        <form className="w-full flex flex-col p-5 text-left animate__animated animate__fadeIn" onSubmit={handleSubmit}>
            <h1 className="text-4xl [@media(max-width:745px)]:text-3xl font-bold text-center text-[var(--nav-text)] duration-300 transition-colors">Login</h1>
            <br />
            <label htmlFor="email" className="[@media(max-width:745px)]:text-xl text-[var(--nav-text)] duration-300 transition-colors">Email</label>
            <input
                type="text"
                id="email"
                name="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                p-2 mt-2 font-light border text-[var(--nav-hover)]
                border-[var(--nav-text)] bg-[var(--nav-bg)] text-xl
                [@media(max-width:745px)]:text-lg
                focus:border-[var(--nav-text)] focus:ring focus:ring-[var(--nav-hover)]
                outline-none"
            />
            <br />
            <label htmlFor="password" className="[@media(max-width:745px)]:text-xl text-[var(--nav-text)] duration-300 transition-colors">Password</label>
            <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                className="
                p-2 mt-2 font-light border text-[var(--nav-hover)]
                border-[var(--nav-text)] bg-[var(--nav-bg)] text-xl
                [@media(max-width:745px)]:text-lg
                focus:border-[var(--nav-text)] focus:ring focus:ring-[var(--nav-hover)]
                outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button
                type="button"
                onClick={forgotPassword}
                className="text-lg underline text-[var(--nav-text)] hover:underline duration-300 transition-colors">Forgot your password?
            </button>
            <br />
            {error && <p className="text-red-500 text-lg">{error}</p>}
            {message && <p className="text-green-500 text-lg">{message}</p>}
            <br />
            <button type="submit" id="LoginButton" className="font-bold py-3 rounded-sm bg-[var(--nav-text)] text-[var(--nav-bg)] text-xl [@media(max-width:745px)]:text-lg  hover:bg-[var(--nav-bg)] hover:text-[var(--nav-text)] hover:border hover:border-[var(--nav-hover)] transition-all duration-300">
                Login
            </button>
            <br />
            <button
                type="button"
                onClick={() => navigate("/")}
                className="font-bold py-3 rounded-sm text-[var(--nav-text)] border border-[var(--nav-text)] bg-[var(--nav-bg)] text-xl [@media(max-width:745px)]:text-lg hover:bg-[var(--nav-text)] hover:text-[var(--nav-bg)] hover:border hover:border-[var(--nav-bg)] transition-all duration-300">Back to Home
            </button>

            <Toast message={toastMsg} show={showToast} type={toastType} onClose={() => setShowToast(false)} />
        </form>

    );
}
export default LoginForm
