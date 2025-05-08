import * as storage from './key';
import { API_AUTH_LOGIN } from './constants';
import { getProfile } from './profile';

interface LoginData {
  email: string;
  password: string;
}

const method = 'POST';

export async function login(profile: LoginData): Promise<void> {
  const loginURL = API_AUTH_LOGIN;
  const body = JSON.stringify(profile);

  const response = await fetch(loginURL, {
    headers: {
      'Content-Type': 'application/json',
    },
    method,
    body,
  });

  if (!response.ok) {

    throw new Error('Invalid username or password');
  }

  const jsonResponse = await response.json();
  const { accessToken, name } = jsonResponse.data;

  storage.save('token', accessToken);
  storage.save('username', name);

  try {
    const profile = await getProfile(name);
    storage.save('profile', { data: profile });
    console.log('Fetched and saved profile data:', profile);
  } catch (error) {
    console.error('Failed to fetch full profile:', error);
  }

  location.reload(); 
}