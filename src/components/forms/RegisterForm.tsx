import { useForm, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../../api/auth/useAuth";
import { useState } from "react";

const schema = yup.object({
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
  venueManager: yup.boolean().optional(),
}).required();

type FormData = yup.InferType<typeof schema>;

const RegisterForm = () => {
  const { register: registerUser, loading, error: authError } = useAuth();
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema) as Resolver<FormData>,
  });

  const onSubmit = async (data: FormData) => {
    const { confirmPassword, ...profileData } = data;

    try {
      await registerUser({
        ...profileData,
        venueManager: profileData.venueManager || false,
      });
      setSuccessMessage("Your account has been created successfully!");
      setSubmitError("");
    } catch {
      setSuccessMessage("");
      setSubmitError("Failed to register. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="">
      <h2>Register</h2>

      <div>
        <label>Username</label>
        <input type="text" {...register("name")} />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label>Email</label>
        <input type="email" {...register("email")} />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <label>Password</label>
        <input type="password" {...register("password")} />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
      </div>

      <div>
        <label>Confirm Password</label>
        <input type="password" {...register("confirmPassword")} />
        {errors.confirmPassword && (
          <p className="text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div>
        <label>
          <input type="checkbox" {...register("venueManager")} />
          Register as a Venue Manager
        </label>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>

      {submitError && <p className="text-red-500">{submitError}</p>}
      {authError && <p className="text-red-500">{authError}</p>}
      {successMessage && <p className="">{successMessage}</p>}
    </form>
  );
};

export default RegisterForm;