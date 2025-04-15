import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const venuePage = () => {
    navigate('/venue');
  };

  return (
    <div className="">
      <p className="">Homepage</p>
      <button
        type="button"
        onClick={venuePage}
        className=""
      >
        Venue
      </button>
    </div>
  );
}

export default HomePage;