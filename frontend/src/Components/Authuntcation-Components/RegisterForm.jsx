import { useState } from "react";
import { API } from "../../Services/APIs";
import Toast from "../../Context/Toast";
import { useNavigate } from "react-router-dom";
import { REDIRECTION_TIME } from "../../Data/Global_variables"

function RegsiterForm() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const [toastMsg, setToastMsg] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState("info");


    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        try {
            const res = await fetch(API.auth.register, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || (data.errors && data.errors[0]?.msg) || "Registration failed");
                setToastMsg("Registration Failed");
                setToastType("error");
                setShowToast(true);
                return;
            }
            setMessage(data.message || "Registration successful!");
            setToastMsg("Registration Successed!");
            setToastType("success");
            setShowToast(true);

            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");

            setTimeout(() => {
                navigate("/");
            }, REDIRECTION_TIME);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    }
    return (
        <form className="w-full flex flex-col p-5 text-left animate__animated animate__fadeIn" onSubmit={handleSubmit}>
            <h1 className="text-4xl [@media(max-width:745px)]:text-3xl font-bold text-center text-[var(--nav-text)] duration-300 transition-colors">Register</h1>
            <br />
            <label htmlFor="firstName" className="[@media(max-width:745px)]:text-xl text-[var(--nav-text)] duration-300 transition-colors">First Name</label>
            <input type="text" value={firstName} id="firstName" onChange={(e) => setFirstName(e.target.value)} placeholder="Enter your first name" autoComplete="given-name" className="p-2 mt-2 font-light text-xl [@media(max-width:745px)]:text-lg text-[var(--nav-hover)] border border-[var(--nav-text)] bg-[var(--nav-bg)] focus:border-[var(--nav-text)] focus:ring focus:ring-[var(--nav-hover)] outline-none" />
            <br />
            <label htmlFor="lastName" className="[@media(max-width:745px)]:text-xl text-[var(--nav-text)] duration-300 transition-colors">Last Name</label>
            <input type="text" value={lastName} id="lastName" onChange={(e) => setLastName(e.target.value)} placeholder="Enter your last name" autoComplete="family-name" className="p-2 mt-2 font-light text-xl [@media(max-width:745px)]:text-lg text-[var(--nav-hover)] border border-[var(--nav-text)] bg-[var(--nav-bg)] focus:border-[var(--nav-text)] focus:ring focus:ring-[var(--nav-hover)] outline-none" />
            <br />
            <label htmlFor="email" className="[@media(max-width:745px)]:text-xl text-[var(--nav-text)] duration-300 transition-colors">Email</label>
            <input type="email" value={email} id="email" onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" autoComplete="email" className="p-2 mt-2 font-light text-xl [@media(max-width:745px)]:text-lg text-[var(--nav-hover)] border border-[var(--nav-text)] bg-[var(--nav-bg)] focus:border-[var(--nav-text)] focus:ring focus:ring-[var(--nav-hover)] outline-none" />
            <br />
            <label htmlFor="password" className="[@media(max-width:745px)]:text-xl text-[var(--nav-text)] duration-300 transition-colors">Password</label>
            <input type="password" value={password} id="password" onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="new-password" className="p-2 mt-2 font-light text-xl [@media(max-width:745px)]:text-lg text-[var(--nav-hover)] border border-[var(--nav-text)] bg-[var(--nav-bg)] focus:border-[var(--nav-text)] focus:ring focus:ring-[var(--nav-hover)] outline-none" />
            <br />
            {message && <p className="text-green-500 text-lg">{message}</p>}
            {error && <p className="text-red-500 text-lg">{error}</p>}
            <br />
            <button className="font-bold py-3 rounded-sm bg-[var(--nav-text)] text-[var(--nav-bg)] text-xl [@media(max-width:745px)]:text-lg  hover:bg-[var(--nav-bg)] hover:text-[var(--nav-text)] hover:border hover:border-[var(--nav-hover)] transition-all duration-300">Register</button>
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
export default RegsiterForm
