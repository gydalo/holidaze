import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { load, authFetch } from "../../api/auth/key";
import { API_PROFILE, API_VENUES_URL } from "../../api/auth/constants";
import ReusableButton from "../ReusableButton";
import CustomerBookingsModal from "../forms/CustomerBookingsModal";
import VenueBookingsModal from "../forms/VenueBookingsModal";

interface Booking {
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
    media?: { url: string; alt?: string }[];
    owner: {
      name: string;
    };
  };
}

interface RawBooking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  customer?: {
    name: string;
    email: string;
  };
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}.${date.getFullYear().toString().slice(-2)}`;
};

const BookingCard = ({ booking }: { booking: Booking }) => (
  <Link
    to={`/venue/${booking.venue?.id}`}
    className="border rounded-xl shadow-sm p-4 bg-white flex flex-col gap-1 text-left hover:bg-gray-50 transition"
  >
    <h3 className="">{booking.venue?.name || "Unknown venue"}</h3>
    <p className="text-sm text-gray-600">
      {formatDate(booking.dateFrom)} - {formatDate(booking.dateTo)}
    </p>
    <p className="text-sm">Guests: {booking.guests}</p>
    {booking.customer && (
      <p className="text-sm">Booked by: {booking.customer.name}</p>
    )}
  </Link>
);

const BookingsList = () => {
  const [customerUpcoming, setCustomerUpcoming] = useState<Booking[]>([]);
  const [customerPast, setCustomerPast] = useState<Booking[]>([]);
  const [venueUpcoming, setVenueUpcoming] = useState<Booking[]>([]);
  const [venuePast, setVenuePast] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState<string | null>(null);

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
          const ownedVenues: {
            id: string;
            name: string;
            media?: { url: string; alt?: string }[];
            owner?: { name: string };
          }[] = profileJson.data.venues || [];

          for (const venue of ownedVenues) {
            const venueId = venue.id;
            const venueResponse = await authFetch(
              `${API_VENUES_URL}/${venueId}?_bookings=true&_bookings_customer=true`
            );
            if (venueResponse.ok) {
              const venueData = await venueResponse.json();
              const bookings: Booking[] = (venueData.data.bookings || []).map(
                (booking: RawBooking): Booking => {
                  return {
                    id: booking.id,
                    dateFrom: booking.dateFrom,
                    dateTo: booking.dateTo,
                    guests: booking.guests,
                    customer: booking.customer,
                    venue: {
                      id: venueId,
                      name: venueData.data.name,
                      media: venueData.data.media,
                      owner: { name: venueData.data.owner?.name || "Unknown" },
                    },
                  };
                }
              );
              managerVenueBookings.push(...bookings);
            }
          }
        }

        setCustomerUpcoming(
          customerBookings.filter((b: Booking) => new Date(b.dateTo) >= now)
        );
        setCustomerPast(
          customerBookings.filter((b: Booking) => new Date(b.dateTo) < now)
        );
        setVenueUpcoming(
          managerVenueBookings.filter((b: Booking) => new Date(b.dateTo) >= now)
        );
        setVenuePast(
          managerVenueBookings.filter((b: Booking) => new Date(b.dateTo) < now)
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

  const shouldShowCustomer =
    customerUpcoming.length > 0 || customerPast.length > 0;
  const shouldShowVenue = venueUpcoming.length > 0 || venuePast.length > 0;

  return (
    <div className="space-y-6">
      <div
        className={`grid gap-6 ${
          shouldShowVenue ? "md:grid-cols-2" : "grid-cols-1 justify-center"
        }`}
      >
        {shouldShowVenue && (
          <div className="space-y-2 col-span-1">
            <h3 className="">Upcoming Venue Bookings</h3>
            <div className="grid gap-4">
              {(venueUpcoming.length > 0 ? venueUpcoming : venuePast)
                .slice(0, 4)
                .map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
            </div>
            {venueUpcoming.length + venuePast.length > 4 && (
              <div className="text-center">
                <ReusableButton onClick={() => setModalOpen("venue")}>
                  See All Bookings on My Venues
                </ReusableButton>
              </div>
            )}
          </div>
        )}

        {shouldShowCustomer && (
          <div
            className={`space-y-2 col-span-1 ${
              shouldShowVenue ? "md:col-start-2" : "max-w-xl w-full"
            }`}
          >
            <h3 className="">My Upcoming Bookings</h3>
            <div className="grid gap-4">
              {(customerUpcoming.length > 0 ? customerUpcoming : customerPast)
                .slice(0, 4)
                .map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
            </div>
            {customerUpcoming.length + customerPast.length > 4 && (
              <div className="text-center pt-6">
                <ReusableButton onClick={() => setModalOpen("customer")}>
                  See All Bookings
                </ReusableButton>
              </div>
            )}
          </div>
        )}
      </div>

      <CustomerBookingsModal
        isOpen={modalOpen === "customer"}
        onClose={() => setModalOpen(null)}
        upcoming={customerUpcoming}
        past={customerPast}
      />

      <VenueBookingsModal
        isOpen={modalOpen === "venue"}
        onClose={() => setModalOpen(null)}
        upcoming={venueUpcoming}
        past={venuePast}
      />
    </div>
  );
};

export default BookingsList;
