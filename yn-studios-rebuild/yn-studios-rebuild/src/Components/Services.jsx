import { easeInOut, motion } from "motion/react";
import { RiArrowRightUpLine } from "@remixicon/react";
import {
  IconVideo,
  IconRocket,
  IconMessageChatbot,
  IconPresentationAnalytics,
} from "@tabler/icons-react";
import { Element } from "react-scroll";

function Services() {
  const services = [
    {
      icon: <IconVideo size={32} />,
      title: "Video Editing",
      description:
        "Raw footage into polished, scroll-stopping content. YouTube, social, product demos, and everything in between.",
    },
    {
      icon: <IconRocket size={32} />,
      title: "Launch Videos",
      description:
        "Hype reels and product launch videos that build anticipation and make your release day count.",
    },
    {
      icon: <IconPresentationAnalytics size={32} />,
      title: "Animated Explainers",
      description:
        "Complex features explained simply. Motion graphics that help your audience understand what you built and why it matters.",
    },
    {
      icon: <IconMessageChatbot size={32} />,
      title: "Animated Talking Heads",
      description:
        "Founder videos, product walkthroughs, and thought leadership content with clean animated overlays and graphics.",
    },
  ];

  const sp = "What we do best";

  const container = {
    hidden: { opacity: 0, scale: 0.99, filter: "blur(10px)" },
    show: {
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        staggerChildren: 0.1,
        delay: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 1, ease: easeInOut } },
  };

  return (
    <Element>
      <div name="services" className="pt-15 sm:pt-30 max-w-7xl mx-auto scale-[90%] relative px-4">
        <span>
          <motion.span
            initial={{ opacity: 0, scale: 0.99, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: easeInOut }}
            className="flex items-center"
          >
            <h1 className="text-transparent tracking-tighter bg-linear-[180deg,#0e1c29_34%,#5e788f80_124%] bg-clip-text font-Font2 text-5xl sm:text-6xl md:text-7xl overflow-hidden">
              Services
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
            {sp.split(" ").map((itm, idx) => (
              <motion.p variants={item} key={idx}>{itm}</motion.p>
            ))}
          </motion.span>
        </span>

        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)", scale: 0.99 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid sm:grid-cols-2 gap-5 pt-10 pb-10"
        >
          {services.map((svc, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.01, y: -2 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-200/30 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-[0_3px_10px_rgb(0,0,0,0.1)] hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] transition-shadow"
            >
              <div className="text-neutral-700 pb-4">{svc.icon}</div>
              <h3 className="font-Font2 text-xl sm:text-2xl tracking-tight text-neutral-900 pb-3">
                {svc.title}
              </h3>
              <p className="font-Font2 text-sm sm:text-base text-neutral-600 leading-relaxed">
                {svc.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Element>
  );
}

export default Services;
