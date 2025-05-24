import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getVenueById } from "../api/venues/getVenueById";
import { deleteVenueById } from "../api/venues/deleteVenue";
import ReusableButton from "../components/ReusableButton";
import ConfirmModal from "../components/forms/ConfirmModal";
import EditVenueModal from "../components/forms/EditVenue";
import VenueBooking from "../components/bookings/VenueBookings";
import BookingConfirmation from "../components/forms/BookingConfirmation";
import Modal from "../components/common/PopUp";

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
  const [bookingRefreshKey, setBookingRefreshKey] = useState(0);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageModalOpen, setImageModalOpen] = useState(false);

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
      {/* Image Layout */}
      <div className="mb-6">
        {venue.media.length === 1 ? (
          <img
            src={venue.media[0].url}
            alt={venue.media[0].alt || venue.name}
            className="w-[900px] h-[400px] object-cover rounded-md"
          />
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <img
                src={venue.media[selectedImageIndex].url}
                alt={venue.media[selectedImageIndex].alt || venue.name}
                className="w-[900px] h-[400px] object-cover object-center rounded-md"
              />
            </div>
            <div className="flex flex-col gap-2">
              {venue.media.slice(0, 3).map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt={img.alt || venue.name}
                  onClick={() => {
                    setSelectedImageIndex(index);
                    if (venue.media.length > 4) {
                      setImageModalOpen(true);
                    }
                  }}
                  className="w-full h-[120px] object-cover object-center rounded-md cursor-pointer hover:opacity-80 transition"
                />
              ))}
              {venue.media.length > 4 && (
                <button
                  onClick={() => setImageModalOpen(true)}
                  className="text-sm text-blue-600 mt-1 hover:underline"
                >
                  View all {venue.media.length} images
                </button>
              )}
            </div>
          </div>
        )}

        <p className="text-lg font-medium mb-4">
          {venue.location.city}, {venue.location.country}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-6 md:grid-cols-8 md:gap-24">
        <div className="space-y-4 sm:col-start-2 col-sm:start-2 sm:col-end-6 md:col-span-5">
          <h1 className="text-xl">{venue.name}</h1>
          <p>{venue.description}</p>
          <div>
            <h2 className="">Amenities</h2>
            <ul className="list-disc ml-6">
              <li>Wifi: {venue.meta.wifi ? "Yes" : "No"}</li>
              <li>Breakfast: {venue.meta.breakfast ? "Yes" : "No"}</li>
              <li>Pets allowed: {venue.meta.pets ? "Yes" : "No"}</li>
              <li>Parking: {venue.meta.parking ? "Yes" : "No"}</li>
            </ul>
          </div>
          <div>
            <h2 className="">Address</h2>
            <p>
              {venue.location.address}, {venue.location.zip},{" "}
              {venue.location.city}, {venue.location.country}
            </p>
          </div>
          <div>
            <h2 className="">Owner</h2>
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

        <div className="space-y-4 sm:col-start-2 sm:col-end-6 mt-12 md:mt-0 md:col-span-3">
          <h2 className="text-xl">Booking</h2>
          <div className="border p-6 rounded-2xl shadow-md w-full">
            <p className="text-lg">{venue.price} NOK / night</p>
            {!isOwner && (
              <VenueBooking
                venueId={venue.id}
                price={venue.price}
                maxGuests={venue.maxGuests}
                selectedDates={bookingDates}
                onDateChange={setBookingDates}
                onBookingSuccess={(from, to) => {
                  handleBookingSuccess(from, to);
                  setBookingRefreshKey((prev) => prev + 1);
                }}
                refreshKey={bookingRefreshKey}
              />
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Modal isOpen={imageModalOpen} onClose={() => setImageModalOpen(false)}>
        <div className="flex flex-col items-center gap-4">
          <img
            src={venue.media[selectedImageIndex].url}
            alt={venue.media[selectedImageIndex].alt || venue.name}
            className="h-[500px] w-auto object-cover object-center rounded"
          />
          <div className="flex gap-2 overflow-x-auto mt-4">
            {venue.media.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={img.alt || venue.name}
                onClick={() => setSelectedImageIndex(idx)}
                className={`h-20 w-28 object-cover rounded-md cursor-pointer border ${
                  selectedImageIndex === idx
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
              />
            ))}
          </div>
        </div>
      </Modal>

      {/* Other Modals */}
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
        onSuccess={() => {
          setEditModalOpen(false);

          (async () => {
            if (!id) return;
            try {
              const data = await getVenueById(id);
              setVenue(data);
            } catch {
              setError("Could not refresh venue after edit.");
            }
          })();
        }}
      />
    </div>
  );
}

export default VenueDetails;
