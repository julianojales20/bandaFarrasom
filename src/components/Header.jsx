import React from 'react'
import { motion } from 'framer-motion'
import headerImg from "../assets/images/header.JPG";
import logoBanda from "../assets/images/logoBanda.PNG";
import Image from "./Image";

const containerVariant = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const itemVariant = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Header() {
  return (
    <header>
      <div
        className="relative rounded-xl h-80 bg-cover bg-center flex items-center justify-center hero-banner"
        style={{
          backgroundImage: `url(${headerImg})`,
          backgroundPosition: "top center",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <motion.div
          className="relative z-10 text-center container px-4 hero-banner-content"
          variants={containerVariant}
          initial="hidden"
          animate="show"
        >
          <motion.div
            className="flex flex-col items-center gap-4"
            variants={itemVariant}
          >
            <Image
              src={logoBanda}
              alt="Banda Farrasom"
              loading="lazy"
              className="w-auto mx-auto h-[350px] sm:h-[150px] md:h-[200px] lg:h-[240px] object-contain"
              style={{ display: "block" }}
            />
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
}
