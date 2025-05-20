import { useState } from "react";
import { login as loginUser } from "./login";
import { register as registerUser } from "./register";

interface RegisterData {
  name: string;
  email: string;
  password: string;
  venueManager?: boolean;
}

interface LoginData {
  email: string;
  password: string;
}

export function useAuth() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function login(data: LoginData): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      await loginUser(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        throw err;
    } else {
      setError("Something went wrong.");
      throw new Error("Something went wrong.");
    }
  } finally {
    setLoading(false);
  }
}

  async function register(data: RegisterData): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      await registerUser(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.clear();
    window.location.href = "/";
  }

  return { login, register, logout, loading, error };
}
