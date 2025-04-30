import { load } from "../api/auth/key";

type Profile = {
  name: string;
  email: string;
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
  const profileData = load<{ data: Profile }>("profile");
  const profile = profileData?.data;

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

      <p>Name: {profile.name}</p>
      <p>Email: {profile.email}</p>

      {profile.avatar?.url && (
        <div>
          <img
            src={profile.avatar.url}
            alt={profile.avatar.alt || "Profile Avatar"}
          />
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
