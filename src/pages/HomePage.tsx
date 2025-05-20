import VenueList from "../components/venues/VenueList";
import { useState } from "react";
import Calendar from "../components/Calendar";
import ReusableButton from "../components/ReusableButton";

function HomePage() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [activeDates, setActiveDates] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const handleSearchClick = () => {
    setSearchQuery(searchInput);
    setActiveDates(dateRange);
  };

  return (
    <div className="p-6">
      <div className="flex items-start justify-center gap-6">
        <div className="flex-shrink-0 self-start pt-1">
          <img
            src="/public/assets/images/palm.png"
            alt="Sketch of two palmtrees"
            className="h-48"
          />
        </div>

        <div className="flex flex-col items-center space-y-4">
          <img
            src="/public/assets/images/holidaze-logo-slogan.png"
            alt="Holidaze logo"
            className="w-40"
          />
          <div className="flex items-center bg-white border rounded-full shadow-md overflow-hidden px-4 py-2 space-x-4">
            <Calendar
              onDateChange={setDateRange}
              value={dateRange}
              variant="homepage"
            />

            <input
              type="text"
              placeholder="Search for location here.."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="outline-none w-48"
            />

            <ReusableButton onClick={handleSearchClick}>Search</ReusableButton>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <h1 className="text-2xl font-semibold mb-4 text-center">Venues</h1>
        <VenueList searchQuery={searchQuery} selectedDates={activeDates} />
      </div>
    </div>
  );
}

export default HomePage;
