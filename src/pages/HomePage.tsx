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
  const [calendarKey, setCalendarKey] = useState(0);

  const handleSearchClick = () => {
    setSearchQuery(searchInput);
    setActiveDates(dateRange);
  };

  const handleClear = () => {
    setSearchInput("");
    setSearchQuery("");
    setDateRange([null, null]);
    setActiveDates([null, null]);
    setCalendarKey((prev) => prev + 1);
  };

  return (
    <div className="md-p-6 sm-p-0">
      <div className="relative flex items-center justify-center min-h-[50vh]">
        <div className="hidden md:block absolute top-0 xl:top-4 left-0 p-6">
          <img
            src="/public/assets/images/palm.png"
            alt="Sketch of two palmtrees"
            className="h-60 xl:h-72 object-contain"
          />
        </div>

        <div className="flex flex-col items-center space-y-6 z-10">
          <img
            src="/public/assets/images/holidaze-logo-slogan.png"
            alt="Holidaze logo"
            className="w-40"
          />

          {/* Responsive filter layout */}
          <div className="w-full max-w-[900px]">
            {/* Unified container only on sm+ */}
            <div className="hidden sm:flex bg-white border rounded-full shadow-md px-4 py-4 items-center divide-x divide-gray-300">
              {/* Calendar */}
              <div className="w-full">
                <Calendar
                  key={calendarKey}
                  onDateChange={setDateRange}
                  value={dateRange}
                  variant="homepage"
                />
              </div>

              {/* Search input */}
              <div className="flex items-center gap-2 w-full sm:w-auto pl-4">
                <input
                  type="text"
                  placeholder="Search for location here.."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="outline-none w-full sm:w-48"
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

            {/* Mobile layout: separate borders */}
            <div className="flex flex-col sm:hidden gap-2">
              <div className="bg-white border rounded-full shadow-md px-4 py-4 w-full flex items-center gap-2 max-h-[60px]">
                <Calendar
                  onDateChange={setDateRange}
                  key={calendarKey}
                  value={dateRange}
                  variant="homepage"
                />
              </div>
              <div className="bg-white border rounded-full shadow-md px-4 py-4 w-full flex items-center gap-2 max-h-[60px]">
                <input
                  type="text"
                  placeholder="Search for location here.."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="outline-none w-full"
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
          <div className="h-2 mt-2 flex justify-center items-center">
            <button
              onClick={handleClear}
              className={`text-sm font-lateef transition-opacity duration-200 ${
                searchInput || dateRange[0] || dateRange[1]
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              Clear Search
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
