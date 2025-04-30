import VenueList from "../components/venues/VenueList";
import Searchbar from "../components/Searchbar";
import { useState } from "react";
import Calendar from "../components/Calendar";

function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDates, setSelectedDates] = useState<[Date | null, Date | null]>([null, null]);

  return (
    <div className="">
      <img src="/public/assets/images/palm.png" alt="Scetch of two palmtrees" />
      <img src="/public/assets/images/holidaze-logo-slogan.png" alt="Holidaze logo" />
      <div className="">
      <Searchbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Calendar onDateChange={setSelectedDates} />
      <h1>Venues</h1>
      <VenueList searchQuery={searchQuery} selectedDates={selectedDates} />
      </div>
    </div>
  );
}

export default HomePage;