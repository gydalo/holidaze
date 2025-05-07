import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getVenueById } from "../api/venues/getVenueById";
import ReusableButton from "../components/ReusableButton";
import Calendar from "../components/Calendar";
import { deleteVenueById } from "../api/venues/deleteVenue";
import ConfirmModal from "../components/forms/ConfirmModal";
import EditVenueModal from "../components/forms/EditVenue";

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
  const [deleteError, setDeleteError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const storedProfile = localStorage.getItem("profile");
  const currentUser = storedProfile ? JSON.parse(storedProfile)?.data : null;
  const isOwner = venue && currentUser?.name === venue.owner.name;

  const navigate = useNavigate();

  const handleDeleteConfirmed = async () => {
    try {
      await deleteVenueById(id);
      navigate(`/profile/${currentUser.name}`);
    } catch (error) {
      console.error("Failed to delete venue:", error);
      setDeleteError("Something went wrong while deleting the venue.");
    } finally {
      setShowConfirmModal(false);
    }
  };

  const handleDeleteClick = () => {
    setShowConfirmModal(true);
  };

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
          {!isOwner && <ReusableButton>Book Venue</ReusableButton>}

          {isOwner && (
            <div className="">
              <ReusableButton onClick={() => setEditModalOpen(true)}>
                Edit Venue
              </ReusableButton>

              <EditVenueModal
                venueId={venue.id}
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                onSuccess={() => {}}
              />
            </div>
          )}
          {isOwner && (
            <div className="">
              <ReusableButton onClick={handleDeleteClick}>
                Delete Venue
              </ReusableButton>
              {deleteError && <p className="">{deleteError}</p>}
            </div>
          )}
        </div>
      </div>
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Delete Venue"
        message="Are you sure you want to delete this venue? This action cannot be undone."
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
}

export default VenueDetails;
