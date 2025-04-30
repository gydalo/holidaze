import { API_BOOKINGS_URL } from "../auth/constants"; 

type Booking = {
    id: string;
    dateFrom: string;
    dateTo: string;
    guests: number;
    venue: {
      id: string;
      name: string;
    };
  };
  
  export async function getVenueBookings(venueId: string): Promise<Booking[]> {
    const response = await fetch(`${API_BOOKINGS_URL}`);
    if (!response.ok) throw new Error("Failed to fetch bookings");
  
    const { data } = await response.json();
    return data.filter((booking: Booking) => booking.venue.id === venueId);
  }