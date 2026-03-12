import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Signup() {

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const navigate = useNavigate();

  const submitHandler = async (data) => {
    try {

      const res = await axios.post("/user/register", data);

      if (res.status === 201) {
        toast.success("User registered successfully");
        navigate("/");
      }

    } catch (err) {
      toast.error(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT IMAGE */}
      <div className="hidden md:flex w-1/2 h-screen">
        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
          alt="office"
          className="object-cover w-full h-full"
        />
      </div>

      {/* FORM */}
      <div className="flex items-center justify-center w-full md:w-1/2 px-6">

        <div className="w-full max-w-md">

          <h2 className="text-3xl font-bold mb-2">Create Account 🚀</h2>
          <p className="text-gray-500 mb-6">Signup to get started</p>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">

            {/* FULL NAME */}
            <div>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-3 border rounded-lg"
                {...register("fullName", { required: "Full Name is required" })}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 border rounded-lg"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PHONE */}
            <div>
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full p-3 border rounded-lg"
                {...register("phoneNumber")}
              />
            </div>

            {/* ROLE */}
            <div>
              <select
                className="w-full p-3 border rounded-lg"
                {...register("role")}
              >
                <option value="Guest">Guest</option>
                <option value="Host">Host</option>
              </select>
            </div>

            {/* PASSWORD */}
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 border rounded-lg"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters"
                  }
                })}
              />

              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
            >
              Signup
            </button>

          </form>

        </div>
      </div>

    </div>
  );
}