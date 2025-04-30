import { API_BOOKINGS_URL } from "../auth/constants";
import { authFetch } from "../auth/key";

export async function getAllBookings() {
  const response = await authFetch(API_BOOKINGS_URL);
  if (!response.ok) throw new Error("Failed to fetch bookings");

  const data = await response.json();
  return data.data;
}
