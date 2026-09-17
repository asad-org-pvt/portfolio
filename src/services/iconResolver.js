import React from "react";
import * as DiIcons from "react-icons/di";
import * as SiIcons from "react-icons/si";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as CgIcons from "react-icons/cg";
import * as BsIcons from "react-icons/bs";
import * as ImIcons from "react-icons/im";
import { FiCode } from "react-icons/fi";

const ICON_REGISTRY = {
  ...DiIcons,
  ...SiIcons,
  ...FaIcons,
  ...AiIcons,
  ...CgIcons,
  ...BsIcons,
  ...ImIcons,
};

/**
 * Resolves an icon name string (e.g. 'DiJavascript1', 'SiNextdotjs') to a React Icon component.
 * If the string is a URL, renders an <img> element.
 * If not found or invalid, returns a default code icon.
 */
export function renderIcon(iconName, defaultFallback = <FiCode />) {
  if (!iconName) return defaultFallback;

  // Check if it's an image URL
  if (
    iconName.startsWith("http://") ||
    iconName.startsWith("https://") ||
    iconName.startsWith("/") ||
    iconName.startsWith("data:")
  ) {
    return (
      <img
        src={iconName}
        alt="icon"
        style={{
          width: "1.2em",
          height: "1.2em",
          objectFit: "contain",
          verticalAlign: "middle",
        }}
      />
    );
  }

  // Look up in react-icons registry
  const IconComponent = ICON_REGISTRY[iconName];
  if (IconComponent) {
    return <IconComponent />;
  }

  return defaultFallback;
}

export default renderIcon;
