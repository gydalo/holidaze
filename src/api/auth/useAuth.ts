import { useState } from "react";
import { login as loginUser } from "./login";
import { register as registerUser } from "./register";

interface AuthData {
  email: string;
  password: string;
  name?: string;
  bio?: string;
  avatar?: {
    url: string;
    alt?: string;
  };
  banner?: {
    url: string;
    alt?: string;
  };
  venueManager?: boolean;
}

export function useAuth() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function login(data: AuthData): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      await loginUser(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function register(data: AuthData): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      await registerUser(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
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