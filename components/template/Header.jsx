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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
  }, []);
  
  const decoded = jwtdecode(token);
  const { account_id, email, user_name, role, sub_role } = decoded || {};  
  
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
          name: "Season",
          link: "/admin/season",
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
          name: "Guest Bill's",
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
          name: 'Meeting Assignment',
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


  // check role and sub_role is exist then render page
  const pageList = ((role === 0 || role === 1)) ? pageRender(role, sub_role) : [];


  const imgRoleLink = () => {
    const localpath = "/images/tier/"
    console.log(role, sub_role)
    if (role == 1) {
      return localpath + "Admin.svg"
    }
    else if (role == 0 && sub_role == 0) {
      return localpath + "Bronze.svg"
    }
    else if (role == 0 && sub_role == 1) {
      return localpath + "Silver.svg"
    }
    else if (role == 0 && sub_role == 2) {
      return localpath + "Gold.svg"
    }
    else if (role == 0 && sub_role == 3) {
      return localpath + "Platinum.svg"
    }
    else if (role == 0 && sub_role == 4) {
      return localpath + "Diamond.svg"
    }
  }
  
  return(
    <div className=" w-full bg-[#4A4A68] text-white px-[15%] py-3 flex justify-between place-items-center">
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
      <div
          // href={LinkValue.href}
          className=" bg-[#6C6EF2] px-6 py-1 rounded-md relative cursor-pointer"
          onClick={() => setVisible(!visible)}
        >
          {LinkValue.text}
          <div 
            className={`rounded-md bg-[#FAFCFE] z-10 text-[#] ${ visible ? 'block' : 'hidden' } absolute top-10 h-max -bottom-2 w-[20rem] flex flex-col divide-y py-2 px-8`}>
            {token && <div className="flex gap-2 py-3">
              <img src={imgRoleLink()} alt="" className="w-12 h-12 rounded-full bg-[#0E0E2C] px-2"/>
              <div className="flex flex-col text-sm gap-2 text-black px-4 h-max">
                <div className="truncate">{email}</div>
                <div className="truncate">{"@"+user_name}</div>
              </div>
            </div>}
            {token && <div className="flex flex-col py-3 text-[#4A4A68]">
              <Link href="/profile">Profile</Link>
              <Link href="/profile/history">Booking History</Link>
            </div>}
            <div className="flex py-3 text-[#4A4A68]">
              {token ? (
                <div onClick={logout} className="flex gap-2 cursor-pointer">Sign Out <Logout /></div>
              ) : (
                <Link href="/users/Signup">Sign Up/Sign In</Link>
              )}
            </div>
          </div>
      </div>
      
    </div>
    </div>
  )
}