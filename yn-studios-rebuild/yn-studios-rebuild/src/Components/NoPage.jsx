import React from "react";
import { Link } from "react-router";
import { motion, easeInOut } from "motion/react";
import { RiArrowRightLine } from "@remixicon/react";

function NoPage() {
  return (
    <div className="bg-[#FFF0DC] min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, filter: "blur(10px)", scale: 0.99 }}
        animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
        transition={{ duration: 0.8, ease: easeInOut }}
        className="text-center"
      >
        <h1 className="text-transparent tracking-tighter bg-linear-[180deg,#0e1c29_34%,#5e788f80_124%] bg-clip-text font-Font2 text-8xl sm:text-9xl pb-4">
          404
        </h1>
        <p className="font-Font2 text-neutral-600 text-lg sm:text-xl pb-8">
          This page does not exist. Maybe it was a rough cut that did not make the final edit.
        </p>
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.01, y: -1.5 }}
            whileTap={{ scale: 0.97 }}
            className="font-Font2 md:text-xl bg-linear-to-r from-[#CCD8E1] to-[#F0F7FE] flex gap-1 items-center text-neutral-950 text-sm sm:text-base py-2 px-5 sm:py-3.5 sm:px-7 rounded-4xl cursor-pointer shadow-lg shadow-neutral-500/50 inset-shadow-sm inset-shadow-neutral-100 hover:shadow-neutral-600/50 hover:shadow-lg duration-300 ease-in mx-auto"
          >
            Back to Home <RiArrowRightLine className="size-5" />
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}

export default NoPage;
