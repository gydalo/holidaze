import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../../api/auth/useAuth";
import { useState } from "react";

const schema = yup
  .object({
    name: yup
      .string()
      .min(2, "Username must be at least 2 characters")
      .required("Username is required"),
    email: yup
      .string()
      .email("Invalid email format")
      .matches(
        /^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/,
        "Must use a stud.noroff.no email"
      )
      .required("Email is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
    venueManager: yup.boolean(),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

const RegisterForm = () => {
  const { register: registerUser, loading, error } = useAuth();
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const { confirmPassword, ...profile } = data;
  
    try {
      await registerUser(profile);
      setSuccessMessage("Your account has been created successfully!");
    } catch (error) {
      setSuccessMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="">
      <h2 className="">Register</h2>

      <div>
        <label>Username</label>
        <input type="text" {...register("name")} />
        <p className="">{errors.name?.message}</p>
      </div>

      <div>
        <label>Email</label>
        <input type="email" {...register("email")} />
        <p className="">{errors.email?.message}</p>
      </div>

      <div>
        <label>Password</label>
        <input type="password" {...register("password")} />
        <p className="">{errors.password?.message}</p>
      </div>

      <div>
        <label>Confirm Password</label>
        <input type="password" {...register("confirmPassword")} />
        <p className="">{errors.confirmPassword?.message}</p>
      </div>

      {error && <p className="">{error}</p>}

      <div>
        <label>
          <input type="checkbox" {...register("venueManager")} />
          Register as a Venue Manager
        </label>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>

      {successMessage && <p className="">{successMessage}</p>}
    </form>
  );
};

export default RegisterForm;
