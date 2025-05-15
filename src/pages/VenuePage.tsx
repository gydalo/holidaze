import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getVenueById } from "../api/venues/getVenueById";
import { deleteVenueById } from "../api/venues/deleteVenue";
import ReusableButton from "../components/ReusableButton";
import ConfirmModal from "../components/forms/ConfirmModal";
import EditVenueModal from "../components/forms/EditVenue";
import VenueBooking from "../components/bookings/VenueBookings";
import BookingConfirmation from "../components/forms/BookingConfirmation";

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
    avatar?: { url: string; alt?: string };
    banner?: { url: string; alt?: string };
  };
};

function VenueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDates, setBookingDates] = useState<{
    from: string;
    to: string;
  } | null>(null);

  const storedProfile = localStorage.getItem("profile");
  const currentUser = storedProfile ? JSON.parse(storedProfile)?.data : null;
  const isOwner = venue && currentUser?.name === venue.owner.name;

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

  const handleBookingSuccess = (from: string, to: string) => {
    setBookingDates({ from, to });
    setShowConfirmation(true);
  };

  if (loading) return <p>Loading venue...</p>;
  if (error) return <p>{error}</p>;
  if (!venue) return <p>Venue not found</p>;

  return (
    <div className="">
      <div className="">
        {venue.media?.[0]?.url && (
          <img
            src={venue.media[0].url}
            alt={venue.media[0].alt || venue.name}
            className=""
          />
        )}
        <p>
          {venue.location.city}, {venue.location.country},{" "}
          {venue.location.continent}
        </p>
        <p>Rating: {venue.rating}</p>
      </div>

      <div className="">
        <h1>{venue.name}</h1>
        <p>{venue.description}</p>
        <p>Venue owner: {venue.owner.name}</p>
        <p>Wifi: {venue.meta.wifi ? "Yes" : "No"}</p>
        <p>Breakfast: {venue.meta.breakfast ? "Yes" : "No"}</p>
        <p>Pets allowed: {venue.meta.pets ? "Yes" : "No"}</p>
        <p>Parking: {venue.meta.parking ? "Yes" : "No"}</p>
      </div>

      <div className="">
        <h2>Booking</h2>
        <p>{venue.price} NOK / night</p>
        {!isOwner && (
          <VenueBooking
            venueId={venue.id}
            price={venue.price}
            maxGuests={venue.maxGuests}
            onBookingSuccess={handleBookingSuccess}
          />
        )}
      </div>

      <div className="">
        <h2>Address</h2>
        <p>
          {venue.location.address}, {venue.location.zip}, {venue.location.city},{" "}
          {venue.location.country}
        </p>
      </div>

      {isOwner && (
        <>
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

          <div className="">
            <ReusableButton onClick={() => setShowConfirmModal(true)}>
              Delete Venue
            </ReusableButton>
            {deleteError && <p className="">{deleteError}</p>}
          </div>
        </>
      )}

      <ConfirmModal
        isOpen={showConfirmModal}
        title="Delete Venue"
        message="Are you sure you want to delete this venue? This action cannot be undone."
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setShowConfirmModal(false)}
      />

      {bookingDates && (
        <BookingConfirmation
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          venue={{
            name: venue.name,
            media: venue.media,
            address: venue.location.address,
            city: venue.location.city,
            zip: venue.location.zip,
            country: venue.location.country,
            owner: venue.owner,
          }}
          bookingDates={bookingDates}
        />
      )}
    </div>
  );
}

export default VenueDetails;
