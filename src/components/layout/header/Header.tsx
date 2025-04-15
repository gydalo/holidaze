import LoginForm from "../../forms/LoginForm";
import Modal from "../../common/PopUp";
import { useState } from "react";
import RegisterForm from "../../forms/RegisterForm";

function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const openModal = (mode: "login" | "register") => {
    setAuthMode(mode);
    setIsModalOpen(true);
  };

  return (
    <div className="">
      <button onClick={() => openModal("login")}>Login</button>
      <button onClick={() => openModal("register")}>Register</button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {authMode === "login" ? (
          <>
            <LoginForm />
            <p className="">
              Don't have an account?{" "}
              <button
                className=""
                onClick={() => setAuthMode("register")}
              >
                Register here
              </button>
            </p>
          </>
        ) : (
          <>
            <RegisterForm />
            <p className="">
              Already have an account?{" "}
              <button
                className=""
                onClick={() => setAuthMode("login")}
              >
                Login here
              </button>
            </p>
          </>
        )}
      </Modal>
    </div>
  );
}

export default Header;