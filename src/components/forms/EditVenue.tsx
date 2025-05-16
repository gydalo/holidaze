import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getVenueById } from "../../api/venues/getVenueById";
import { updateVenueById } from "../../api/venues/updateVenue";
import Modal from "../common/PopUp";

type FormData = {
  name: string;
  description: string;
  mediaUrl: string;
  mediaAlt: string;
  price: number;
  maxGuests: number;
  wifi: boolean;
  parking: boolean;
  breakfast: boolean;
  pets: boolean;
  address: string;
  city: string;
  zip: string;
  country: string;
  continent: string;
};

type Props = {
  venueId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

function EditVenueModal({ venueId, isOpen, onClose, onSuccess }: Props) {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchVenue() {
      try {
        const data = await getVenueById(venueId);
        reset({
          name: data.name,
          description: data.description,
          mediaUrl: data.media?.[0]?.url || "",
          mediaAlt: data.media?.[0]?.alt || "",
          price: data.price,
          maxGuests: data.maxGuests,
          wifi: data.meta?.wifi,
          parking: data.meta?.parking,
          breakfast: data.meta?.breakfast,
          pets: data.meta?.pets,
          address: data.location?.address || "",
          city: data.location?.city || "",
          zip: data.location?.zip || "",
          country: data.location?.country || "",
          continent: data.location?.continent || "",
        });
      } catch {
        setError("Failed to fetch venue");
      }
    }

    if (isOpen) {
      fetchVenue();
    }
  }, [venueId, isOpen, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await updateVenueById(venueId, {
        name: data.name,
        description: data.description,
        media: [{ url: data.mediaUrl, alt: data.mediaAlt }],
        price: Number(data.price),
        maxGuests: Number(data.maxGuests),
        meta: {
          wifi: data.wifi,
          parking: data.parking,
          breakfast: data.breakfast,
          pets: data.pets,
        },
        location: {
          address: data.address,
          city: data.city,
          zip: data.zip,
          country: data.country,
          continent: data.continent,
        },
      });

      onSuccess();
      onClose();
    } catch {
      setError("Failed to update venue");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Edit Venue</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <input {...register("name")} placeholder="Venue name" required />
        <textarea
          {...register("description")}
          placeholder="Description"
          required
        />
        <input {...register("mediaUrl")} placeholder="Image URL" />
        <input {...register("mediaAlt")} placeholder="Image Alt Text" />
        <input
          type="number"
          {...register("price")}
          placeholder="Price"
          required
        />
        <input
          type="number"
          {...register("maxGuests")}
          placeholder="Max guests"
          required
        />

        <label>
          <input type="checkbox" {...register("wifi")} /> Wifi
        </label>
        <label>
          <input type="checkbox" {...register("parking")} /> Parking
        </label>
        <label>
          <input type="checkbox" {...register("breakfast")} /> Breakfast
        </label>
        <label>
          <input type="checkbox" {...register("pets")} /> Pets allowed
        </label>

        <input {...register("address")} placeholder="Address" required />
        <input {...register("city")} placeholder="City" required />
        <input {...register("zip")} placeholder="ZIP" required />
        <input {...register("country")} placeholder="Country" required />
        <input {...register("continent")} placeholder="Continent" required />

        {error && <p className="text-red-500">{error}</p>}

        <button type="submit" className="">
          Save Changes
        </button>
      </form>
    </Modal>
  );
}

export default EditVenueModal;
