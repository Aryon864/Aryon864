import React, { useState } from "react";
import {
  easeInOut,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import logo from "../../assets/logo2.png";
import { useRef } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useNavigate } from "react-router";

function Nav() {
  const navItem = [
    { titel: "Home", to: "home" },
    { titel: "Services", to: "services" },
    { titel: "Work", to: "projects" },
    { titel: "About", to: "about" },
    { titel: "Testimonials", to: "testimonials" },
  ];

  const ref = useRef();
  const { scrollY } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const [hover, setHover] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  function goToContact() {
    navigate("/contact");
  }

  function handleMobileNavClick() {
    setOpen(false);
  }

  return (
    <>
      <div className="relative">
        <motion.div
          ref={ref}
          animate={{
            marginTop: scrolled ? "1rem" : "0rem",
            filter: "blur(0px)",
            opacity: 1,
            scale: 1,
            transition: { duration: 1, ease: easeInOut },
          }}
          initial={{ opacity: 0, filter: "blur(10px)", scale: 0.99 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="h-[80px] scale-[90%] max-w-6xl mx-auto inset-x-0 backdrop-blur-md rounded-2xl flex justify-between items-center px-5 fixed top-0 z-20"
        >
          <nav>
            <img src={logo} alt="YN Studios" className="h-18 w-18 pt-3 object-cover" />
          </nav>

          {/* Desktop nav */}
          <nav className="hidden:flex items-center rounded-full px-5 py-2 hidden hidden:visible">
            {navItem.map((item, idx) => (
              <ScrollLink
                to={item.to}
                key={item.titel}
                smooth={true}
                duration={900}
                spy={true}
                offset={-70}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onMouseEnter={() => setHover(idx)}
                  onMouseLeave={() => setHover(null)}
                  className="cursor-pointer w-full relative text-center py-1 font-Font2 px-5 hover:text-neutral-900 text-neutral-700 text-[1.1vw]"
                >
                  {hover === idx && (
                    <motion.div
                      layoutId="hover"
                      className="border-[1px] border-neutral-400 inset-0 absolute h-full w-full rounded-full"
                    />
                  )}
                  <span>{item.titel}</span>
                </motion.div>
              </ScrollLink>
            ))}

            <div className="pl-3">
              <motion.div
                whileHover={{ scale: 1.01, y: -1.5 }}
                whileTap={{ scale: 0.97 }}
                onClick={goToContact}
                className="cursor-pointer bg-linear-to-b from-gray-950 to-gray-600 py-2 px-5 rounded-4xl shadow-lg shadow-gray-400/50 inset-shadow-sm inset-shadow-gray-400"
              >
                <button className="text-neutral-100 font-Font2 cursor-pointer">
                  Get in Touch
                </button>
              </motion.div>
            </div>
          </nav>

          {/* Mobile hamburger */}
          <div onClick={() => setOpen(!open)} className="hidden:hidden cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4 6l16 0" />
              <path d="M4 12l16 0" />
              <path d="M4 18l16 0" />
            </svg>
          </div>

          {/* Mobile dropdown */}
          {open && (
            <motion.div
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.5, ease: easeInOut }}
              className="hidden:hidden visible absolute top-20 right-0 w-60 rounded-2xl bg-white text-neutral-950 shadow-lg py-4"
            >
              <nav className="flex flex-col px-5 gap-1">
                {navItem.map((item) => (
                  <ScrollLink
                    to={item.to}
                    key={item.titel}
                    smooth={true}
                    duration={900}
                    spy={true}
                    offset={-70}
                    onClick={handleMobileNavClick}
                  >
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer w-full py-2 font-Font2 px-3 hover:text-neutral-900 text-neutral-700 text-sm rounded-lg hover:bg-neutral-100"
                    >
                      {item.titel}
                    </motion.div>
                  </ScrollLink>
                ))}
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { handleMobileNavClick(); goToContact(); }}
                  className="cursor-pointer mt-2 bg-linear-to-b from-gray-950 to-gray-600 py-2 px-5 rounded-4xl text-center shadow-lg shadow-gray-400/50 inset-shadow-sm inset-shadow-gray-400"
                >
                  <span className="text-neutral-100 font-Font2 text-sm">Get in Touch</span>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
}

export default Nav;
