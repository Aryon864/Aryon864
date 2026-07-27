import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easeInOut, motion } from "motion/react";
import { useNavigate } from "react-router";
import { RiArrowRightUpLine, RiArrowRightLine } from "@remixicon/react";
import { Element } from "react-scroll";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

function PartOne() {
  const tag = "Our Work";
  const para = "A selection of recent projects for SaaS founders and startups";

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

  const navigate = useNavigate();

  // Replace descriptions with real project context when available
  const projects = [
    {
      video: "https://res.cloudinary.com/dbuo8qrkg/video/upload/v1761414108/video1_cey3ii.mp4",
      title: "Project Title",
      type: "Launch Video",
      span: "col-span-2",
      height: "h-[100vw] sm:h-[50vw]",
    },
    {
      video: "https://res.cloudinary.com/dbuo8qrkg/video/upload/v1761414109/video2_cvlcuz.mp4",
      title: "Project Title",
      type: "Animated Explainer",
      span: "",
      height: "h-[60vh] md:h-[55vw]",
    },
    {
      video: "https://res.cloudinary.com/dbuo8qrkg/video/upload/v1761455460/video3_mcqyce.mp4",
      title: "Project Title",
      type: "Video Edit",
      span: "",
      height: "h-[60vh] md:h-[55vw]",
    },
  ];

  return (
    <Element>
      <div name="projects" className="mask-b-from-85% scale-[90%] mx-auto">
        <div id="work" className="pt-15 sm:pt-20">
          <div className="flex items-center h-10 sm:h-20 justify-between gap-2">
            <motion.span
              initial={{ opacity: 0, scale: 0.99, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: easeInOut }}
              className="flex items-center"
            >
              <motion.h1 className="text-transparent tracking-tighter bg-linear-[180deg,#0e1c29_34%,#5e788f80_124%] bg-clip-text font-Font2 text-5xl sm:text-6xl md:text-7xl overflow-hidden">
                {tag}
              </motion.h1>
              <span className="pl-3 pt-2">
                <RiArrowRightUpLine size={60} />
              </span>
            </motion.span>
          </div>

          <motion.span
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="md:text-xl pt-15 sm:pt-5 font-Font2 flex flex-wrap gap-1"
          >
            {para.split(" ").map((itm, indx) => (
              <motion.p variants={item} key={indx}>{itm}</motion.p>
            ))}
          </motion.span>
        </div>

        <div className="pt-20">
          {/* Featured project */}
          <motion.div
            initial={{ opacity: 0, y: 50, filter: "blur(10px)", scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative group"
          >
            <video
              loop
              autoPlay
              muted
              playsInline
              className="h-[100vw] sm:h-[50vw] w-full object-cover rounded-xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]"
              src={projects[0].video}
            />
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
              <span className="font-Font2 text-xs bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-neutral-700">
                {projects[0].type}
              </span>
            </div>
          </motion.div>

          {/* Two-column grid */}
          <div className="grid sm:grid-cols-2 gap-10 mt-10">
            {projects.slice(1).map((proj, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 + idx * 0.1 }}
                className="relative group"
              >
                <video
                  loop
                  autoPlay
                  muted
                  playsInline
                  className={`${proj.height} w-full aspect-video object-cover rounded-xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]`}
                  src={proj.video}
                />
                <div className="absolute bottom-4 left-4">
                  <span className="font-Font2 text-xs bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-neutral-700">
                    {proj.type}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center py-10 gap-5">
          <motion.span whileHover={{ scale: 1.01, y: -1.5 }} whileTap={{ scale: 0.97 }} className="items-center">
            <button
              onClick={() => navigate("/project")}
              className="font-Font2 md:text-xl bg-linear-to-r from-[#CCD8E1] to-[#F0F7FE] flex gap-1 items-center text-neutral-950 text-xs sm:text-[1.6vw] md:text-[1.1vw] py-1.5 px-2 sm:py-3 sm:px-7 rounded-4xl cursor-pointer shadow-lg shadow-neutral-500/50 inset-shadow-sm inset-shadow-neutral-100 hover:shadow-neutral-600/50 hover:shadow-lg duration-300 ease-in"
            >
              View All Projects <RiArrowRightLine className="size-5" />
            </button>
          </motion.span>
        </div>
      </div>
    </Element>
  );
}

export default PartOne;
