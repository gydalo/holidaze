import { useEffect, useState } from "react";

import ReusableButton from "../ReusableButton";
import Calendar from "../Calendar";
import { getVenueBookings } from "../../api/bookings/getVenueBookings";
import { createBooking } from "../../api/bookings/createBooking";

interface VenueBookingProps {
  venueId: string;
  price: number;
  maxGuests: number;
  onBookingSuccess?: (from: string, to: string) => void;
  selectedDates: [Date | null, Date | null];
  onDateChange: (dates: [Date | null, Date | null]) => void;
}

const VenueBooking = ({
  venueId,
  price,
  maxGuests,
  onBookingSuccess,
  selectedDates,
  onDateChange,
}: VenueBookingProps) => {
  const [bookedRanges, setBookedRanges] = useState<
    { start: Date; end: Date }[]
  >([]);
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookings = await getVenueBookings(venueId);
        const ranges = bookings.map((b) => ({
          start: new Date(b.dateFrom),
          end: new Date(b.dateTo),
        }));
        setBookedRanges(ranges);
      } catch (err) {
        console.error("Failed to load bookings:", err);
      }
    };

    fetchBookings();
  }, [venueId]);

  const handleBooking = async () => {
    setError("");
    const [from, to] = selectedDates;

    if (!from || !to) {
      return setError("Please select a valid date range.");
    }

    if (guests < 1 || guests > maxGuests) {
      return setError(`Guests must be between 1 and ${maxGuests}.`);
    }

    const hasOverlap = bookedRanges.some(
      ({ start, end }) => from <= end && to >= start
    );

    if (hasOverlap) {
      return setError("Selected dates are already booked.");
    }

    try {
      await createBooking({
        dateFrom: from.toISOString(),
        dateTo: to.toISOString(),
        guests,
        venueId,
      });

      if (onBookingSuccess) {
        onBookingSuccess(from.toISOString(), to.toISOString());
      }
    } catch (err) {
      console.error("Booking failed:", err);
      setError("Could not complete booking.");
    }
  };

  const cleaningFee = 600;
  const securityFee = 600;

  const nights =
    selectedDates[0] && selectedDates[1]
      ? Math.ceil(
          (selectedDates[1].getTime() - selectedDates[0].getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const priceBeforeFees = price * nights;
  const total = priceBeforeFees + cleaningFee + securityFee;

  return (
    <div className="space-y-4">         
      <label className="block font-medium">
        Guests (max {maxGuests}):
        <input
          type="number"
          value={guests}
          min={1}
          max={maxGuests}
          onChange={(e) => setGuests(parseInt(e.target.value))}
          className="mt-1 w-full border rounded p-2"
        />
      </label>

<div className="w-full">
      <Calendar
        onDateChange={onDateChange}
        value={selectedDates}
        disabledRanges={bookedRanges.map(({ start, end }) => [start, end])}
        variant="venuepage"
      />

</div>

      {selectedDates[0] && selectedDates[1] && (
        <div className="border-t pt-4 text-sm space-y-1">
          <p>
            {price} NOK × {nights} night{nights > 1 ? "s" : ""}:{" "}
            <strong>{priceBeforeFees} NOK</strong>
          </p>
          <p>
            Cleaning fee: <strong>{cleaningFee} NOK</strong>
          </p>
          <p>
            Holidaze security fee: <strong>{securityFee} NOK</strong>
          </p>
          <hr className="my-2" />
          <p className="font-bold text-base">Total: {total} NOK</p>
        </div>
      )}
<div className="flex justify-center pt-10">
      <ReusableButton onClick={handleBooking}>Book Venue</ReusableButton>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default VenueBooking;
