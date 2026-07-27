import React from "react";
import { RiInstagramLine, RiTwitterXLine, RiFacebookLine, RiArrowRightLine } from "@remixicon/react";
import { Link, useNavigate } from "react-router";

function Footer() {
  const navigate = useNavigate();

  return (
    <div className="relative max-w-7xl mx-auto pt-10 py-2 px-5 sm:px-10 scale-[90%]">
      <div className="bg-neutral-950 h-auto text-white rounded-4xl mb-5 py-10 px-5 sm:px-10">
        <div className="flex flex-col hidden:flex-row hidden:justify-between hidden:items-center gap-8">
          <div>
            <h1 className="pb-4 text-xl sm:text-3xl hidden:text-4xl font-Font2 tracking-tighter">
              Let's bring your vision to life
            </h1>
            <p className="pb-6 text-xs sm:text-sm sm:max-w-lg leading-relaxed text-neutral-300">
              Launch videos, explainers, talking head content, or something entirely new. Tell us what you are building and we will figure out the best way to show it off.
            </p>
            <button
              onClick={() => navigate("/contact")}
              className="font-Font2 md:text-xl bg-linear-to-r from-[#CCD8E1] to-[#F0F7FE] flex gap-1 items-center text-neutral-950 text-xs sm:text-[1.6vw] md:text-[1.1vw] py-2 px-3 sm:py-3.5 sm:px-7 rounded-4xl cursor-pointer shadow-lg shadow-neutral-500/50 inset-shadow-sm inset-shadow-neutral-100 hover:shadow-neutral-600/50 hover:shadow-lg duration-300 ease-in"
            >
              Reach Out <RiArrowRightLine className="size-5" />
            </button>
          </div>

          <span className="flex hidden:justify-center gap-5 hidden:gap-10 pt-5 hidden:pt-0">
            <Link to="https://www.instagram.com/aryonchakraborty/" target="_blank">
              <RiInstagramLine size={30} />
            </Link>
            <Link to="https://x.com/aryonmotions?s=21" target="_blank">
              <RiTwitterXLine size={30} />
            </Link>
            <Link to="https://www.facebook.com/share/19p1TKedyw/" target="_blank">
              <RiFacebookLine size={30} />
            </Link>
          </span>
        </div>
      </div>
      <span className="pb-5 px-5 sm:px-15 flex justify-between">
        <h3 className="font-Font2 text-xs sm:text-base text-neutral-600">YN Studios</h3>
        <h3 className="font-Font2 text-xs sm:text-base text-neutral-600">© 2025</h3>
      </span>
    </div>
  );
}

export default Footer;
