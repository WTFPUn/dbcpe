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
  const { account_id, email, role, sub_role, user_name } = decoded || {};  
  
  const LinkValue = token ? { href: `/profile/`, text: user_name } : { href: "/users/Signup", text: "Sign up Now" };

  // logout by remove token from localstorage
  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };
  

  // console.log(LinkValue);
  const pageList = [
    {
      name: "THE HOTEL",
      link: "/",
    },
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
  ]
  
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
            className=" hover:text-[#F3D9DA] px-4"
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