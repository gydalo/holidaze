import { useEffect, useState } from "react";
import { getAllBookings } from "../../api/bookings/getAllBookings";

type Booking = {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  customer?: {
    name: string;
    email: string;
  };
  venue?: {
    name: string;
  };
};

const BookingsList = () => {
  const [upcoming, setUpcoming] = useState<Booking[]>([]);
  const [past, setPast] = useState<Booking[]>([]);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const data = await getAllBookings();
        const now = new Date();

        const upcomingBookings = data.filter((b) => new Date(b.dateTo) >= now);
        const pastBookings = data.filter((b) => new Date(b.dateTo) < now);

        setUpcoming(upcomingBookings);
        setPast(pastBookings);
      } catch (err) {
        console.error("Could not load bookings:", err);
      }
    }

    fetchBookings();
  }, []);

  return (
    <div>
      <h2>Upcoming bookings</h2>
      {upcoming.length === 0 && <p>No upcoming bookings.</p>}
      {upcoming.map((booking) => (
        <div key={booking.id}>
          <p>Venue: {booking.venue?.name}</p>
          <p>From: {booking.dateFrom}</p>
          <p>To: {booking.dateTo}</p>
          <p>Guest: {booking.customer?.name} ({booking.customer?.email})</p>
        </div>
      ))}

      <h2>Past bookings</h2>
      {past.length === 0 && <p>No past bookings.</p>}
      {past.map((booking) => (
        <div key={booking.id}>
          <p>Venue: {booking.venue?.name}</p>
          <p>From: {booking.dateFrom}</p>
          <p>To: {booking.dateTo}</p>
          <p>Guest: {booking.customer?.name} ({booking.customer?.email})</p>
        </div>
      ))}
    </div>
  );
};

export default BookingsList;