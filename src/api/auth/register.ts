import { API_AUTH_REGISTER } from "./constants";

interface RegisterData {
  name: string;
  email: string;
  password: string;
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

const method = "POST";

export async function register(profile: RegisterData): Promise<void> {
  const registerURL = API_AUTH_REGISTER;
  const body = JSON.stringify(profile);

  const response = await fetch(registerURL, {
    headers: {
      "Content-Type": "application/json",
    },
    method,
    body,
  });

  const result = await response.json();

  if (!response.ok) {
    const errorMessage = result?.errors?.[0]?.message || result.message || "Registration failed";
    throw new Error(errorMessage);
  }

  console.log("Registration success:", result);
}