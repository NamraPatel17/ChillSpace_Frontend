import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const submitHandler = async (data) => {
    try {

      const res = await axios.post("/user/login", data);

      if (res.status === 200) {

        toast.success("Login Success 🎉");

        const role = res.data.role;

        if (role === "Guest") {
          navigate("/user");
        }
        else if (role === "Admin") {
          navigate("/admin");
        }
        else if (role === "Host") {
          navigate("/host");
        }
        else {
          toast.error("Invalid Role");
          navigate("/");
        }

      }

    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* LEFT IMAGE */}
      <div className="hidden md:flex w-1/2 h-screen">
        <img
          src="/LoginImage.jpg"
          alt="login"
          className="object-cover w-full h-full"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="flex items-center justify-center w-full md:w-1/2 px-6">

        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

          <h2 className="text-3xl font-bold mb-2 text-center">
            Welcome Back 👋
          </h2>

          <p className="text-gray-500 text-center mb-6">
            Login to your ChillSpace account
          </p>

          <form
            onSubmit={handleSubmit(submitHandler)}
            className="space-y-4"
          >

            {/* EMAIL */}
            <div>
              <input
                type="email"
                placeholder="Enter Email"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("email", {
                  required: "Email is required"
                })}
              />

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <input
                type="password"
                placeholder="Enter Password"
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

            {/* FORGOT PASSWORD */}
            <div className="flex justify-end">
              <Link
                to="/forgotpassword"
                className="text-sm text-blue-500 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition font-semibold"
            >
              Login
            </button>

          </form>

          {/* SIGNUP LINK */}
          <p className="text-center text-gray-500 mt-6">
            Not registered?
            <Link
              to="/signup"
              className="text-blue-500 font-semibold ml-1 hover:underline"
            >
              Sign Up
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}