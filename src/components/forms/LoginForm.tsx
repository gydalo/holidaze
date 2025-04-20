import { useState } from "react";
import { useAuth } from "../../api/auth/useAuth";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

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
    try {
      await login(data);
      setSuccessMessage("You are now logged in!");
    } catch {
      setSuccessMessage(""); 
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="">
      <h2 className="">Login</h2>

      <div>
        <label>Email</label>
        <input type="email" {...register("email")} className="" />
        <p className="">{errors.email?.message}</p>
      </div>

      <div>
        <label>Password</label>
        <input type="password" {...register("password")} className="" />
        <p className="">{errors.password?.message}</p>
      </div>

      {error && <p className="">Invalid email or password</p>}

      <button type="submit" className="" disabled={loading}>
        {loading ? "Logging in..." : "Log In"}
      </button>

      {successMessage && <p className="">{successMessage}</p>}
    </form>
  );
};

export default LoginForm;