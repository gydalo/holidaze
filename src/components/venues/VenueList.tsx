import { useEffect, useState } from "react";
import { getVenues } from "../../api/venues/getVenues";
import { Link } from "react-router-dom";
import ReusableButton from "../ReusableButton";
import { getAllBookings } from "../../api/bookings/getAllBookings";
import { isLoggedIn } from "../../api/auth/key";

interface Venue {
  id: string;
  name: string;
  location: { country: string; city: string };
  description: string;
  media: { url: string; alt: string }[];
  price: number;
  rating: number;
}

interface Booking {
  venueId: string;
  dateFrom: string;
  dateTo: string;
}

interface VenueListProps {
  searchQuery: string;
  selectedDates: [Date | null, Date | null];
}

function VenueList({ searchQuery, selectedDates }: VenueListProps) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const venueData = await getVenues();
        setVenues(venueData);
  
        if (isLoggedIn()) {
          const bookingData = await getAllBookings();
          setBookings(bookingData);
        }
      } catch {
        setError("Could not load data.");
      } finally {
        setLoading(false);
      }
    }
  
    fetchData();
  }, []);
  

  const [from, to] = selectedDates;
  const filteredVenues = venues.filter((venue) => {
    const matchesSearch =
      venue.location?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.location?.country?.toLowerCase().includes(searchQuery.toLowerCase());
  
    if (!from || !to) return matchesSearch;
  
    if (bookings.length === 0) return matchesSearch;
  
    const venueBookings = bookings.filter((b) => b.venueId === venue.id);
  
    const isBookedInRange = venueBookings.some((b) => {
      const bFrom = new Date(b.dateFrom);
      const bTo = new Date(b.dateTo);
      return from <= bTo && to >= bFrom;
    });
  
    return matchesSearch && !isBookedInRange;
  });

  if (loading) return <p>Loading venues...</p>;
  if (error) return <p className="">{error}</p>;

  return (
    <div className="">
      {filteredVenues.map((venue) => (
        <div key={venue.id} className="">
          <img
            src={venue.media[0]?.url || "/public/assets/images/placeholder.jpg"}
            alt={venue.media[0]?.alt || "Venue image"}
            className=""
          />
          <h3 className="">{venue.name}</h3>
          <p>Rating: {venue.rating}</p>
          <p>
            {venue.location.city}, {venue.location.country}
          </p>
          <p>{venue.price} NOK/ night</p>
          <Link to={`/venue/${venue.id}`}>
            <ReusableButton>Book Venue</ReusableButton>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default VenueList;
