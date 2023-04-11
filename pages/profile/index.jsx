import Template from "@/components/Template";
import React, { useState, useEffect } from 'react';
import { jwtdecode } from "@/utils/verify";

export default function profile() {
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState({
    "address": "",
    "date_of_birth": "",
    "district": "",
    "email": "",
    "first_name": "",
    "gender": "",
    "phone_no": "",
    "postcode": "",
    "province": "",
    "sub_district": "",
    "user_name": "",
    "last_name": "",
});

  const [edit, setEdit] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
  }, []);


  useEffect(() => {
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
    }
  }, [token]);

  const handleEdit = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  return(
    <Template title={"Edit Profile"}>
      <div className="w-[80%] bg-white self-center rounded-md my-16 place-items-center">
        {profile ? (
          <form className="flex flex-col w-full items-center">
            {Object.keys(profile).map((key, index) => {
              return (
                <div className="flex flex-col w-10/12 my-4" key={index+key+"frame"}>
                <label className="text-[#8C8CA1]" key={index+key+"label"}>{key}</label>
                <input
                  type="text"
                  name={key}
                  id={key}
                  key={index+key+"input"}
                  value={profile[key]}
                  onChange={handleEdit}
                  className="border border-[#8C8CA1] rounded-md text-base font-light py-1 px-2"
                  readOnly={!edit}
                />
              </div>
              )
            }
          )}
        </form>
        ) : (
          <div className="flex flex-col w-10/12 my-4">
            <div> No Profile Found </div>  
          </div>
        )}
      </div>
    </Template>
  )
}