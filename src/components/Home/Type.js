import React from "react";
import Typewriter from "typewriter-effect";

const DEFAULT_STRINGS = [
  "Software Developer",
  "Freelancer",
  "MERN Stack Developer",
  "MEAN Stack Developer",
  "React Native Developer",
  "Android/IOS Developer",
];

function Type({ strings = DEFAULT_STRINGS }) {
  const displayStrings = Array.isArray(strings) && strings.length > 0 ? strings : DEFAULT_STRINGS;

  return (
    <Typewriter
      options={{
        strings: displayStrings,
        autoStart: true,
        loop: true,
        deleteSpeed: 50,
      }}
    />
  );
}

export default Type;
