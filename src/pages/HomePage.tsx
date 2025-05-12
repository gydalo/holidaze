import VenueList from "../components/venues/VenueList";
import Searchbar from "../components/Searchbar";
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
    <div className="">
      <img
        src="/public/assets/images/palm.png"
        alt="Sketch of two palmtrees"
        className=""
      />
      <img
        src="/public/assets/images/holidaze-logo-slogan.png"
        alt="Holidaze logo"
        className=""
      />

      <Searchbar searchQuery={searchInput} setSearchQuery={setSearchInput} />
      <Calendar onDateChange={setDateRange} />
      <ReusableButton onClick={handleSearchClick}>Search</ReusableButton>

      <h1 className="">Venues</h1>
      <VenueList searchQuery={searchQuery} selectedDates={activeDates} />
    </div>
  );
}

export default HomePage;