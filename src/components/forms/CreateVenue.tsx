import { useForm } from "react-hook-form";
import { createVenue } from "../../api/venues/createVenue";

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
  onSuccess: () => void;
};

function CreateVenue({ onSuccess }: Props) {
  const { register, handleSubmit, reset } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const newVenue = {
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
    };

    try {
      await createVenue(newVenue);
      reset();
      onSuccess();
    } catch (error) {
      alert("Failed to create venue");
    }
  };

  return (
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
        placeholder="Price/ night"
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
      <input {...register("zip")} placeholder="ZIP code" required />
      <input {...register("country")} placeholder="Country" required />
      <input {...register("continent")} placeholder="Continent" required />
      <button type="submit" className="">
        Create Venue
      </button>
    </form>
  );
}

export default CreateVenue;
