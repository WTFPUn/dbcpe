import Template from "@/components/Template";
import React, { useState, useEffect } from 'react';
import { jwtdecode } from "@/utils/verify";

export default function profile() {
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState({
    "address": "sample",
    "date_of_birth": "sample",
    "district": "sample",
    "email": "sample",
    "first_name": "sample",
    "gender": "sample",
    "phone_no": "sample",
    "postcode": "sample",
    "province": "sample",
    "sub_district": "sample",
    "user_name": "sample",
    "last_name": "sample",
});

  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
  }, []);

  // Get Profile
  useEffect(() => {
    if (token) {
      const decoded = jwtdecode(token);
      const { account_id } = decoded;
      fetch(`http://localhost:3000/api/profile/getprofile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        query: {
          qArray: Object.keys(profile),
        }
      })
        .then((res) => res.json())
        .then((data) => {
          setProfile(data.profile);
          console.log(data.profile);
          console.log(profile);
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
                <div className="flex flex-col w-10/12 my-4">
                <label className="text-[#8C8CA1]">{key}</label>
                <input
                  type="text"
                  name={key}
                  id={key}
                  value={profile[key]}
                  onChange={handleEdit}
                  className="border border-[#8C8CA1] rounded-md text-base font-light py-1 px-2"
                  contentEditable={edit}
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