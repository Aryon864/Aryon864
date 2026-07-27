import { easeInOut, motion } from "motion/react";

function Clients() {
  // Replace these with real client names once available
  const clients = [
    "Client One",
    "Client Two",
    "Client Three",
    "Client Four",
    "Client Five",
    "Client Six",
  ];

  return (
    <div className="max-w-7xl mx-auto scale-[90%] py-10">
      <motion.p
        initial={{ opacity: 0, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2, ease: easeInOut }}
        className="text-center font-Font2 text-neutral-500 text-sm sm:text-base pb-8"
      >
        Trusted by founders and teams building the future
      </motion.p>

      <motion.div
        initial={{ opacity: 0, filter: "blur(10px)", scale: 0.99 }}
        whileInView={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3, ease: easeInOut }}
        className="flex flex-wrap justify-center items-center gap-8 sm:gap-14 px-4"
      >
        {clients.map((client, idx) => (
          <div
            key={idx}
            className="font-Font2 text-neutral-400 text-lg sm:text-xl tracking-tight"
          >
            {/* Replace with <img src={logo} alt={client} className="h-8 sm:h-10 object-contain opacity-50 hover:opacity-100 transition-opacity" /> when you have logos */}
            {client}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default Clients;
