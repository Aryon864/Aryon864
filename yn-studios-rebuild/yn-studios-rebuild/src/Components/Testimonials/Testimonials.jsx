import { Element } from "react-scroll";
import { RiArrowRightUpLine } from "@remixicon/react";
import { easeInOut, motion } from "motion/react";

function Testimonials() {
  const testimonials = [
    {
      quote: "YN Studios turned our product launch into something people actually stopped scrolling for. The video paid for itself in the first week.",
      name: "Your Client Name",
      title: "Founder, SaaS Company",
    },
    {
      quote: "We needed an explainer that made a complex product feel simple. They nailed it on the first pass. Our support tickets dropped noticeably.",
      name: "Your Client Name",
      title: "Head of Product",
    },
    {
      quote: "Working with YN was fast, easy, and the output looked like it came from a team three times the size. Highly recommend for any startup.",
      name: "Your Client Name",
      title: "CEO, Early-stage Startup",
    },
    {
      quote: "The talking head videos they produced made our founder content actually watchable. Clean, engaging, and on-brand every single time.",
      name: "Your Client Name",
      title: "Marketing Lead",
    },
  ];

  const tp = "What our clients say about working with us";

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
      <div name="testimonials" className="min-h-screen pt-15 sm:pt-30 max-w-7xl mx-auto scale-[90%] relative px-4">
        <span>
          <motion.span
            initial={{ opacity: 0, scale: 0.99, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: easeInOut }}
            className="flex items-center"
          >
            <h1 className="text-transparent leading-tight tracking-tighter bg-linear-[180deg,#0e1c29_34%,#5e788f80_124%] bg-clip-text font-Font2 text-5xl sm:text-6xl md:text-7xl overflow-hidden">
              Testimonials
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
            {tp.split(" ").map((itm, idx) => (
              <motion.p variants={item} key={idx}>{itm}</motion.p>
            ))}
          </motion.span>
        </span>

        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)", scale: 0.99 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mask-l-from-80% mask-r-from-80% relative flex flex-col items-center pt-15 sm:pt-20"
        >
          <div className="flex overflow-hidden gap-4">
            {/* First marquee set */}
            <ul className="flex gap-4 animate-marquee">
              {testimonials.map((t, idx) => (
                <li key={idx} className="h-60 w-[24rem] shrink-0 rounded-2xl bg-neutral-900 px-7 py-6 flex flex-col justify-between">
                  <p className="text-white text-sm sm:text-base leading-relaxed font-Font2">
                    "{t.quote}"
                  </p>
                  <div className="pt-4">
                    <h4 className="text-white font-Font2 text-sm font-semibold">{t.name}</h4>
                    <p className="text-neutral-400 font-Font2 text-xs">{t.title}</p>
                  </div>
                </li>
              ))}
            </ul>
            {/* Duplicate for seamless loop */}
            <ul className="flex gap-4 animate-marquee">
              {testimonials.map((t, idx) => (
                <li key={`dup-${idx}`} className="h-60 w-[24rem] shrink-0 rounded-2xl bg-neutral-900 px-7 py-6 flex flex-col justify-between">
                  <p className="text-white text-sm sm:text-base leading-relaxed font-Font2">
                    "{t.quote}"
                  </p>
                  <div className="pt-4">
                    <h4 className="text-white font-Font2 text-sm font-semibold">{t.name}</h4>
                    <p className="text-neutral-400 font-Font2 text-xs">{t.title}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </Element>
  );
}

export default Testimonials;
