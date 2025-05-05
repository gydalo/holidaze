import { useState, useEffect } from "react";
import { authFetch, load, save } from "../api/auth/key";
import { API_PROFILE } from "../api/auth/constants";
import ReusableButton from "../components/ReusableButton";
import Modal from "../components/common/PopUp";
import CreateVenue from "../components/forms/CreateVenue";

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
  };
  
  function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isVenueManager, setIsVenueManager] = useState(false);
    const [pendingVenueManager, setPendingVenueManager] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
  
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
      setSaving(true);
      setMessage("");
  
      try {
        const response = await authFetch(`${API_PROFILE}/${profile!.name}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ venueManager: pendingVenueManager }),
        });
  
        if (response.ok) {
          const updatedProfile: Profile = {
            ...profile!,
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
  
    if (!profile) {
      return <div>Loading profile...</div>;
    }
  
    return (
      <div>
        <h1>Profile Page</h1>
  
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
            <ReusableButton onClick={() => setIsModalOpen(true)}>
              Add Venue
            </ReusableButton>
          </div>
        )}
  
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="">Create a Venue</h2>
          <CreateVenue onSuccess={() => setIsModalOpen(false)} />
        </Modal>
  
        {message && <p>{message}</p>}
      </div>
    );
  }
  
  export default ProfilePage;