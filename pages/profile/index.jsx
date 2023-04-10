import Template from "@/components/Template";
import React, { useState, useEffect } from 'react';
import { jwtdecode } from "@/utils/verify";

export default function profile() {
  const [token, setToken] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
  }, []);
  
  // console.log("token is first:  ", token);
  const decoded = jwtdecode(token);
  const { account_id, email, role, sub_role, user_name } = decoded || {};  
  
  // fetch data from api
  const [profile, setProfile] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/profile/getprofile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });
      const data = await res.json();
      setProfile(data.profile);
    };
    fetchData();
  }, []);


  return(
    <Template title={"Edit Profile"}>
      {profile && (
        {profile}
      )}
    </Template>
  )
}