import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
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
        toast.success("User registered successfully 🎉");
        navigate("/");
      }

    } catch (err) {
      toast.error(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* LEFT IMAGE */}
      <div className="hidden md:flex w-1/2 h-screen">
        <img
          src="/SignUpImage.jpg"
          alt="signup"
          className="object-cover w-full h-full"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="flex items-center justify-center w-full md:w-1/2 px-6">

        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

          <h2 className="text-3xl font-bold mb-2 text-center">
            Create Account 🚀
          </h2>

          <p className="text-gray-500 text-center mb-6">
            Signup to start booking amazing stays
          </p>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">

            {/* FULL NAME */}
            <div>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("fullName", { required: "Full Name is required" })}
              />

              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("email", { required: "Email is required" })}
              />

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PHONE */}
            <div>
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("phoneNumber")}
              />
            </div>

            {/* ROLE */}
            <div>
              <select
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters"
                  }
                })}
              />

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition font-semibold"
            >
              Sign Up
            </button>

          </form>

          {/* LOGIN LINK */}
          <p className="text-center text-gray-500 mt-6">
            Already have an account?
            <Link
              to="/"
              className="text-blue-500 font-semibold ml-1 hover:underline"
            >
              Login
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}