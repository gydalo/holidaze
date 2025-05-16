import { useEffect, useState } from "react";
import { load, authFetch } from "../../api/auth/key";
import { API_PROFILE, API_VENUES_URL } from "../../api/auth/constants";

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
    id: string;
    name: string;
    owner: {
      name: string;
    };
  };
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}.${date.getFullYear().toString().slice(-2)}`;
};

const BookingsList = () => {
  const [customerUpcoming, setCustomerUpcoming] = useState<Booking[]>([]);
  const [customerPast, setCustomerPast] = useState<Booking[]>([]);
  const [venueUpcoming, setVenueUpcoming] = useState<Booking[]>([]);
  const [venuePast, setVenuePast] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const storedProfile = load<{
          data: { name: string; venueManager?: boolean };
        }>("profile");

        if (!storedProfile?.data) return;

        const { name: loggedInUser, venueManager } = storedProfile.data;
        const now = new Date();

        const customerResponse = await authFetch(
          `${API_PROFILE}/${loggedInUser}/bookings?_venue=true&_customer=true`
        );
        const customerJson = await customerResponse.json();
        const customerBookings: Booking[] = customerJson.data;

        const managerVenueBookings: Booking[] = [];

        if (venueManager) {
          const profileResponse = await authFetch(
            `${API_PROFILE}/${loggedInUser}?_venues=true`
          );
          const profileJson = await profileResponse.json();
          const ownedVenues = profileJson.data.venues || [];

          for (const venue of ownedVenues) {
            const venueId = venue.id;
            const venueResponse = await authFetch(
              `${API_VENUES_URL}/${venueId}?_bookings=true&_bookings_customer=true`
            );

            if (venueResponse.ok) {
              const venueData = await venueResponse.json();
              const bookings = (venueData.data.bookings || []).map(
                (booking: Booking) => ({
                  ...booking,
                  venue: {
                    id: venueId,
                    name: venueData.data.name,
                    owner: {
                      name: venueData.data.owner?.name || "Unknown",
                    },
                  },
                })
              );

              managerVenueBookings.push(...bookings);
            }
          }
        }

        setCustomerUpcoming(
          customerBookings.filter((b) => new Date(b.dateTo) >= now)
        );
        setCustomerPast(
          customerBookings.filter((b) => new Date(b.dateTo) < now)
        );
        setVenueUpcoming(
          managerVenueBookings.filter((b) => new Date(b.dateTo) >= now)
        );
        setVenuePast(
          managerVenueBookings.filter((b) => new Date(b.dateTo) < now)
        );
      } catch (err) {
        console.error("Failed to load bookings", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div className="">
      <section>
        <h2>Your Upcoming Bookings</h2>
        {customerUpcoming.length === 0 ? (
          <p>No upcoming bookings.</p>
        ) : (
          customerUpcoming.map((booking) => (
            <div key={booking.id}>
              <h3>{booking.venue?.name || "Unknown venue"}</h3>
              <p>
                {formatDate(booking.dateFrom)} - {formatDate(booking.dateTo)}
              </p>
              <p>Guests: {booking.guests}</p>
            </div>
          ))
        )}
      </section>

      <section>
        <h2>Your Past Bookings</h2>
        {customerPast.length === 0 ? (
          <p>No past bookings.</p>
        ) : (
          customerPast.map((booking) => (
            <div key={booking.id}>
              <h3>{booking.venue?.name || "Unknown venue"}</h3>
              <p>
                {formatDate(booking.dateFrom)} - {formatDate(booking.dateTo)}
              </p>
              <p>Guests: {booking.guests}</p>
            </div>
          ))
        )}
      </section>

      <section>
        <h2>Upcoming Bookings on Your Venues</h2>
        {venueUpcoming.length === 0 ? (
          <p>No upcoming bookings.</p>
        ) : (
          venueUpcoming.map((booking) => (
            <div key={booking.id}>
              <h3>{booking.venue?.name || "Unknown venue"}</h3>
              <p>
                {formatDate(booking.dateFrom)} - {formatDate(booking.dateTo)}
              </p>
              <p>Booked by: {booking.customer?.name || "Unknown"}</p>
              <p>Guests: {booking.guests}</p>
            </div>
          ))
        )}
      </section>

      <section>
        <h2>Past Bookings on Your Venues</h2>
        {venuePast.length === 0 ? (
          <p>No past bookings.</p>
        ) : (
          venuePast.map((booking) => (
            <div key={booking.id}>
              <h3>{booking.venue?.name || "Unknown venue"}</h3>
              <p>
                {formatDate(booking.dateFrom)} - {formatDate(booking.dateTo)}
              </p>
              <p>Booked by: {booking.customer?.name || "Unknown"}</p>
              <p>Guests: {booking.guests}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default BookingsList;
