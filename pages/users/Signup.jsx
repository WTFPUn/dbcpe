import React, { useState } from "react";
import Template from "@/components/Template";
import SignupForm from "@/components/signupform";

export default function Signup() {
  return (
    <Template hscreen title={"Welcome to MISH Hotel"}>
      <div className="bg-white h-[80%] w-[70%] place-self-center rounded-xl flex">
        <div className="w-[50%] ">
          <img src= "/images/signup/Signupimage.png" alt="signup" className="w-full h-full rounded-l-xl object-cover"/>
        </div>
        <div className= "w-[50%] h-full flex  place-content-center place-items-center">
          <div className="w-[80%] h-[70%] flex flex-col  font-semibold text-black">
            <div className="text-center w-full">Start your step</div>
            <div className="text-center w-full font-[550] text-4xl mt-4">Sign up to MISH Hotel</div>
            <div className="text-center font-light place-content-center w-full flex">
              <p className=" text-[#8C8CA1]">Already a member?</p>
              <a href="/users/Signin" className="text-[#6C6EF2] ml-2"> Login</a>
            </div>
            <SignupForm/>
          </div>
        </div>
      </div>
    </Template>
  );
}