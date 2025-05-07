import { API_VENUES_URL } from "../auth/constants";
import { authFetch } from "../auth/key";

export async function createVenue(data: any) {
  const response = await authFetch(API_VENUES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors?.[0]?.message || "Failed to create venue");
  }

  return await response.json();
}
