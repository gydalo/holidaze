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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDates, setBookingDates] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [confirmedBookingDates, setConfirmedBookingDates] = useState<
    [Date | null, Date | null]
  >([null, null]);

  const storedProfile = localStorage.getItem("profile");
  const currentUser = storedProfile ? JSON.parse(storedProfile)?.data : null;
  const isOwner = venue && currentUser?.name === venue.owner.name;

  useEffect(() => {
    async function fetchVenue() {
      if (!id) return;

      try {
        const data = await getVenueById(id);
        setVenue(data);
      } catch {
        setError("Could not fetch venue.");
      } finally {
        setLoading(false);
      }
    }

    fetchVenue();
  }, [id]);

  const handleDeleteConfirmed = async () => {
    if (!id) return;

    try {
      await deleteVenueById(id);
      navigate(`/profile/${currentUser.name}`);
    } catch {
      setDeleteError("Something went wrong while deleting the venue.");
    } finally {
      setShowConfirmModal(false);
    }
  };

  const handleBookingSuccess = (from: string, to: string) => {
    setConfirmedBookingDates([new Date(from), new Date(to)]);
    setShowConfirmation(true);
  };

  if (loading) return <p>Loading venue...</p>;
  if (error) return <p>{error}</p>;
  if (!venue) return <p>Venue not found</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {venue.media?.map((img, idx) => (
          <img
            key={idx}
            src={img.url}
            alt={img.alt || venue.name}
            className="w-full h-64 object-cover rounded"
          />
        ))}
      </div>
      <p className="text-lg font-medium mb-4">
        {venue.location.city}, {venue.location.country}
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Side */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{venue.name}</h1>
          <p>{venue.description}</p>
          <div>
            <h2 className="font-semibold">Amenities</h2>
            <ul className="list-disc ml-6">
              <li>Wifi: {venue.meta.wifi ? "Yes" : "No"}</li>
              <li>Breakfast: {venue.meta.breakfast ? "Yes" : "No"}</li>
              <li>Pets allowed: {venue.meta.pets ? "Yes" : "No"}</li>
              <li>Parking: {venue.meta.parking ? "Yes" : "No"}</li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold">Address</h2>
            <p>
              {venue.location.address}, {venue.location.zip},{" "}
              {venue.location.city}, {venue.location.country}
            </p>
          </div>
          <div>
            <h2 className="font-semibold">Owner</h2>
            <p>
              {venue.owner.name} ({venue.owner.email})
            </p>
          </div>

          {isOwner && (
            <div className="space-x-4">
              <ReusableButton onClick={() => setEditModalOpen(true)}>
                Edit Venue
              </ReusableButton>
              <ReusableButton onClick={() => setShowConfirmModal(true)}>
                Delete Venue
              </ReusableButton>
              {deleteError && <p className="text-red-600">{deleteError}</p>}
            </div>
          )}
        </div>

        {/* Right Side */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Booking</h2>
          <p className="text-lg">{venue.price} NOK / night</p>
          {!isOwner && (
            <VenueBooking
              venueId={venue.id}
              price={venue.price}
              maxGuests={venue.maxGuests}
              selectedDates={bookingDates}
              onDateChange={setBookingDates}
              onBookingSuccess={handleBookingSuccess}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Delete Venue"
        message="Are you sure you want to delete this venue? This action cannot be undone."
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setShowConfirmModal(false)}
      />

      {confirmedBookingDates[0] &&
        confirmedBookingDates[1] &&
        showConfirmation && (
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
            bookingDates={{
              from: confirmedBookingDates[0].toISOString(),
              to: confirmedBookingDates[1].toISOString(),
            }}
          />
        )}
      <EditVenueModal
        venueId={venue.id}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  );
}

export default VenueDetails;
