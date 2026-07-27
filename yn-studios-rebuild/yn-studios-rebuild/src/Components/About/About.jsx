import React from "react";
import aryon from "../../assets/aryon.jpg";
import { Element } from "react-scroll";
import { Link } from "react-router";
import { RiInstagramLine, RiTwitterXLine, RiFacebookLine, RiArrowRightUpLine } from "@remixicon/react";
import { easeInOut, motion } from "motion/react";

function About() {
  const ap = "The people behind the pixels and timelines";

  const team = [
    {
      name: "Aryon Chakraborty",
      role: "Founder, Lead Editor",
      image: aryon,
      bio: "Video editor and motion designer who turns raw footage into stories that stick. Obsessed with pacing, color, and making every frame count.",
      socials: {
        instagram: "https://www.instagram.com/aryonchakraborty/",
        twitter: "https://x.com/aryonmotions?s=21",
        facebook: "https://www.facebook.com/share/19p1TKedyw/",
      },
    },
    {
      name: "Your Name Here",
      role: "Co-founder, Designer",
      image: null, // Replace with imported image
      bio: "Brings brand vision to life through graphic design, animated explainers, and visual identity work. Detail-oriented and deadline-driven.",
      socials: {},
    },
  ];

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

  return (
    <Element>
      <div name="about" className="pt-15 sm:pt-30 max-w-7xl mx-auto scale-[90%] relative px-4">
        <span>
          <motion.span
            initial={{ opacity: 0, scale: 0.99, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: easeInOut }}
            className="flex items-center"
          >
            <h1 className="text-transparent tracking-tighter bg-linear-[180deg,#0e1c29_34%,#5e788f80_124%] bg-clip-text font-Font2 text-5xl sm:text-6xl md:text-7xl overflow-hidden">
              About Us
            </h1>
            <span className="pl-3">
              <RiArrowRightUpLine size={60} />
            </span>
          </motion.span>

          <motion.span
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-sm flex-wrap md:text-lg pt-8 sm:pt-5 font-Font2 flex gap-1"
          >
            {ap.split(" ").map((itm, idx) => (
              <motion.p variants={item} key={idx}>{itm}</motion.p>
            ))}
          </motion.span>
        </span>

        {/* Studio intro */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)", scale: 0.99 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="pt-10"
        >
          <div className="bg-gray-200/30 backdrop-blur-sm rounded-2xl p-6 sm:p-10 shadow-[0_3px_10px_rgb(0,0,0,0.1)] mb-10">
            <p className="font-Font2 text-sm sm:text-lg leading-relaxed text-neutral-700">
              YN Studios is a two-person video production studio built for SaaS founders and startup teams. We started because we saw the same problem everywhere: great products buried under generic, forgettable content. We make videos that do the work for you. Launch videos that build hype. Explainers that replace 10 support tickets. Talking head content that makes founders look sharp and their product look inevitable.
            </p>
          </div>

          {/* Tools */}
          <div className="flex flex-wrap gap-3 mb-5 justify-center">
            {["Adobe Premiere Pro", "After Effects", "Illustrator", "Photoshop", "DaVinci Resolve", "Audition"].map((tool) => (
              <span key={tool} className="bg-gray-100 py-2.5 px-4 rounded-2xl font-Font2 text-xs sm:text-sm text-neutral-700">
                {tool}
              </span>
            ))}
          </div>

          <span className="flex border-dashed border-2 border-neutral-400 mb-10" />

          {/* Team grid */}
          <div className="grid sm:grid-cols-2 gap-8 pb-10">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 + idx * 0.15 }}
                className="bg-gray-100 rounded-2xl p-5 sm:p-7 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.15)] text-center"
              >
                {member.image ? (
                  <img
                    className="h-60 w-full max-w-[16rem] mx-auto object-cover object-top rounded-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)] mb-5"
                    src={member.image}
                    alt={member.name}
                  />
                ) : (
                  <div className="h-60 w-full max-w-[16rem] mx-auto rounded-xl bg-neutral-200 flex items-center justify-center mb-5">
                    <span className="font-Font2 text-neutral-400 text-sm">Photo</span>
                  </div>
                )}

                <div className="relative flex justify-center items-center gap-2 mb-3">
                  <span className="size-3 absolute animate-ping rounded-full bg-green-600 opacity-75 relative" />
                  <span className="relative flex size-3 rounded-full bg-green-600" />
                  <span className="font-Font2 text-xs text-neutral-500">Available for work</span>
                </div>

                <h2 className="font-Font2 text-2xl sm:text-3xl tracking-tight mb-1">{member.name}</h2>
                <p className="font-Font2 text-sm text-neutral-500 mb-4">{member.role}</p>
                <p className="font-Font2 text-sm text-neutral-600 leading-relaxed mb-5">{member.bio}</p>

                {Object.keys(member.socials).length > 0 && (
                  <span className="flex justify-center gap-6">
                    {member.socials.instagram && (
                      <Link to={member.socials.instagram} target="_blank"><RiInstagramLine size={24} /></Link>
                    )}
                    {member.socials.twitter && (
                      <Link to={member.socials.twitter} target="_blank"><RiTwitterXLine size={24} /></Link>
                    )}
                    {member.socials.facebook && (
                      <Link to={member.socials.facebook} target="_blank"><RiFacebookLine size={24} /></Link>
                    )}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Element>
  );
}

export default About;
