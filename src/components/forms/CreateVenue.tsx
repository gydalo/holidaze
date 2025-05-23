import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import { createVenue } from "../../api/venues/createVenue";
import ReusableButton from "../ReusableButton";

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
  onSuccess: () => void;
};

function CreateVenue({ onSuccess }: Props) {
  const { register, handleSubmit, control, reset } = useForm<FormData>({
    defaultValues: {
      media: [{ url: "", alt: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "media",
  });

  const [error, setError] = useState("");

  const onSubmit = async (data: FormData) => {
    setError("");

    const newVenue = {
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
    };

    try {
      await createVenue(newVenue);
      reset();
      onSuccess();
    } catch {
      setError("Failed to create venue. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-lg mx-auto p-4"
    >
      <h2 className="text-center mb-6">New Venue</h2>

      <div>
        <h3 className="text-center pb-5">Venue Details</h3>
        <label className="block font-medium mb-1">Venue Name</label>
        <input
          {...register("name")}
          placeholder="Enter the Venue name"
          required
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Venue Description</label>
        <textarea
          {...register("description")}
          placeholder="Enter a description"
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
                placeholder="Alt text"
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
        <label className="block font-medium mb-1">Price / Night (NOK)</label>
        <input
          type="number"
          {...register("price")}
          placeholder="e.g. 1200"
          required
          className="w-full p-3 border rounded-lg"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Max Guests</label>
        <input
          type="number"
          {...register("maxGuests")}
          placeholder="e.g. 4"
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
        <label className="block font-medium mb-1">Country</label>
        <input
          {...register("country")}
          placeholder="Country"
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
        <label className="block font-medium mb-1">Continent</label>
        <input
          {...register("continent")}
          placeholder="Continent"
          required
          className="w-full p-3 border rounded-lg"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Address</label>
        <input
          {...register("address")}
          placeholder="Street address"
          required
          className="w-full p-3 border rounded-lg"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Zip Code</label>
        <input
          {...register("zip")}
          placeholder="ZIP Code"
          required
          className="w-full p-3 border rounded-lg"
        />
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <ReusableButton type="submit" className="w-full rounded-lg">
        Create Venue
      </ReusableButton>
    </form>
  );
}

export default CreateVenue;
