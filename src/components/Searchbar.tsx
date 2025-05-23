/**import React from "react";

interface SearchbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Searchbar: React.FC<SearchbarProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="">
      <input
        type="text"
        placeholder="Search for location here..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className=""
      />
    </div>
  );
};

export default Searchbar; **/