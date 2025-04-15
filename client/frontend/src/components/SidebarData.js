import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import { MdOutlineTimeline } from "react-icons/md";
import { FaRegNewspaper } from "react-icons/fa6";

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/profile",
    icon: <AiIcons.AiFillDashboard />,
    cName: "nav-text",
  },
  {
    title: "Enrollments",
    path: "/enrollments",
    icon: <MdOutlineTimeline />,
    cName: "nav-text",
  },
  {
    title: "Services",
    path: "/services",
    icon: <FaIcons.FaCartPlus />,
    cName: "nav-text",
  },
  {
    title: "Options",
    path: "/options",
    icon: <IoIcons.IoIosOptions />,
    cName: "nav-text",
  },
  {
    title: "Resources",
    path: "/resources",
    icon: <FaRegNewspaper />,
    cName: "nav-text",
  },
];
