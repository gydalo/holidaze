import React, { useState } from "react";

const RegisterForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
        console.error("Passwords do not match");
        return;
      }
  
      console.log("Registering:", { name, email, password });
    };

  return (
    <form onSubmit={handleSubmit} className="">
      <h2 className="">Register</h2>

      <div>
        <label>Username</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className=""
          required
        />
      </div>


      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className=""
          required
        />
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className=""
          required
        />
      </div>

     <div>
        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className=""
          required
        />
      </div>

      <button type="submit" className="">
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
