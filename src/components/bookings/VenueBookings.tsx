import { useEffect, useState } from "react";
import { eachDayOfInterval } from "date-fns";
import { useNavigate } from "react-router-dom";

import ReusableButton from "../ReusableButton";
import Calendar from "../Calendar";
import { getVenueBookings } from "../../api/bookings/getVenueBookings";
import { createBooking } from "../../api/bookings/createBooking";

interface VenueBookingProps {
  venueId: string;
  price: number;
  maxGuests: number;
  onBookingSuccess?: (from: string, to: string) => void;
}

const VenueBooking = ({ venueId, price, maxGuests, onBookingSuccess }: VenueBookingProps) => {
  const [selectedDates, setSelectedDates] = useState<
    [Date | null, Date | null]
  >([null, null]);
  const [bookedRanges, setBookedRanges] = useState<
    { start: Date; end: Date }[]
  >([]);
  const [excludedDates, setExcludedDates] = useState<Date[]>([]);
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const storedProfile = localStorage.getItem("profile");
  const currentUser = storedProfile ? JSON.parse(storedProfile)?.data : null;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookings = await getVenueBookings(venueId);
        const ranges = bookings.map((b) => ({
          start: new Date(b.dateFrom),
          end: new Date(b.dateTo),
        }));

        setBookedRanges(ranges);

        const dates = ranges.flatMap((range) =>
          eachDayOfInterval({ start: range.start, end: range.end })
        );

        setExcludedDates(dates);
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
      console.error(err);
      setError("Could not complete booking.");
    }
  };

  return (
    <div className="venue-booking">
      <h2 className="venue-booking__title">Book this venue</h2>
      <p className="venue-booking__price">{price} NOK / night</p>

      <label className="venue-booking__label">
        Guests (max {maxGuests}):
        <input
          type="number"
          value={guests}
          min={1}
          max={maxGuests}
          onChange={(e) => setGuests(parseInt(e.target.value))}
          className="venue-booking__input"
        />
      </label>

      <Calendar
        onDateChange={setSelectedDates}
        disabledRanges={bookedRanges.map(({ start, end }) => [start, end])}
      />

      <ReusableButton onClick={handleBooking}>Book Venue</ReusableButton>

      {error && <p className="venue-booking__error">{error}</p>}
    </div>
  );
};

export default VenueBooking;
