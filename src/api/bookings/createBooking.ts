import { authFetch } from "../auth/key";
import { API_BOOKINGS_URL } from "../auth/constants";

interface BookingData {
  dateFrom: string;
  dateTo: string;
  guests: number;
  venueId: string;
}

export async function createBooking(data: BookingData) {
  const response = await authFetch(API_BOOKINGS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors?.[0]?.message || "Failed to book venue");
  }

  return await response.json();
}