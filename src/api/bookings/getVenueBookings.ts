import { API_BOOKINGS_URL } from "../auth/constants";
import { authFetch } from "../auth/key";

export async function getVenueBookings(venueId: string) {
  const response = await authFetch(`${API_BOOKINGS_URL}?_venue=true`);

  if (!response.ok) {
    throw new Error("Failed to fetch bookings");
  }

  const { data } = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Expected bookings data to be an array");
  }

  return data.filter((booking) => booking.venue?.id === venueId);
}