import Link from "next/link";
import jwt from "jsonwebtoken";
// localstorage
import { useEffect, useState } from "react";
import dotenv from "dotenv";
import { jwtdecode } from "@/utils/verify";
import Logout from "../icons/Logout";

dotenv.config();

export default function Header() {
  // get token from localstorage and client side
  const [token, setToken] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
  }, []);
  
  // console.log("token is first:  ", token);
  const decoded = jwtdecode(token);
  const { account_id, email, user_name, role, sub_role } = decoded || {};  
  console.log("decoded: ", decoded)
  
  const LinkValue = token ? { href: `/profile/`, text: user_name } : { href: "/users/Signup", text: "Sign up Now" };

  // logout by remove token from localstorage
  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const pageRole = {
      'guest': [
      {
        name: "ACCOMODATION",
        link: "/accommodation",
      },
      {
        name: "MEETING",
        link: "/meeting",
      },
      {
        name: "BOOKING",
        link: "/booking",
      },
      {
        name: "CONFIRM BOOKING",
        link: "/booking/confirmbook",
      }
  ],
      'manager': [
        {
          name: "DASHBOARD",
          link: "/admin/dashboard",
        },
        {
          name: "Analytics",
          link: "/admin/analytics",
        },
        {
          name: "Coupon",
          link: "/admin/coupon",
        },
        {
          name: "Role Management",
          link: "/admin/role",
        },
        {
          name: "Assign Cleaning",
          link: "/admin/assigncleaning",
        }
      ],
      'Recepter': [
        {
          name: "DASHBOARD",
          link: "/admin/dashboard",
        },
        {
          name: "Bill's Guest",
          link: "/admin/billcontrol",
        },
      ],
      'Chef': [
        {
        name: "DASHBOARD",
        link: "/admin/dashboard",
        },
      ],
      'HallPorter': [
        {
          name: "DASHBOARD",
          link: "/admin/dashboard",
        },
      ],
      'HouseKeeper': [
        {
          name: "DASHBOARD",
          link: "/admin/dashboard",
        },
        {
          name: 'Accommodation Assignment',
          link: '/admin/accommodationassignment'
        },
        {
          name: 'Exhibition Assignment',
          link: '/admin/exhibitionassignment'
        }
      ],
    }

    const pageRender = (role, sub_role) => {
      if (role == 0) {
        return pageRole.guest
      }
      if (sub_role == 0) {
        return pageRole.manager
      }
      if (sub_role == 1) {
        return pageRole.HouseKeeper
      }
      if (sub_role == 2) {
        return pageRole.Recepter
      }
      if (sub_role == 3) {
        return pageRole.HallPorter
      }
      if (sub_role == 4) {
        return pageRole.Chef
      }
    }


  // console.log(LinkValue);
  console.log("role: ", role);
  // check role and sub_role is exist then render page
  const pageList = ((role === 0 || role === 1)) ? pageRender(role, sub_role) : [];
  console.log("pageList", pageList);
  
  return(
    <div className="w-full bg-[#4A4A68] text-white px-[15%] py-3 flex justify-between place-items-center">
      <Link
        href="/"
        className="text-[#F2F2F2] font-bold text-2xl font-dmserif "
      >
       MISH Hotel 
      </Link>
      <div className="text-white">
        {pageList.map((page, index) => (
          <Link
            key={index}
            href={page.link}
            className=" hover:text-[#F3D9DA] px-4 uppercase"
          >
            {page.name}
          </Link>
        ))}
        
    </div>
    <div className="flex place-items-center gap-2">
      <Link
          href={LinkValue.href}
          className=" bg-[#6C6EF2] px-6 py-1 rounded-md"
        >
          {LinkValue.text}
      </Link>
      {token && (
        <div onClick={logout}>
          <Logout/>
        </div>
      )}
    </div>
    </div>
  )
}