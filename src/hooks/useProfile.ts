import { useEffect, useState } from 'react';

const PROFILE_KEY = 'smartmeal_profile';

export function useProfile() {
  const [profile, setProfile] = useState(() => {
    try {
      const item = localStorage.getItem(PROFILE_KEY);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  });

  const saveProfile = (newProfile: any) => {
    setProfile(newProfile);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));
  };

  return { profile, saveProfile };
}
