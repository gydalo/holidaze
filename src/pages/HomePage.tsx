import VenueList from "../components/venues/VenueList";
import Searchbar from "../components/Searchbar";
import { useState } from "react";

function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="">
      <img src="/public/assets/images/palm.png" alt="Scetch of two palmtrees" />
      <img src="/public/assets/images/holidaze-logo-slogan.png" alt="Holidaze logo" />

      <div className="">
      <Searchbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <h1 className="">Venues</h1>
      <VenueList searchQuery={searchQuery} />
      </div>
    </div>
  );
}

export default HomePage;