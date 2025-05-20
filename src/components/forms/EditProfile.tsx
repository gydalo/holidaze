import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Modal from "../common/PopUp";
import { authFetch } from "../../api/auth/key";
import { API_PROFILE } from "../../api/auth/constants";
import ReusableButton from "../ReusableButton";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  profileName: string;
  onSuccess: () => void;
};

type FormData = {
  avatarUrl: string;
  avatarAlt: string;
  bannerUrl: string;
  bannerAlt: string;
  bio: string;
};

function EditProfileModal({ isOpen, onClose, profileName, onSuccess }: Props) {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await authFetch(`${API_PROFILE}/${profileName}`);
        const result = await response.json();
        const profile = result.data;

        reset({
          avatarUrl: profile.avatar?.url || "",
          avatarAlt: profile.avatar?.alt || "",
          bannerUrl: profile.banner?.url || "",
          bannerAlt: profile.banner?.alt || "",
          bio: profile.bio || "",
        });
      } catch {
        setError("Failed to load profile");
      }
    }

    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen, profileName, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const updatedProfile = {
        avatar: {
          url: data.avatarUrl,
          alt: data.avatarAlt,
        },
        banner: {
          url: data.bannerUrl,
          alt: data.bannerAlt,
        },
        bio: data.bio,
      };

      const response = await authFetch(`${API_PROFILE}/${profileName}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfile),
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        setError("Failed to update profile");
      }
    } catch {
      setError("Error updating profile");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-center mb-6">Edit Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto">
        <div>
          <label className="block font-medium mb-1">Avatar URL</label>
          <input
            {...register("avatarUrl")}
            placeholder="Avatar URL"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
  
        <div>
          <label className="block font-medium mb-1">Banner URL</label>
          <input
            {...register("bannerUrl")}
            placeholder="Banner URL"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
  
        <div>
          <label className="block font-medium mb-1">Bio</label>
          <textarea
            {...register("bio")}
            placeholder="Tell us about yourself"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
  
        {error && <p className="text-red-500 text-center">{error}</p>}
  
        <ReusableButton type="submit" className="w-full rounded-lg">
          Save Changes
        </ReusableButton>
      </form>
    </Modal>
  );
}

export default EditProfileModal;
