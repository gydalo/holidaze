import { Link } from "react-router-dom";
import Modal from "../common/PopUp";

interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  venue?: {
    id: string;
    name: string;
  };
}

interface CustomerBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  upcoming: Booking[];
  past: Booking[];
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}.${date.getFullYear().toString().slice(-2)}`;
};

const CustomerBookingsModal: React.FC<CustomerBookingsModalProps> = ({
  isOpen,
  onClose,
  upcoming,
  past,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg mb-4">My Bookings</h2>

      <section className="mb-6">
        <h3 className="mb-2">Upcoming Bookings</h3>
        {upcoming.length === 0 ? (
          <p>No upcoming bookings.</p>
        ) : (
          <div className="space-y-4">
            {upcoming.map((booking) => (
              <Link
                key={booking.id}
                to={`/venue/${booking.venue?.id}`}
                className="block border rounded-xl p-4 shadow hover:bg-gray-50 transition text-left"
              >
                <h4 className="">{booking.venue?.name || "Unknown venue"}</h4>
                <p>
                  {formatDate(booking.dateFrom)} - {formatDate(booking.dateTo)}
                </p>
                <p>Guests: {booking.guests}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-2">Past Bookings</h3>
        {past.length === 0 ? (
          <p>No past bookings.</p>
        ) : (
          <div className="space-y-4">
            {past.map((booking) => (
              <Link
                key={booking.id}
                to={`/venue/${booking.venue?.id}`}
                className="block border rounded-xl p-4 shadow hover:bg-gray-50 transition text-left"
              >
                <h4 className="font-semibold">
                  {booking.venue?.name || "Unknown venue"}
                </h4>
                <p>
                  {formatDate(booking.dateFrom)} - {formatDate(booking.dateTo)}
                </p>
                <p>Guests: {booking.guests}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </Modal>
  );
};

export default CustomerBookingsModal;
