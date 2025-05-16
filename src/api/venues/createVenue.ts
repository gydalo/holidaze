import { API_VENUES_URL } from "../auth/constants";
import { authFetch } from "../auth/key";

export type CreateVenueData = {
  name: string;
  description: string;
  media: { url: string; alt?: string }[];
  price: number;
  maxGuests: number;
  meta?: {
    wifi?: boolean;
    parking?: boolean;
    breakfast?: boolean;
    pets?: boolean;
  };
  location?: {
    address?: string;
    city?: string;
    zip?: string;
    country?: string;
    continent?: string;
  };
};

export async function createVenue(data: CreateVenueData) {
  const response = await authFetch(API_VENUES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors?.[0]?.message || "Failed to create venue");
  }

  return await response.json();
}
