import { API_VENUES_URL } from "../../api/auth/constants";

export async function getVenueById(id: string | undefined) {
  const response = await fetch(`${API_VENUES_URL}/${id}?_owner=true`);
  if (!response.ok) {
    throw new Error("Failed to fetch venue");
  }

  const json = await response.json();
  return json.data;
}
