import React from "react";
import Modal from "../common/PopUp";

type BookingConfirmationProps = {
  isOpen: boolean;
  onClose: () => void;
  venue: {
    name: string;
    media: { url: string; alt?: string }[];
    address: string;
    city: string;
    zip: string;
    country: string;
    owner: { name: string };
  };
  bookingDates: {
    from: string;
    to: string; 
  };
};

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  isOpen,
  onClose,
  venue,
  bookingDates,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6 text-center max-w-md mx-auto">
        <h2 className="">Booking Confirmed!</h2>

        {venue.media?.[0]?.url && (
          <img
            src={venue.media[0].url}
            alt={venue.media[0].alt || venue.name}
            className="w-full h-48 object-cover rounded-lg shadow-md"
          />
        )}

        <div className="text-left space-y-2 text-sm">
          <h2>{venue.name}</h2>
          <p>{venue.owner.name}</p>
          <p>{venue.address}, {venue.zip} {venue.city}, {venue.country}</p>
          <p>{new Date(bookingDates.from).toLocaleDateString()} - {new Date(bookingDates.to).toLocaleDateString()}</p>
        </div>

        <div className="pt-4">
          <button
            onClick={onClose}
            className=" transition"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BookingConfirmation;