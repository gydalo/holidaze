import { useState } from "react";
import { useAuth } from "../../api/auth/useAuth";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ReusableButton from "../ReusableButton";

const schema = yup.object({
  email: yup.string().email("Please enter a valid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

type LoginFormData = yup.InferType<typeof schema>;

const LoginForm = () => {
  const { login, loading, error } = useAuth();
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setSuccessMessage("");
    try {
      await login(data);
      setSuccessMessage("You are now logged in!");
    } catch {
      setSuccessMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto space-y-6">
      <h2 className="text-center">Login</h2>

      <div>
        <label className="block font-medium mb-1 pl-2">Email</label>
        <input
          type="email"
          {...register("email")}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1 pl-2">{errors.email.message}</p>
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
          <p className="text-red-500 text-sm mt-1 pl-2">{errors.password.message}</p>
        )}
      </div>

      {error && <p className="text-red-500 text-center">Invalid email or password</p>}

      <ReusableButton type="submit" className="w-full rounded-lg" disabled={loading}>
        {loading ? "Logging in..." : "Log In"}
      </ReusableButton>


      {successMessage && <p className="text-center">{successMessage}</p>}
    </form>
  );
};

export default LoginForm;