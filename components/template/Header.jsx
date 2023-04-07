import Link from "next/link";
import jwt from "jsonwebtoken";
// localstorage
import { useEffect, useState } from "react";


export default function Header() {
  // get token from localstorage
  const [token, setToken] = useState(undefined);
  useEffect(() => {
    const usetoken = localStorage.getItem("token");
    console.log("token is ", usetoken);
    setToken(usetoken ? usetoken : undefined);
  }, []);

  // decode token
  const jwt_key = process.env.JWT_KEY;
  let user_id = "";
  token && jwt.verify(token, jwt_key, (err, decoded) => {
    console.log("token is ", token);
    if (err) {
      console.log(err);
    } else {
      user_id = decoded.user_id;
    }
  });
  
  const LinkValue = user_id ? { href: `/users/profile/${user_id}`, text: "Profile" } : { href: "/users/Signup", text: "Sign up Now" };
  // console.log(LinkValue);
  const pageList = [
    {
      name: "The Hotel",
      link: "/",
    },
    {
      name: "accomodation",
      link: "/accomodation",
    },
    {
      name: "meeting",
      link: "/meeting",
    },
    {
      name: "booking",
      link: "/booking",
    },
  ]
  
  return(
    <div className="w-full bg-[#4A4A68] text-white px-[15%] py-3 flex justify-between place-items-center">
      <Link
        href="/"
        className="text-[#F2F2F2] font-bold text-2xl font-dmserif uppercase"
      >
       mish hotel
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
    <Link
        href={LinkValue.href}
        className=" bg-[#6C6EF2] px-6 py-1 rounded-md"
      >
        {LinkValue.text}
      </Link>
    </div>
  )
}