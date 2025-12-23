import { useState, useId } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../../Services/APIs";
import Toast from "../../Context/Toast";

import { REDIRECTION_TIME_PASSWORD_RESET } from "../../Data/Global_variables";

export default function ResetPassword() {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const idPrefix = useId();

    const [toastMsg, setToastMsg] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState("info");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const res = await fetch(API.auth.resetPassword(token), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newPassword }),
        });
        const data = await res.json();
        if (res.ok) {
            setMessage("Password reset successful. You can now log in.");
            setToastMsg("Operation Successed!");
            setToastType("success");
            setShowToast(true);
            setTimeout(() => {
                navigate("/auth-page");
            }, REDIRECTION_TIME_PASSWORD_RESET);
        } else {
            setError((data.errors && data.errors[0]?.msg) || data.error);
            setToastMsg("Operation Failed");
            setToastType("error");
            setShowToast(true);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center w-full mt-5">
            <div className="w-full max-w-2xl shadow-lg rounded-sm p-3">
                <form className="w-full flex flex-col p-5 text-left" onSubmit={handleSubmit}>
                    <br />
                    <h1 className="text-4xl [@media(max-width:745px)]:text-3xl font-bold text-center text-[var(--nav-text)]">Reset Password</h1>
                    <br />
                    <br />  
                    <label htmlFor={`${idPrefix}-password`} className="[@media(max-width:745px)]:text-xl text-[var(--nav-text)] text-2xl font-bold">New Password</label>
                    <input
                        name={`${idPrefix}-password`}
                        id={`${idPrefix}-password`}
                        type="password"
                        value={newPassword}
                        autoComplete="current-password"
                        placeholder="Enter your new password"
                        className="p-2 mt-2 font-light text-xl [@media(max-width:745px)]:text-lg text-[var(--nav-hover)] border border-[var(--nav-text)] bg-[var(--nav-bg)] focus:border-[var(--nav-text)] focus:ring focus:ring-[var(--nav-hover)] outline-none"
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <br />
                    {error && <p className="text-red-500 text-lg">{error}</p>}
                    {message && <p className="text-green-500 text-lg">{message}</p>}
                    <br />
                    <button type="submit" className="font-bold py-3 rounded-sm bg-[var(--nav-text)] text-[var(--nav-bg)] text-xl [@media(max-width:745px)]:text-lg hover:bg-[var(--nav-bg)] hover:text-[var(--nav-text)] hover:border hover:border-[var(--nav-hover)] transition-all duration-300">Reset Password</button>
                    <br />
                    <button
                        type="button"
                        onClick={() => navigate("/auth-page")}
                        className="font-bold py-3 rounded-sm text-[var(--nav-text)] border border-[var(--nav-text)] bg-[var(--nav-bg)] text-xl [@media(max-width:745px)]:text-lg hover:bg-[var(--nav-text)] hover:text-[var(--nav-bg)] hover:border hover:border-[var(--nav-bg)] transition-all duration-300">
                        Go to login
                    </button>   
                    <Toast message={toastMsg} show={showToast} type={toastType} onClose={() => setShowToast(false)}/>
                </form>
            </div>
        </div>
    );
}
