import { useState, useEffect } from "react";
import { authFetch, load, save } from "../api/auth/key";
import { API_PROFILE } from "../api/auth/constants";
import ReusableButton from "../components/ReusableButton";
import Modal from "../components/common/PopUp";
import CreateVenue from "../components/forms/CreateVenue";
import OwnedVenues from "../components/venues/OwnedVenues";
import BookingsList from "../components/bookings/BookingList";
import EditProfileModal from "../components/forms/EditProfile";

type Profile = {
  name: string;
  email: string;
  venueManager?: boolean;
  avatar?: {
    url: string;
    alt?: string;
  };
  banner?: {
    url: string;
    alt?: string;
  };
  bio?: string;
};

function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isVenueManager, setIsVenueManager] = useState(false);
  const [pendingVenueManager, setPendingVenueManager] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isCreateVenueModalOpen, setIsCreateVenueModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [venuesChanged, setVenuesChanged] = useState(false);

  useEffect(() => {
    const storedProfile = load<{ data: Profile }>("profile")?.data;
    if (storedProfile) {
      setProfile(storedProfile);
      const venueStatus = storedProfile.venueManager ?? false;
      setIsVenueManager(venueStatus);
      setPendingVenueManager(venueStatus);
    }
  }, []);

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    setMessage("");

    try {
      const response = await authFetch(`${API_PROFILE}/${profile.name}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ venueManager: pendingVenueManager }),
      });

      if (response.ok) {
        const updatedProfile: Profile = {
          ...profile,
          venueManager: pendingVenueManager,
        };

        save("profile", { data: updatedProfile });
        setProfile(updatedProfile);
        setIsVenueManager(pendingVenueManager);
        setMessage("Profile updated!");
      } else {
        setMessage("Failed to update profile.");
      }
    } catch {
      setMessage("Error while saving changes.");
    } finally {
      setSaving(false);
    }
  }

  async function refreshProfile() {
    if (!profile) return;

    try {
      const response = await authFetch(`${API_PROFILE}/${profile.name}`);
      const result = await response.json();
      save("profile", { data: result.data });
      setProfile(result.data);
    } catch {
      setMessage("Failed to refresh profile.");
    }
  }

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {profile.banner?.url && (
        <div>
          <img
            src={profile.banner.url}
            alt={profile.banner.alt || "Profile Banner"}
            className="w-full h-52 object-cover"
          />
        </div>
      )}

      {profile.avatar?.url && (
        <div>
          <div className="flex mt-[-4rem] z-10 gap-10 md:gap-40 justify-center flex-wrap">
            <img
              src={profile.avatar.url}
              alt={profile.avatar.alt || "Profile Avatar"}
              className="w-52 h-52 rounded-full shadow-md"
            />
            <div className="sm:mt-[5rem] flex gap-6 flex-col">
              <div>
                <h2 className="text-2xl ">{profile.name}</h2>
                <p className="text-gray-700">{profile.email}</p>
              </div>
              <div className="flex gap-2">
                <ReusableButton onClick={() => setIsEditProfileModalOpen(true)}>
                  Edit Profile
                </ReusableButton>
                {isVenueManager && (
                  <ReusableButton
                    onClick={() => setIsCreateVenueModalOpen(true)}
                  >
                    Add Venue
                  </ReusableButton>
                )}
              </div>
              {profile.bio && <p>{profile.bio}</p>}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-start gap-8 px-4 md:px-8 mt-6">
        <div className="flex flex-col items-center md:items-start w-full md:w-1/3">
          {!isVenueManager && (
            <div className="mt-6 w-full">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pendingVenueManager}
                  onChange={(e) => setPendingVenueManager(e.target.checked)}
                />
                <span>Become a venue manager account</span>
              </label>
              {pendingVenueManager && (
                <div className="mt-2">
                  <ReusableButton onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </ReusableButton>
                </div>
              )}
            </div>
          )}

          {isVenueManager && (
            <div className="mt-8 w-full">
              <h3 className=" text-lg mb-2">Venues</h3>
              <OwnedVenues refreshKey={venuesChanged} />
            </div>
          )}
        </div>

        <div className="">
          {message && <p className="text-green-600 text-sm mt-2">{message}</p>}

          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <BookingsList />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isCreateVenueModalOpen}
        onClose={() => setIsCreateVenueModalOpen(false)}
      >
  <CreateVenue
  onSuccess={() => {
    setIsCreateVenueModalOpen(false);
    setVenuesChanged((prev) => !prev);
  }}
/>
      </Modal>

      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        profileName={profile.name}
        onSuccess={refreshProfile}
      />
    </div>
  );
}

export default ProfilePage;
