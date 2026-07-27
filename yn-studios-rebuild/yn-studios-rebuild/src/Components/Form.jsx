import React, { useRef, useState } from "react";
import { easeInOut, motion } from "motion/react";
import { RiArrowRightUpLine, RiCheckLine, RiCloseLine } from "@remixicon/react";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router";

function ContactForm() {
  const container = {
    hidden: { opacity: 0, scale: 0.99, filter: "blur(10px)" },
    show: {
      opacity: 1,
      filter: "blur(0px)",
      transition: { staggerChildren: 0.1, delay: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 1, ease: easeInOut } },
  };

  const pp = "Have a project? Let's make it happen.";
  const form = useRef();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null); // null | "sending" | "success" | "error"

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus("sending");

    emailjs
      .sendForm("service_b5je1qb", "template_dysik6r", form.current, {
        publicKey: "V1icMb9x1wJPwVEFC",
      })
      .then(
        () => {
          setStatus("success");
          form.current.reset();
          setTimeout(() => setStatus(null), 4000);
        },
        (error) => {
          setStatus("error");
          console.error("EmailJS error:", error.text);
          setTimeout(() => setStatus(null), 4000);
        }
      );
  };

  return (
    <div className="bg-[#FFF0DC] overflow-clip min-h-screen">
      <div className="max-w-5xl mx-auto scale-[90%] pt-5">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="pb-5"
        >
          <button
            onClick={() => navigate("/")}
            className="font-Font2 text-sm text-neutral-600 hover:text-neutral-900 cursor-pointer"
          >
            ← Back to Home
          </button>
        </motion.div>

        <span>
          <motion.span
            initial={{ opacity: 0, scale: 0.99, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: easeInOut }}
            className="flex"
          >
            <h1 className="text-transparent tracking-tighter bg-linear-[180deg,#0e1c29_34%,#5e788f80_124%] bg-clip-text font-Font2 text-5xl sm:text-6xl md:text-6x">
              Get in Touch
            </h1>
            <span className="pl-3 pt-2">
              <RiArrowRightUpLine size={60} />
            </span>
          </motion.span>

          <motion.span
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="md:text-lg font-Font2 flex gap-1"
          >
            {pp.split(" ").map((itm, idx) => (
              <motion.p variants={item} key={idx}>{itm}</motion.p>
            ))}
          </motion.span>
        </span>

        <motion.form
          ref={form}
          onSubmit={sendEmail}
          initial={{ opacity: 0, filter: "blur(10px)", scale: 0.99 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          viewport={{ once: true }}
          className="rounded-3xl flex flex-col items-center gap-10 py-10 bg-gray-200/30 backdrop-blur-sm mt-5 overflow-y-auto overflow-x-clip shadow-[0_3px_10px_rgb(0,0,0,0.2)] mb-10"
        >
          <div className="flex flex-col gap-2 w-sm px-12 sm:px-0">
            <label htmlFor="user_name" className="after:content-['*'] after:text-red-500 after:ml-1 font-Font2">
              Full Name
            </label>
            <input
              type="text"
              name="user_name"
              required
              placeholder="Enter your name"
              className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 rounded-lg p-3 shadow-xs shadow-gray-500 bg-gray-200"
            />
          </div>

          <div className="flex flex-col gap-2 w-sm px-12 sm:px-0">
            <label htmlFor="user_email" className="after:content-['*'] after:text-red-500 after:ml-1 font-Font2">
              Email
            </label>
            <input
              type="email"
              name="user_email"
              required
              placeholder="Enter your email"
              className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 rounded-lg p-3 shadow-xs shadow-gray-500 bg-gray-200"
            />
          </div>

          <div className="flex flex-col gap-2 w-sm px-12 sm:px-0">
            <label htmlFor="Subject" className="after:content-['*'] after:text-red-500 after:ml-1 font-Font2">
              What do you need?
            </label>
            <select
              name="Subject"
              required
              className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 rounded-lg p-3 shadow-xs shadow-gray-500 bg-gray-200 font-Font2"
            >
              <option value="">Select a service</option>
              <option value="Video Editing">Video Editing</option>
              <option value="Launch Video">Launch Video</option>
              <option value="Animated Explainer">Animated Explainer</option>
              <option value="Animated Talking Head">Animated Talking Head</option>
              <option value="Other">Something else</option>
            </select>
          </div>

          <div className="flex flex-col gap-2 w-sm px-12 sm:px-0">
            <label htmlFor="message" className="font-Font2">Tell us about your project</label>
            <textarea
              placeholder="What are you building? What does the video need to do?"
              name="message"
              rows={4}
              className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 rounded-lg p-3 shadow-xs shadow-gray-500 bg-gray-200"
            />
          </div>

          <div className="flex flex-col gap-2 w-sm px-12 sm:px-0">
            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-green-700 font-Font2 text-sm pb-2"
              >
                <RiCheckLine size={18} /> Sent! We will get back to you soon.
              </motion.div>
            )}
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-600 font-Font2 text-sm pb-2"
              >
                <RiCloseLine size={18} /> Something went wrong. Please try again.
              </motion.div>
            )}
            <input
              type="submit"
              value={status === "sending" ? "Sending..." : "Send Message"}
              disabled={status === "sending"}
              className="font-Font2 md:text-xl bg-linear-to-r from-[#CCD8E1] to-[#F0F7FE] text-neutral-950 text-xs sm:text-[1.6vw] md:text-[1.1vw] py-1.5 px-2 sm:py-3.5 sm:px-7 rounded-4xl cursor-pointer shadow-lg shadow-neutral-500/50 inset-shadow-sm inset-shadow-neutral-100 hover:shadow-neutral-600/50 hover:shadow-lg duration-300 ease-in disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </motion.form>
      </div>
    </div>
  );
}

export default ContactForm;
