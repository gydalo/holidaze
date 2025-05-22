import VenueList from "../components/venues/VenueList";
import { useState } from "react";
import Calendar from "../components/Calendar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

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
    <div className="md-p-6 sm-p-0">
      <div className="relative flex items-center justify-center min-h-[50vh]">
        <div className="hidden md:block absolute top-0 xl:top-8 left-0 p-6">
          <img
            src="/public/assets/images/palm.png"
            alt="Sketch of two palmtrees"
            className="h-72 object-contain"
          />
        </div>

        <div className="flex flex-col items-center space-y-6 z-10">
          <img
            src="/public/assets/images/holidaze-logo-slogan.png"
            alt="Holidaze logo"
            className="w-40"
          />
          <div className="flex items-center bg-white border rounded-full shadow-md overflow-hidden px-4 py-4 space-x-2 w-full max-w-[900px]">
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
              className="outline-none w-full sm:w-32 md:w-48"
            />
            <button onClick={handleSearchClick}>
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="size-6"
                style={{ color: "#4B614F" }}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <VenueList searchQuery={searchQuery} selectedDates={activeDates} />
      </div>
    </div>
  );
}

export default HomePage;
