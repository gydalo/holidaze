export function save<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
  
  export function load<T>(key: string): T | null {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  }
  
  export function remove(key: string): void {
    localStorage.removeItem(key);
  }
  
  export function headers(): Record<string, string> {
    const token = load<string>('token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'X-Noroff-API-Key': 'f72e33db-603a-4d29-8c08-f467554c9eda',
    };
  }
  
  export async function authFetch(url: string, options: RequestInit = {}) {
    return fetch(url, {
      ...options,
      headers: headers(),
    });
  }
  
  export function isLoggedIn(): boolean {
    const token = load<string>('token');
    return !!token;
  }
  
  