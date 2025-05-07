import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProfile } from "../../api/auth/profile";

function OwnedVenues() {
  interface Venue {
    id: string;
    name: string;
    media?: { url: string; alt?: string }[];
    location?: { city?: string; country?: string };
  }

  const [ownedVenues, setOwnedVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOwnedVenues() {
      try {
        const storedProfile = localStorage.getItem("profile");
        const currentUser = storedProfile
          ? JSON.parse(storedProfile)?.data
          : null;

        if (!currentUser?.name) {
          setError("User not logged in");
          return;
        }

        const profile = await getProfile(currentUser.name);
        setOwnedVenues(profile.venues || []);
      } catch (err) {
        setError("Could not fetch owned venues");
      } finally {
        setLoading(false);
      }
    }

    fetchOwnedVenues();
  }, []);

  if (loading) return <p>Loading venues...</p>;
  if (error) return <p>{error}</p>;
  if (ownedVenues.length === 0) return <p>You don't own any venues yet.</p>;

  return (
    <div>
      <h2 className="">My Venues</h2>
      <div className="">
        {ownedVenues.map((venue) => (
          <Link key={venue.id} to={`/venue/${venue.id}`} className="">
            <div className="">
              <h3 className="">{venue.name}</h3>
            </div>
            <img
              src={
                venue.media?.[0]?.url || "/public/assets/images/placeholder.jpg"
              }
              alt={venue.media?.[0]?.alt || venue.name}
              className=""
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default OwnedVenues;
