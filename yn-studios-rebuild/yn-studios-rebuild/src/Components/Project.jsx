import { Link } from "react-router";
import { easeInOut, motion } from "motion/react";
import { RiArrowRightUpLine } from "@remixicon/react";

const ProjectPage = () => {
  const ps = "Everything we have shipped for SaaS companies and startups.";

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

  const projects = [
    { video: "https://res.cloudinary.com/dbuo8qrkg/video/upload/v1761414108/video1_cey3ii.mp4", type: "Launch Video", span: "col-span-2" },
    { video: "https://res.cloudinary.com/dbuo8qrkg/video/upload/v1761414109/video2_cvlcuz.mp4", type: "Animated Explainer", span: "" },
    { video: "https://res.cloudinary.com/dbuo8qrkg/video/upload/v1761455460/video3_mcqyce.mp4", type: "Video Edit", span: "" },
    { video: "https://res.cloudinary.com/dbuo8qrkg/video/upload/v1761414090/video4_xxkxnm.mp4", type: "Talking Head", span: "" },
    { video: "https://res.cloudinary.com/dbuo8qrkg/video/upload/v1761414101/video5_pumsp1.mp4", type: "Launch Video", span: "" },
    { video: "https://res.cloudinary.com/dbuo8qrkg/video/upload/v1761414083/video6_i7wzem.mp4", type: "Explainer", span: "" },
  ];

  return (
    <div className="bg-[#FFF0DC] relative px-5 overflow-clip">
      <div className="max-w-6xl mx-auto px-4">
        <div className="py-10">
          <motion.span
            initial={{ opacity: 0, scale: 0.99, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: easeInOut }}
            className="flex items-center"
          >
            <h1 className="text-transparent tracking-tighter bg-linear-[180deg,#0e1c29_34%,#5e788f80_124%] bg-clip-text font-Font2 text-5xl sm:text-6xl md:text-7xl overflow-hidden">
              All Work
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
            className="md:text-lg pt-8 sm:pt-5 font-Font2 text-neutral-700 flex flex-wrap gap-1"
          >
            {ps.split(" ").map((itm, idx) => (
              <motion.p variants={item} key={idx}>{itm}</motion.p>
            ))}
          </motion.span>
        </div>

        <div className="gap-5 py-5 grid grid-cols-2">
          {projects.map((proj, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50, filter: "blur(10px)", scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 + idx * 0.05 }}
              className={`${proj.span} relative group`}
            >
              <video
                loop
                autoPlay
                muted
                playsInline
                className="object-cover rounded-xl w-full"
                src={proj.video}
              />
              <div className="absolute bottom-3 left-3">
                <span className="font-Font2 text-xs bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-neutral-700">
                  {proj.type}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <span className="flex justify-center py-8">
          <Link to="/">
            <button className="font-Font3 md:text-xl bg-linear-to-r from-[#CCD8E1] to-[#F0F7FE] flex gap-2 items-center text-neutral-700 text-lg py-2 px-7 rounded-2xl cursor-pointer shadow-lg shadow-neutral-400/40 inset-shadow-sm inset-shadow-neutral-100">
              ← Back Home
            </button>
          </Link>
        </span>
      </div>
    </div>
  );
};

export default ProjectPage;
