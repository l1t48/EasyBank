import { useState } from "react";
import LoginForm from "../Components/Authuntcation-Components/LoginForm";
import RegisterForm from "../Components/Authuntcation-Components/RegisterForm";

function AuthPage() {
    const [selectedForm, setSelectedForm] = useState("login");

    function handleFormSwitch(formType) {
        if (formType === selectedForm)
            return;
        setSelectedForm(formType);
    }

    function getButtonClass(formType) {
        let baseClass = "px-4 py-2 rounded font-medium transition-colors duration-500 w-[48%]";

        if (selectedForm === formType) {
            return baseClass + " bg-[var(--nav-text)] text-[var(--nav-bg)]";
        } else {
            return baseClass + " text-[var(--nav-text)] bg-[var(--nav-bg)] hover:bg-[var(--nav-text)] hover:text-[var(--nav-bg)]";
        }
    }

    return (
        <div className='w-full text-center text-2xl font-bold'>
            <div className="min-h-screen flex flex-col items-center justify-center w-full mt-5">
                <div className="w-full max-w-2xl shadow-lg rounded-lg p-3 bg-[var(--nav-bg)]">
                    <div className="flex items-center justify-around mt-3">
                        <button onClick={() => handleFormSwitch("login")} className={getButtonClass("login")}>
                            Login
                        </button>
                        <button onClick={() => handleFormSwitch("register")} className={getButtonClass("register")}>
                            Register
                        </button>
                    </div>
                    <div className="mt-4">
                        {selectedForm === "login" && <LoginForm />}
                        {selectedForm === "register" && <RegisterForm />}
                    </div>
                </div>
            </div>
        </div >
    );
}

export default AuthPage;
