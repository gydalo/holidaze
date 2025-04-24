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
}

interface VenueListProps {
    searchQuery: string;
  }

function VenueList({ searchQuery }: VenueListProps) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchVenues() {
      try {
        const data = await getVenues();
        setVenues(data);
      } catch {
        setError("Could not load venues. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchVenues();
  }, []);

  const filteredVenues = venues.filter((venue) =>
    venue.location?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    venue.location?.country?.toLowerCase().includes(searchQuery.toLowerCase())
  );


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
