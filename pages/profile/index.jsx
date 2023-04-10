import Template from "@/components/Template";
import React, { useState, useEffect } from 'react';
import { jwtdecode } from "@/utils/verify";

export default function profile() {
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
    const getProfile = async () => {
      const profile = await fetch(`/api/profile/getprofile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
          },
      });
      const profileData = await profile.json();
      setProfile(profileData);
    };
    getProfile();
  }, []);

  return(
    <Template title={"Edit Profile"}>

    </Template>
  )
}