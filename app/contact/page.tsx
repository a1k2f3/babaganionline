"use client";



import { motion } from "framer-motion";
import { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaWhatsapp } from "react-icons/fa";
// Contact Us / Support Page

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // YOUR WHATSAPP NUMBER - Keep it here safely
    const whatsappNumber = "923117687149"; // ← This is correct now!

    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    // Create WhatsApp message
    const text =
      `New Contact Form Submission%0A%0A` +
      `*Name:* ${encodeURIComponent(formData.name)}%0A` +
      `*Email:* ${encodeURIComponent(formData.email)}%0A` +
      `*Phone:* ${encodeURIComponent(formData.phone)}%0A%0A` +
      `*Message:*%0A${encodeURIComponent(formData.message)}`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${text}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");

    // Success feedback
    setStatus("success");
    setTimeout(() => {
      setFormData({ name: "", email: "", phone: "", message: "" });
      setStatus("idle");
    }, 3000);
  };

  return (
    <section className="mt-20 bg-gradient-to-b from-white to-blue-50 py-16 px-6 md:px-20 flex justify-center items-center min-h-[90vh]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-2xl"
      >
        <h2 className="text-4xl font-bold text-center text-blue-700 mb-8 flex items-center justify-center gap-3">
          <FaWhatsapp className="text-green-500 text-5xl" />
          Contact Us via WhatsApp
        </h2>

        <p className="text-center text-gray-600 mb-8">
          Fill in your details and we'll receive your message instantly on WhatsApp!
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 text-lg" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 text-lg" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 text-lg" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="e.g. 03001234567"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Your Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Write your query here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all resize-none"
            />
          </div>

          {/* Status Messages */}
          {status === "success" && (
            <div className="p-4 bg-green-100 border border-green-300 text-green-700 rounded-xl text-center font-medium flex items-center justify-center gap-2">
              <FaWhatsapp className="text-2xl" />
              Opening WhatsApp... Your message is ready!
            </div>
          )}

          {status === "error" && (
            <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-xl text-center font-medium">
              Please fill all fields correctly.
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-green-700 transition-all text-lg shadow-lg"
          >
            <FaWhatsapp className="text-2xl" />
            Send via WhatsApp
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}