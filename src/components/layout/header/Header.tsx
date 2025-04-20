import LoginForm from "../../forms/LoginForm";
import Modal from "../../common/PopUp";
import { useState, useEffect } from "react";
import RegisterForm from "../../forms/RegisterForm";
import LogoutButton from "../../LogoutButton";
import { isLoggedIn } from "../../../api/auth/key";

function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, [isModalOpen]);

  const openModal = (mode: "login" | "register") => {
    setAuthMode(mode);
    setIsModalOpen(true);
  };

  return (
    <div className="">
      {!loggedIn && (
        <>
          <button onClick={() => openModal("login")}>Login</button>
          <button onClick={() => openModal("register")}>Register</button>
        </>
      )}

      {loggedIn && <LogoutButton />}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {authMode === "login" ? (
          <>
            <LoginForm />
            <p>
              Don't have an account?{" "}
              <button onClick={() => setAuthMode("register")}>
                Register here
              </button>
            </p>
          </>
        ) : (
          <>
            <RegisterForm />
            <p>
              Already have an account?{" "}
              <button onClick={() => setAuthMode("login")}>Login here</button>
            </p>
          </>
        )}
      </Modal>
    </div>
  );
}

export default Header;