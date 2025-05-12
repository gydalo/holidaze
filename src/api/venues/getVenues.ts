import { API_VENUES_URL } from '../auth/constants';

export async function getVenues() {
  const response = await fetch(`${API_VENUES_URL}?_bookings=true`);

  if (!response.ok) {
    throw new Error('Failed to fetch venues');
  }

  const data = await response.json();
  return data.data;
}