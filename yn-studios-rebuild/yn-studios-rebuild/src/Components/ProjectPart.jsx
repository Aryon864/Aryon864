import React from "react";
import PartOne from "./Project/PartOne";

import { Link, Element } from "react-scroll";
function ProjectPart() {
  return (
    <>
      <Element>
        <div className=" rounded-[5vw]  relative ">
          <div name="projects" className=" max-w-7xl mx-auto px-3 ">
            <PartOne />
          </div>
        </div>
      </Element>
    </>
  );
}

export default ProjectPart;
