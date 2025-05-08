import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReusableButton from "../ReusableButton";
import { getVenueBookings } from "../../api/bookings/getVenueBookings";
import { createBooking } from "../../api/bookings/createBooking";
import { useNavigate } from "react-router-dom";

interface VenueBookingProps {
  venueId: string;
  price: number;
  maxGuests: number;
}

const VenueBooking = ({ venueId, price, maxGuests }: VenueBookingProps) => {
  const [selectedDates, setSelectedDates] = useState<
    [Date | null, Date | null]
  >([null, null]);
  const [bookedRanges, setBookedRanges] = useState<
    { start: Date; end: Date }[]
  >([]);
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const storedProfile = localStorage.getItem("profile");
  const currentUser = storedProfile ? JSON.parse(storedProfile)?.data : null;

  useEffect(() => {
    async function fetchBookings() {
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
    }

    fetchBookings();
  }, [venueId]);

  const handleBooking = async () => {
    setError("");
    const [from, to] = selectedDates;

    if (!from || !to) return setError("Please select a valid date range.");
    if (guests < 1 || guests > maxGuests)
      return setError(`Guests must be between 1 and ${maxGuests}.`);

    const isOverlap = bookedRanges.some(
      ({ start, end }) => from <= end && to >= start
    );
    if (isOverlap) return setError("Selected dates are already booked.");

    try {
      await createBooking({
        dateFrom: from.toISOString(),
        dateTo: to.toISOString(),
        guests,
        venueId,
      });

      alert("Booking successful!");
      navigate(`/profile/${currentUser?.name}`);
    } catch (err) {
      console.error(err);
      setError("Could not complete booking.");
    }
  };

  return (
    <div className="">
      <h2 className="">Book this venue</h2>
      <p className="">{price} NOK / night</p>

      <label className="">
        Guests (max {maxGuests}):
        <input
          type="number"
          value={guests}
          min={1}
          max={maxGuests}
          onChange={(e) => setGuests(parseInt(e.target.value))}
          className=""
        />
      </label>

      <DatePicker
        selected={selectedDates[0]}
        onChange={(dates) =>
          setSelectedDates(dates as [Date | null, Date | null])
        }
        startDate={selectedDates[0]}
        endDate={selectedDates[1]}
        selectsRange
        minDate={new Date()}
        excludeDateIntervals={bookedRanges}
        inline
      />

      <ReusableButton onClick={handleBooking}>Book Venue</ReusableButton>
      {error && <p className="">{error}</p>}
    </div>
  );
};

export default VenueBooking;
