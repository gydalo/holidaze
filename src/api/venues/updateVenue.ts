import { API_VENUES_URL } from "../auth/constants";
import { authFetch } from "../auth/key";

export async function updateVenueById(id: string, updatedData: object) {
  const response = await authFetch(`${API_VENUES_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors?.[0]?.message || "Failed to update venue");
  }

  return await response.json();
}