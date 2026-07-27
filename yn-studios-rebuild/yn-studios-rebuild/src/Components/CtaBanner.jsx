import { motion, easeInOut } from "motion/react";
import { RiArrowRightUpLine } from "@remixicon/react";
import { useNavigate } from "react-router";

function CtaBanner() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto scale-[90%] px-4 pt-10 pb-5">
      <motion.div
        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3, ease: easeInOut }}
        className="bg-neutral-950 rounded-3xl py-16 sm:py-20 px-8 sm:px-16 text-center"
      >
        <h2 className="font-Font2 text-white text-3xl sm:text-5xl tracking-tighter pb-4">
          Have a project in mind?
        </h2>
        <p className="font-Font2 text-neutral-400 text-sm sm:text-lg max-w-lg mx-auto pb-8">
          Whether you are launching a product, explaining a feature, or building a content engine, we would love to hear about it.
        </p>
        <motion.span
          whileHover={{ scale: 1.01, y: -1.5 }}
          whileTap={{ scale: 0.97 }}
          className="inline-block"
        >
          <button
            onClick={() => navigate("/contact")}
            className="text-neutral-100 flex items-center gap-1 cursor-pointer font-Font2 py-3 px-7 sm:py-3.5 sm:px-10 bg-linear-to-r from-[#CCD8E1] to-[#F0F7FE] text-neutral-950 rounded-4xl shadow-lg shadow-neutral-500/50 inset-shadow-sm inset-shadow-neutral-100 hover:shadow-neutral-600/50 hover:shadow-lg duration-300 ease-in text-sm sm:text-base"
          >
            Let's Talk <RiArrowRightUpLine className="size-5" />
          </button>
        </motion.span>
      </motion.div>
    </div>
  );
}

export default CtaBanner;
