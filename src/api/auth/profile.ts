import { API_PROFILE } from "./constants";
import { authFetch } from "./key";

interface Venue {
  id: string;
  name: string;
  media?: { url: string; alt?: string }[];
  location?: { city?: string; country?: string };
}

interface ProfileData {
  name: string;
  email: string;
  avatar?: { url: string; alt?: string };
  banner?: { url: string; alt?: string };
  venues: Venue[];
  bookings?: Venue[];
}

export async function getProfile(name: string): Promise<ProfileData> {
  const url = `${API_PROFILE}/${name}?_venues=true`;

  const response = await authFetch(url);

  if (!response.ok) {
    throw new Error("Could not fetch profile");
  }

  const result = await response.json();
  return result.data;
}
