import { useForm, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../../api/auth/useAuth";
import { useState } from "react";
import ReusableButton from "../ReusableButton";

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
    venueManager: yup.boolean().optional(),
  })
  .required();

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
    void confirmPassword;

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto space-y-6"
    >
      <h2 className="text-center">Register</h2>

      <div>
        <label className="block font-medium mb-1 pl-2">Username</label>
        <input
          type="text"
          {...register("name")}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1 pl-2">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1 pl-2">Email</label>
        <input
          type="email"
          {...register("email")}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1 pl-2">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1 pl-2">Password</label>
        <input
          type="password"
          {...register("password")}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1 pl-2">
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1 pl-2">Confirm Password</label>
        <input
          type="password"
          {...register("confirmPassword")}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1 pl-2">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          {...register("venueManager")}
          id="venueManager"
        />
        <label htmlFor="venueManager" className="text-sm">
          Register as a Venue Manager
        </label>
      </div>

      <ReusableButton
        type="submit"
        className="w-full rounded-lg"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </ReusableButton>

      {submitError && <p className="text-red-500 text-center">{submitError}</p>}
      {authError && <p className="text-red-500 text-center">{authError}</p>}
      {successMessage && <p className="text-center">{successMessage}</p>}
    </form>
  );
};

export default RegisterForm;
