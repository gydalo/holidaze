import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
    <div className=" bg-white shadow-md sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 flex justify-between items-center p-2 ">
        <div>
          <Link to={"/"}>
            <img
              className="w-20"
              src="/public/assets/images/holidaze-logo.png"
              alt=""
            />
          </Link>
        </div>
        <div className="flex gap-12">
          {!loggedIn && (
            <>
              <button
                className="hover:underline hover:underline-offset-2 cursor-pointer text-sm"
                onClick={() => openModal("login")}
              >
                Login
              </button>
              <button
                className="hover:underline hover:underline-offset-2 cursor-pointer text-sm"
                onClick={() => openModal("register")}
              >
                Register
              </button>
            </>
          )}

          {loggedIn && (
            <>
              <button
                className="hover:underline hover:underline-offset-2 cursor-pointer text-sm"
                onClick={goToProfile}
              >
                Profile
              </button>
              <LogoutButton />
            </>
          )}
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {authMode === "login" ? (
            <>
              <LoginForm />
              <p className="text-center pt-4">
                Don't have an account? <br />
                <a
                  className="hover:underline hover:underline-offset-2 cursor-pointer"
                  onClick={() => setAuthMode("register")}
                >
                  Register here
                </a>
              </p>
            </>
          ) : (
            <>
              <RegisterForm />
              <p className="text-center pt-4">
                Already have an account? <br />
                <a
                  className="hover:underline hover:underline-offset-2 cursor-pointer"
                  onClick={() => setAuthMode("login")}
                >
                  Login here
                </a>
              </p>
            </>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default Header;
