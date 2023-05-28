import Template from "@/components/Template";
import React, { useState, useEffect } from 'react';
import { jwtdecode } from "@/utils/verify";
// impor link
import Link from "next/link";

export default function profile() {
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState({
    "user_name": "",
    "first_name": "",
    "last_name": "",
    "email": "",
    "date_of_birth": "",
    "gender": "",
    "phone_no": "",
    "address": "",
    "district": "",
    "sub_district": "",
    "province": "",
    "postcode": "",
});

  const[staticname, setStaticname] = useState({
    "first_name": "",
    "last_name": "",
  });

  const [edit, setEdit] = useState(false);



  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
    if (token) {
      const decoded = jwtdecode(token);
      const { account_id } = decoded; 
      fetch(`http://localhost:3000/api/profile/getprofile?${new URLSearchParams({ qArray: Object.keys(profile) })}`
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
          setProfile(data.profile);
        });
      
      fetch(`http://localhost:3000/api/profile/getprofile?${new URLSearchParams({ qArray: Object.keys(staticname) })}`
        , {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setStaticname(data.profile);
        });
    }
  }, []);


  const handleEdit = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const onSubmit = () => {
    if (edit) {
      fetch("http://localhost:3000/api/profile/updateprofile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({ ...profile, token: token }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });
    }
  };

  const onClick = () => {
    if (edit) {
      onSubmit();
    }
    else {
      setEdit(!edit);
    }
  }

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
    console.log(staticname);
    const Name = staticname.first_name + " " + staticname.last_name;
    
  return(
    <Template title={"Edit Profile"} hscreen>
      <div className="w-[80%] bg-white self-center rounded-md my-4 place-items-center flex flex-row overflow-y-auto font-fira">
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
        {profile ? (
          <div className="w-8/12 flex flex-col place-items-center h-full py-4 px-48">
            <p className="text-3xl font-bold self-start">Edit your profile</p>
            <form className="flex flex-col h-5/6 w-full items-center overflow-y-auto">
              {Object.keys(profile).map((key, index) => {

                if (key === "date_of_birth"){
                  return (
                    <div className="flex flex-col w-full my-4" key={index+key+"frame"}>
                  <label className="text-black" key={index+key+"label"}>{key}</label>
                  <input
                    type="date"
                    name={key}
                    id={key}
                    key={index+key+"input"}
                    value={profile[key]}
                    onChange={handleEdit}
                    className={`border border-[#8C8CA1] rounded-md text-base font-light py-1 px-2 ${!edit ? "bg-[#ECF1F4]" : 'bg-white'}` }
                    readOnly={!edit}
                  />
                </div>
                  )
                } 
                else if (key === 'address') {
                  return (
                    <div className="flex flex-col w-full my-4" key={index+key+"frame"}>
                    <label className="text-black" key={index+key+"label"}>{key}</label>
                    <textarea
                      type="text"
                      name={key}
                      id={key}
                      key={index+key+"input"}
                      value={profile[key]}
                      onChange={handleEdit}
                      className={`border border-[#8C8CA1] rounded-md text-base font-light py-1 px-2 ${!edit ? "bg-[#ECF1F4]" : 'bg-white'}` }
                      readOnly={!edit}
                    />
                  </div>
                  )
                }
                else {
                return (
                  <div className="flex flex-col w-full my-4" key={index+key+"frame"}>
                  <label className="text-black" key={index+key+"label"}>{key}</label>
                  <input
                    type="text"
                    name={key}
                    id={key}
                    key={index+key+"input"}
                    value={profile[key]}
                    onChange={handleEdit}
                    className={`border border-[#8C8CA1] rounded-md text-base font-light py-1 px-2 ${!edit ? "bg-[#ECF1F4]" : 'bg-white'}` }
                    readOnly={!edit}
                  />
                </div>
                )
                }
              }
            )}
          </form>
          <div className="flex flex-col place-content-start w-full">
            <p className="text-black">Password</p>
            <Link href="/profile/changepassword" className="text-[#6C6EF2]">Change my password</Link>
          </div>
          <div onClick={() => onClick()} className="bg-[#6C6EF2] text-white rounded-md py-2 px-4 my-4 w-full text-center items-center"> {edit ? "Update Info" : "Edit Info"} </div>
        </div>
        ) : (
          <div className="flex flex-col w-10/12 my-4">
            <div> No Profile Found </div>  
          </div>
        )}
      </div>
    </Template>
  )
}