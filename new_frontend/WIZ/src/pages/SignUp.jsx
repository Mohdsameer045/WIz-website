import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

function SignUp({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Name is required.";
    } else if (formData.name.length < 3) {
      errors.name = "Name must be at least 3 characters.";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid.";
    }
    if (!formData.password.trim()) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    return errors;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };

        const response = await axios.post(
          "http://localhost:8080/api/auth/register",
          formData,
          config
        );
        console.log("Backend response:", response.data);
        localStorage.setItem("isAuthenticated", "true");
        toast.success("Sign Up Successful! Redirecting to your Dashboard...", {
          position: "top-center",
          autoClose: 2000,
        });
        setIsAuthenticated(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 2200);
      } catch (error) {
        console.error("Registration error:", error);
        const errorMessage =
          error.response && error.response.data
            ? error.response.data
            : "Registration failed. Please try again.";
        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } else {
      toast.error("Please fix the errors before submitting.", {
        position: "top-center",
        autoClose: 2000,
      });
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-br from-[#020B2D] to-[#010821] flex items-center justify-center relative overflow-hidden">
        {/* Animated Decorative Elements */}
        <motion.div
          className="absolute top-[-60px] left-[-60px] w-32 h-32 bg-yellow-500/20 rounded-full blur-2xl"
          animate={{ x: [0, 20, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-60px] right-[-60px] w-40 h-40 bg-green-500/20 rounded-full blur-2xl"
          animate={{ x: [0, -20, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Form Container */}
        <div className="bg-gray-800/80 rounded-lg shadow-lg p-8 w-full max-w-md relative z-10">
          <motion.h1
            className="text-3xl font-bold text-yellow-500 text-center mb-6"
            variants={fadeUpVariant}
            initial="hidden"
            animate="visible"
          >
            Sign Up
          </motion.h1>
          <motion.form
            className="space-y-4"
            onSubmit={handleSubmit}
            variants={fadeUpVariant}
            initial="hidden"
            animate="visible"
          >
            {/* Name Field */}
            <div>
              <label className="block text-gray-300 mb-1" htmlFor="name">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                aria-invalid={errors.name ? "true" : "false"}
                required
                className="mt-1 block w-full border border-gray-700 rounded-md p-2 bg-gray-900 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              {errors.name && (
                <motion.p
                  className="text-red-500 text-sm mt-1"
                  variants={fadeUpVariant}
                  initial="hidden"
                  animate="visible"
                >
                  {errors.name}
                </motion.p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-gray-300 mb-1" htmlFor="email">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                aria-invalid={errors.email ? "true" : "false"}
                required
                className="mt-1 block w-full border border-gray-700 rounded-md p-2 bg-gray-900 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              {errors.email && (
                <motion.p
                  className="text-red-500 text-sm mt-1"
                  variants={fadeUpVariant}
                  initial="hidden"
                  animate="visible"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-300 mb-1" htmlFor="password">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  aria-invalid={errors.password ? "true" : "false"}
                  required
                  className="mt-1 block w-full border border-gray-700 rounded-md p-2 pr-10 bg-gray-900 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400"
                  tabIndex={-1}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  className="text-red-500 text-sm mt-1"
                  variants={fadeUpVariant}
                  initial="hidden"
                  animate="visible"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                className="block text-gray-300 mb-1"
                htmlFor="confirmPassword"
              >
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                  required
                  className="mt-1 block w-full border border-gray-700 rounded-md p-2 pr-10 bg-gray-900 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.confirmPassword && (
                <motion.p
                  className="text-red-500 text-sm mt-1"
                  variants={fadeUpVariant}
                  initial="hidden"
                  animate="visible"
                >
                  {errors.confirmPassword}
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-md transition ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Submitting..." : "Sign Up"}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </>
  );
}

export default SignUp;
