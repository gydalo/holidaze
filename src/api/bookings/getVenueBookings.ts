import { API_VENUES_URL } from "../auth/constants";
import { authFetch } from "../auth/key";

export async function getVenueBookings(venueId: string) {
  const response = await authFetch(
    `${API_VENUES_URL}/${venueId}?_bookings=true`
  );
  const data = await response.json();

  const bookings = data.data.bookings;

  if (!Array.isArray(bookings)) {
    throw new Error("Expected bookings data to be an array");
  }

  return bookings;
}
