import React from "react";
import Nav from "./Hero/Nav";
import Hero from "./Hero/Hero";
import { Link, Element } from "react-scroll";

function HeroSection() {
  return (
    <>
      <Element>
        <div
          name="home"
          className=" h-100vh w-full flex flex-col max-w-7xl mx-auto "
        >
          <Nav />

          <Hero />
        </div>
      </Element>
    </>
  );
}

export default HeroSection;
