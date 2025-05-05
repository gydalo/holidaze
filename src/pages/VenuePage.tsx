import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getVenueById } from "../api/venues/getVenueById";
import ReusableButton from "../components/ReusableButton";
import Calendar from "../components/Calendar";

type Venue = {
  id: string;
  name: string;
  description: string;
  media: { url: string; alt?: string }[];
  price: number;
  maxGuests: number;
  rating: number;
  meta: {
    wifi: boolean;
    parking: boolean;
    breakfast: boolean;
    pets: boolean;
  };
  location: {
    address: string;
    city: string;
    zip: string;
    country: string;
    continent: string;
    lat: number;
    lng: number;
  };
  owner: {
    name: string;
    email: string;
    avatar?: {
      url: string;
      alt?: string;
    };
    banner?: {
      url: string;
      alt?: string;
    };
  };
};

function VenueDetails() {
  const { id } = useParams();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const handleDateChange = (date: Date) => {
    console.log("Selected date:", date.toISOString());
  };

  useEffect(() => {
    async function fetchVenue() {
      try {
        const data = await getVenueById(id);
        setVenue(data);
      } catch (error) {
        setError("Could not fetch venue");
      } finally {
        setLoading(false);
      }
    }

    fetchVenue();
  }, [id]);

  if (loading) return <p>Loading venue...</p>;
  if (error) return <p>{error}</p>;
  if (!venue) return <p>Venue not found</p>;

  return (
    <div className="">
      <div className="">
        <div className="">
          {venue.media?.[0]?.url && (
            <img
              src={
                venue.media[0].url || "/public/assets/images/placeholder.jpg"
              }
              alt={venue.media[0]?.alt || venue.name}
              className=""
            />
          )}
        </div>
        <p>
          {venue.location.city}, {venue.location.country},{" "}
          {venue.location.continent}
        </p>
        <p>{venue.rating}</p>
      </div>
      <div className="">
        <h1 className="">{venue.name}</h1>
        <p className="">{venue.description}</p>
        <p>Venue owner: {venue.owner.name}</p>
        <p>Wifi: {venue.meta.wifi ? "Yes" : "No"}</p>
        <p>Breakfast: {venue.meta.breakfast ? "Yes" : "No"}</p>
        <p>Pets allowed: {venue.meta.pets ? "Yes" : "No"}</p>
        <p>Parking: {venue.meta.parking ? "Yes" : "No"}</p>
      </div>
      <div className="">
        <h1>Booking</h1>
        <div className="">
          <p>{venue.price} NOK/ night</p>
        </div>
        <div>
          <Calendar onDateChange={handleDateChange} />
        </div>
        <div className="">
          <h1>Address</h1>
          <p>
            {venue.location.address}, {venue.location.zip},{" "}
            {venue.location.city}, {venue.location.country}
          </p>
        </div>
        <ReusableButton>Book Venue</ReusableButton>
      </div>
    </div>
  );
}

export default VenueDetails;
