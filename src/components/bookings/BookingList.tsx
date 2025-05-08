import { useEffect, useState } from "react";
import { getAllBookings } from "../../api/bookings/getAllBookings";
import { load } from "../../api/auth/key";

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

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}.${month}.${year}`;
};

const BookingsList = () => {
  const [upcoming, setUpcoming] = useState<Booking[]>([]);
  const [past, setPast] = useState<Booking[]>([]);

  useEffect(() => {
    const profile = load<{ data: { name: string; bookings: Booking[] } }>(
      "profile"
    );

    if (!profile?.data) {
      console.warn("No profile found");
      return;
    }

    const allBookings = profile.data.bookings || [];
    const now = new Date();

    const upcomingBookings = allBookings.filter(
      (b) => new Date(b.dateTo) >= now
    );
    const pastBookings = allBookings.filter((b) => new Date(b.dateTo) < now);

    setUpcoming(upcomingBookings);
    setPast(pastBookings);
  }, []);

  return (
    <div>
      <h2>Upcoming bookings</h2>
      {upcoming.length === 0 && <p>No upcoming bookings.</p>}
      {upcoming.map((booking) => (
        <div key={booking.id}>
          <h3>{booking.venue?.name}</h3>
          <p>
            {" "}
            {formatDate(booking.dateFrom)} - {formatDate(booking.dateTo)}
          </p>
          <p>
            Guest: {booking.guests}
          </p>
        </div>
      ))}

      <h2>Past bookings</h2>
      {past.length === 0 && <p>No past bookings.</p>}
      {past.map((booking) => (
        <div key={booking.id}>
          <h3>{booking.venue?.name}</h3>
          <p>
            {formatDate(booking.dateFrom)} - {formatDate(booking.dateTo)}
          </p>
          <p>
            Guest: {booking.guests}
          </p>
        </div>
      ))}
    </div>
  );
};

export default BookingsList;
