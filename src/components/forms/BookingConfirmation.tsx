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
      <div className="">
        <h2 className="">
          Booking Confirmed!
        </h2>

        {venue.media?.[0]?.url && (
          <img
            src={venue.media[0].url}
            alt={venue.media[0].alt || venue.name}
            className=""
          />
        )}

        <div className="">
          <p><span className="">Venue:</span> {venue.name}</p>
          <p><span className="">Owner:</span> {venue.owner.name}</p>
          <p><span className="">Address:</span> {venue.address}, {venue.zip} {venue.city}, {venue.country}</p>
          <p><span className="">From:</span> {new Date(bookingDates.from).toLocaleDateString()}</p>
          <p><span className="">To:</span> {new Date(bookingDates.to).toLocaleDateString()}</p>
        </div>

        <div className="">
          <button
            onClick={onClose}
            className=""
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BookingConfirmation;