import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import { createVenue } from "../../api/venues/createVenue";

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>New Venue</h1>

      <h2>Venue Details</h2>
      <div>
        <label>Venue Name</label>
        <input {...register("name")} placeholder="Enter the Venue name" required />
      </div>

      <div>
        <label>Venue Description</label>
        <textarea {...register("description")} placeholder="Enter a description" required />
      </div>

      <div>
        <label>Images</label>
        {fields.map((field, index) => (
          <div key={field.id}>
            <input
              {...register(`media.${index}.url`)}
              placeholder="Image URL"
              required
            />
            <input
              {...register(`media.${index}.alt`)}
              placeholder="Alt text"
            />
            {index > 0 && (
              <button type="button" onClick={() => remove(index)}>
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => append({ url: "", alt: "" })}>
          Add Image
        </button>
      </div>

      <h2>Venue Price and Capacity</h2>
      <div>
        <label>Price / Night NOK</label>
        <input type="number" {...register("price")} placeholder="e.g. 1200" required />
      </div>

      <div>
        <label>Max Guests</label>
        <input type="number" {...register("maxGuests")} placeholder="e.g. 4" required />
      </div>

      <h2>Venue Location</h2>
      <div>
        <label>Country</label>
        <input {...register("country")} placeholder="Country" required />
      </div>

      <div>
        <label>City</label>
        <input {...register("city")} placeholder="City" required />
      </div>

      <div>
        <label>Continent</label>
        <input {...register("continent")} placeholder="Continent" required />
      </div>

      <div>
        <label>Address</label>
        <input {...register("address")} placeholder="Street address" required />
      </div>

      <div>
        <label>Zip Code</label>
        <input {...register("zip")} placeholder="ZIP Code" required />
      </div>

      <h2>Amenities</h2>
      <div>
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
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button type="submit">Create Venue</button>
    </form>
  );
}

export default CreateVenue;