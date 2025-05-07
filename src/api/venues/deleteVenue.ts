import { authFetch } from "../auth/key";
import { API_VENUES_URL } from "../auth/constants";

export async function deleteVenueById(id: string): Promise<void> {
    const response = await authFetch(`${API_VENUES_URL}/${id}`, {
      method: "DELETE",
    });
  
    if (!response.ok) {
      throw new Error("Failed to delete venue");
    }
  }