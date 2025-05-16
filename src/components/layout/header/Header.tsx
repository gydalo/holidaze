import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../forms/LoginForm";
import RegisterForm from "../../forms/RegisterForm";
import Modal from "../../common/PopUp";
import LogoutButton from "../../LogoutButton";
import { isLoggedIn, load } from "../../../api/auth/key";

function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [loggedIn, setLoggedIn] = useState(false);
  const [profileName, setProfileName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInStatus = isLoggedIn();
    setLoggedIn(loggedInStatus);

    if (loggedInStatus) {
      const profile = load<{ data: { name: string } }>("profile");
      const nameFromProfile = profile?.data.name || null;
      setProfileName(nameFromProfile);
    }
  }, []);

  const openModal = (mode: "login" | "register") => {
    setAuthMode(mode);
    setIsModalOpen(true);
  };

  const goToProfile = () => {
    if (profileName) {
      navigate(`/profile/${profileName}`);
    }
  };

  return (
    <div className="">
      {!loggedIn && (
        <>
          <button onClick={() => openModal("login")}>Login</button>
          <button onClick={() => openModal("register")}>Register</button>
        </>
      )}

      {loggedIn && (
        <>
          <button onClick={goToProfile}>My Profile</button>
          <LogoutButton />
        </>
      )}

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
