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
    } catch (error) {
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
    } catch (error) {
      console.error("Failed to refresh profile");
    }
  }

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div>
      <h1>Profile Page</h1>

      <ReusableButton onClick={() => setIsEditProfileModalOpen(true)}>
        Edit Profile
      </ReusableButton>

      {profile.banner?.url && (
        <div>
          <img
            src={profile.banner.url}
            alt={profile.banner.alt || "Profile Banner"}
          />
        </div>
      )}

      {profile.avatar?.url && (
        <div>
          <img
            src={profile.avatar.url}
            alt={profile.avatar.alt || "Profile Avatar"}
          />
        </div>
      )}

      <div>
        <p>Name: {profile.name}</p>
        <p>Email: {profile.email}</p>
        {profile.bio && <p>Bio: {profile.bio}</p>}
      </div>

      {!isVenueManager && (
        <div>
          <label>
            <input
              type="checkbox"
              checked={pendingVenueManager}
              onChange={(e) => setPendingVenueManager(e.target.checked)}
            />
            <span> Become a Venue Manager</span>
          </label>

          {pendingVenueManager && (
            <div className="">
              <ReusableButton onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </ReusableButton>
            </div>
          )}
        </div>
      )}

      {isVenueManager && (
        <div className="">
          <ReusableButton onClick={() => setIsCreateVenueModalOpen(true)}>
            Add Venue
          </ReusableButton>
        </div>
      )}

      <Modal
        isOpen={isCreateVenueModalOpen}
        onClose={() => setIsCreateVenueModalOpen(false)}
      >
        <h2>Create a Venue</h2>
        <CreateVenue onSuccess={() => setIsCreateVenueModalOpen(false)} />
      </Modal>

      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        profileName={profile.name}
        onSuccess={refreshProfile}
      />

      {message && <p>{message}</p>}

      <OwnedVenues />
      <BookingsList />
    </div>
  );
}

export default ProfilePage;
