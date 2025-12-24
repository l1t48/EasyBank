import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { ERROR_TIMEOUT_VALUE } from "../Data/Global_variables";

function ErrorModule({ type = "unauthorized" }) {
  const navigate = useNavigate();

  const content = {
    unauthorized: {
      title: "Unauthorized Access",
      code: "401",
    },
    sessionExpired: {
      title: "Session Expired",
      code: null,
    },
  };

  const { title, code } = content[type] || content["unauthorized"];

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, ERROR_TIMEOUT_VALUE);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="w-full h-screen bg-[var(--bg)] flex items-center justify-center flex-col">
      <h1 className="lg:text-4xl sm:text-3xl text-2xl font-bold text-[var(--nav-text)] animate__animated animate__zoomInUp animate__slow font-mono drop-shadow-[0_0_6px_var(--nav-text)]">
        {title}
        <FontAwesomeIcon icon={faLock} className="ml-1 text-[var(--nav-text)]" />
      </h1>

      {code && (
        <>
          <br />
          <br />
          <h1 className="lg:text-4xl sm:text-3xl text-2xl text-[var(--nav-text)] animate__animated animate__zoomInUp animate__slow font-mono drop-shadow-[0_0_4px_var(--nav-text)]">
            {code}
          </h1>
        </>
      )}

      <br />
      <br />
      <a
        className="sm:text-xl text-lg underline text-[var(--nav-text)] drop-shadow-[0_0_4px_var(--nav-text)] animate-pulse"
        href="/"
      >
        Back to Home
      </a>
    </div>
  );
}

export default ErrorModule;
