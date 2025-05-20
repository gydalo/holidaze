import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { getVenueById } from "../../api/venues/getVenueById";
import ReusableButton from "../ReusableButton";
import { updateVenueById } from "../../api/venues/updateVenue";
import Modal from "../common/PopUp";

type FormData = {
  name: string;
  description: string;
  media: { url: string; alt?: string }[];
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
  const { register, handleSubmit, control, reset } = useForm<FormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "media",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchVenue() {
      try {
        const data = await getVenueById(venueId);
        reset({
          name: data.name,
          description: data.description,
          media: data.media || [{ url: "", alt: "" }],
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
        media: data.media.filter((m) => m.url.trim() !== ""),
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
      <h2 className="text-center mb-6">Edit Venue</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 max-w-lg mx-auto"
      >
        <div>
          <h3 className="text-center pb-5">Venue Details</h3>
          <label className="block font-medium mb-1">Venue Name</label>
          <input
            {...register("name")}
            placeholder="Venue name"
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            {...register("description")}
            placeholder="Description"
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Images</label>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-2">
                <input
                  {...register(`media.${index}.url`)}
                  placeholder="Image URL"
                  required
                  className="w-full p-3 border rounded-lg"
                />
                <input
                  {...register(`media.${index}.alt`)}
                  placeholder="Alt Text"
                  className="w-full p-3 border rounded-lg"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-600 text-sm underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <ReusableButton
              type="button"
              onClick={() => append({ url: "", alt: "" })}
              className="justify-center mx-auto w-full p-3 rounded-lg"
            >
              Add Image
            </ReusableButton>
          </div>
        </div>

        <div>
          <h3 className="text-center pb-5 pt-5">Venue Price and Capacity</h3>
          <label className="block font-medium mb-1">Price</label>
          <input
            type="number"
            {...register("price")}
            placeholder="Price"
            required
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Max Guests</label>
          <input
            type="number"
            {...register("maxGuests")}
            placeholder="Max Guests"
            required
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-center pb-5 pt-5">Amenities</h3>
          <div className="flex justify-center gap-6 flex-wrap">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("wifi")} />
              Wifi
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("parking")} />
              Parking
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("breakfast")} />
              Breakfast
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("pets")} />
              Pets allowed
            </label>
          </div>
        </div>
        <div>
          <h3 className="text-center pb-5 pt-5">Venue Location</h3>
          <label className="block font-medium mb-1">Address</label>
          <input
            {...register("address")}
            placeholder="Address"
            required
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">City</label>
          <input
            {...register("city")}
            placeholder="City"
            required
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">ZIP</label>
          <input
            {...register("zip")}
            placeholder="ZIP"
            required
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Country</label>
          <input
            {...register("country")}
            placeholder="Country"
            required
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Continent</label>
          <input
            {...register("continent")}
            placeholder="Continent"
            required
            className="w-full p-3 border rounded-lg"
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

export default EditVenueModal;
