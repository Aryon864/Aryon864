import { useRef } from "react";
import { useNavigate } from "react-router";
import ai from "../../assets/adobe-illustrator-svgrepo-com.svg";
import adp from "../../assets/adobe-premiere-svgrepo-com.svg";
import aae from "../../assets/adobe-after-effects-svgrepo-com.svg";
import ap from "../../assets/adobe-photoshop-svgrepo-com.svg";
import {
  motion,
  useScroll,
  useAnimationFrame,
  easeInOut,
} from "motion/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RiArrowRightUpLine, RiArrowRightLine } from "@remixicon/react";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

function Hero() {
  const ref = useRef();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <main ref={ref} className="relative mt-20">
      <Section1 />
    </main>
  );
}

export default Hero;

const Section1 = () => {
  const p =
    "We help SaaS companies and startups launch, explain, and grow through premium video content that converts.";

  const ref = useRef(null);
  const timeRef = useRef(0);

  useAnimationFrame((t, delta) => {
    timeRef.current += delta;
    const wave = Math.sin(timeRef.current * 0.003);
    const y = ((wave + 1) / 2) * -10;
    if (ref.current) {
      ref.current.style.transform = `translateY(${y}px)`;
    }
  });

  useGSAP(() => {
    gsap.from("#para", {
      opacity: 0,
      filter: "blur(5px)",
      duration: 1,
      stagger: 0.1,
      delay: 0.09,
    });
  });

  const navigate = useNavigate();

  return (
    <motion.div className="flex flex-col text-center max-w-5xl mx-auto pt-20 scale-[90%]">
      <motion.div
        initial={{ opacity: 0, filter: "blur(10px)", scale: 0.99 }}
        animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
        transition={{ duration: 1, ease: easeInOut }}
        className="flex justify-center items-center pb-10"
      >
        <h1 className="text-xs sm:text-[1.5vw] md:text-[1.1vw] px-4 py-1 rounded-4xl border-[2px] border-neutral-300">
          🎬 Video Production Studio for SaaS & Startups
        </h1>
      </motion.div>

      <div>
        <motion.span className="text-center max-w-2xl mx-auto sm:leading-tight">
          <motion.h1
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.2, ease: easeInOut }}
            className="text-[9.5vw] md:text-[6rem] tracking-tighter font-Font2 text-transparent bg-linear-[180deg,#0e1c29_34%,#5e788f80_124%] bg-clip-text"
          >
            Videos That Help
          </motion.h1>

          <motion.h1
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.4, ease: easeInOut }}
            className="text-[9.5vw] md:text-[6rem] tracking-tighter font-Font2 text-transparent bg-linear-[180deg,#0e1c29_34%,#5e788f80_124%] bg-clip-text"
          >
            You Ship & Grow
          </motion.h1>
        </motion.span>
      </div>

      <motion.ul
        initial={{ opacity: 0, filter: "blur(10px)", scale: 0.99 }}
        animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
        transition={{ duration: 1, ease: easeInOut }}
        ref={ref}
        className="sm:flex absolute sm:visible hidden"
      >
        <li className="size-20 absolute -top-10 left-30">
          <img src={adp} className="size-18" alt="Premiere Pro" />
        </li>
        <li className="size-20 absolute left-180 -top-20">
          <img src={aae} className="size-18" alt="After Effects" />
        </li>
        <li className="size-20 absolute top-95 left-15">
          <img src={ap} className="size-18" alt="Photoshop" />
        </li>
        <li className="size-20 absolute top-105 left-200">
          <img src={ai} className="size-18" alt="Illustrator" />
        </li>
      </motion.ul>

      <div className="pt-10 px-8 hidden:px-1 max-w-sm sm:max-w-xl hidden:max-w-2xl mx-auto">
        <span className="text-[3.5vw] sm:text-[2.7vw] hidden:text-[1.5rem] flex justify-center flex-wrap gap-2">
          {p.split(" ").map((itm, indx) => (
            <p id="para" key={indx}>{itm}</p>
          ))}
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, filter: "blur(10px)", scale: 0.99 }}
        animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
        transition={{ duration: 1, ease: easeInOut }}
        className="flex items-center justify-center py-15 gap-5"
      >
        <motion.span whileHover={{ scale: 1.01, y: -1.5 }} whileTap={{ scale: 0.97 }}>
          <button
            onClick={() => navigate("/contact")}
            className="text-neutral-100 flex items-center gap-1 cursor-pointer font-Font2 py-2 px-3 sm:py-3.5 sm:px-7 bg-linear-to-b from-gray-950 to-gray-600 hover:shadow-gray-800/50 hover:shadow-lg duration-300 ease-in rounded-4xl text-xs sm:text-[1.6vw] md:text-[1.1vw] shadow-lg shadow-gray-600/50 inset-shadow-sm inset-shadow-gray-400"
          >
            Get in Touch <RiArrowRightUpLine className="size-5" />
          </button>
        </motion.span>
        <motion.span whileHover={{ scale: 1.01, y: -1.5 }} whileTap={{ scale: 0.97 }} className="items-center">
          <button
            onClick={() => navigate("/project")}
            className="font-Font2 md:text-xl bg-linear-to-r from-[#CCD8E1] to-[#F0F7FE] flex gap-1 items-center text-neutral-950 text-xs sm:text-[1.6vw] md:text-[1.1vw] py-2 px-3 sm:py-3.5 sm:px-7 rounded-4xl cursor-pointer shadow-lg shadow-neutral-500/50 inset-shadow-sm inset-shadow-neutral-100 hover:shadow-neutral-600/50 hover:shadow-lg duration-300 ease-in"
          >
            See Our Work <RiArrowRightLine className="size-5" />
          </button>
        </motion.span>
      </motion.div>
    </motion.div>
  );
};
