import Signinform from "@/components/signinform";
import Template from "../../components/Template";
import React, { useState } from "react";

export default function Signin() {
  return(
    <Template hscreen title={"Welcome to MISH Hotel"}>
      <div className="bg-white h-[80%] w-[70%] place-self-center rounded-xl flex">
        <div className="w-[50%] ">
          <img src= "/images/signup/Signupimage.png" alt="signup" className="w-full h-full rounded-l-xl object-cover"/>
        </div>
        <div className= "w-[50%] h-full flex  place-content-center place-items-center">
          <div className="w-[80%] h-[70%] flex flex-col  font-semibold text-black">
            <div className="text-center w-full font-[550] text-4xl mt-4">Welcome back</div>
            <div className="text-center font-light place-content-center w-full flex">
              <p className=" text-[#8C8CA1]">Welcome back! Please enter your details</p>
            </div>
            <Signinform/>
          </div>
        </div>
      </div>
    </Template>
  )
}