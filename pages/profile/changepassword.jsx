import Template from "@/components/template";
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import { jwtdecode } from "@/utils/verify";


export default function changepassword() {
  const [staticName, setStaticName] = useState({
    "first_name": "",
    "last_name": "",
  });

  const [formpassword, setFormpassword] = useState({
    "current_password": "",
    "new_password": "",
    "confirm_password": "",
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtdecode(token);
      const { account_id } = decoded;
      fetch(`http://localhost:3000/api/profile/getprofile?${new URLSearchParams({ qArray: Object.keys(staticName) })}`
        , {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          // remove _id from profile
          delete data.profile._id;
          setStaticName(data.profile);
        });
    }
  }, []);

  const handleForm = (e) => {
    setFormpassword({
      ...formpassword,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = () => {
   
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3000/api/users/updatepassword`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify(formpassword)
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
        setSuccess(data.success);
      })
  }

  const Name = staticName.first_name + " " + staticName.last_name;

  const link = [
    {
      name: "Profile Info",
      link: "/profile",
      current: true
    },
    {
      name: "Booking History",
      link: "/profile/history",
      current: false
    }
  ]

  return (
    <Template title="Change Password" hscreen>
      <div className="w-[80%] bg-white self-center rounded-md my-4 place-items-center flex flex-row overflow-y-auto font-oxygen h-full  ">
        <div className="w-4/12 flex flex-col bg-[#ECF1F4] h-full place-items-center place-content-center">
          <p className="mb-8">{Name}</p>
          {link.map((item, index) => {
            return (
              <Link
            href={item.link}
            key={index+"link"}
            className={`${item.current ? "text-[#4A4A68]" : "text-[#8C8CA1]"}`}
            >
              {item.name}
            </Link>
            )
          })}        
        </div>
        <div className="w-8/12 flex flex-col bg-white h-full place-items-center place-content-center">
          <div className="w-[80%] flex flex-col px-32">
            <p className="text-[#4A4A68] text-lg font-bold">Change Password</p>
            <p className="text-[#8C8CA1] text-sm">{ "Enter your current password and new password to change your password"}</p>
            <p className={` text-sm ${message ? " text-green-500" : "text-red-600"} h-4`}>{message}</p>
            <form>
              <div className="flex flex-col mt-4">
                <label className="text-[#8C8CA1]">Current Password</label>
                <input type="password" name="current_password" onChange={handleForm} className="border-[#E5E5E5] border-2 rounded-md py-1 px-2 mt-2" />
              </div>
              <div className="flex flex-col mt-4">
                <label className="text-[#8C8CA1]">New Password</label>
                <input type="password" name="new_password" onChange={handleForm} className="border-[#E5E5E5] border-2 rounded-md py-1 px-2 mt-2" />
              </div>
              <div className="flex flex-col mt-4">
                <label className="text-[#8C8CA1]">Confirm New Password</label>
                <input type="password" name="confirm_password" onChange={handleForm} className="border-[#E5E5E5] border-2 rounded-md py-1 px-2 mt-2" />
              </div>
            </form>
            <div onClick={handleSubmit} className="bg-[#6C6EF2] text-white rounded-md py-2 px-4 my-4 w-full text-center items-center">Save</div>
            <Link href="/profile" className="text-[#6C6EF2] text-center border border-[#6C6EF2] rounded-md py-2 px-4 my-4 w-full">Cancel</Link>
          </div>
      </div>
    </div>
    </Template>
  )
}