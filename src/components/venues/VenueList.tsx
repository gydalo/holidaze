import { useEffect, useState } from "react";
import { getVenues } from "../../api/venues/getVenues";
import { Link } from "react-router-dom";
import ReusableButton from "../ReusableButton";

interface Venue {
  id: string;
  name: string;
  location: { country: string; city: string };
  description: string;
  media: { url: string; alt: string }[];
  price: number;
  rating: number;
  bookings?: {
    dateFrom: string;
    dateTo: string;
  }[];
}

interface VenueListProps {
  searchQuery: string;
  selectedDates: [Date | null, Date | null];
}

function VenueList({ searchQuery, selectedDates }: VenueListProps) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const venueData = await getVenues();
        setVenues(venueData);
      } catch {
        setError("Could not load data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const normalizeDate = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
      .toISOString()
      .split("T")[0];
  };

  const [normalizedFrom, normalizedTo] = selectedDates.map((date) =>
    date ? normalizeDate(date) : null
  );

  const filteredVenues = venues.filter((venue) => {
    const matchesSearch =
      venue.location?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.location?.country
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    if (!normalizedFrom || !normalizedTo) return matchesSearch;

    const venueBookings = venue.bookings || [];

    const isBookedInRange = venueBookings.some((b) => {
      const bFromString = normalizeDate(new Date(b.dateFrom));
      const bToString = normalizeDate(new Date(b.dateTo));

      return !(normalizedTo < bFromString || normalizedFrom > bToString);
    });

    return matchesSearch && !isBookedInRange;
  });

  if (loading) return <p>Loading venues...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {filteredVenues.map((venue) => (
        <div key={venue.id}>
          <img
            src={venue.media[0]?.url || "/public/assets/images/placeholder.jpg"}
            alt={venue.media[0]?.alt || "Venue image"}
          />
          <h3>{venue.name}</h3>
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
