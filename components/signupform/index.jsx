import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function SignupForm() {
  const [info, setInfo] = useState({
    address: "",
    date_of_birth: "",
    district: "",
    email: "",
    first_name: "",
    gender: "Male",
    password  : "",
    re_password: "",
    phone_no: "",
    postcode: "",
    province : "",
    sub_district: "",
    last_name: "",
  });
  const [message, setMessage] = useState("");
  const [messagestatus, setMessagestatus] = useState(false);
  const [onsection, setOnsection] = useState(0);
  const [section, setSection] = useState(0)

  const Gender = ['Male', 'Female', 'Other']
  const router = useRouter();

  const submitHandler = (e) => {
    e.preventDefault();
    const res = fetch("http://localhost:3000/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(info),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessage(data.message);
          setMessagestatus(true)
          // wait 2 seconds and redirect to home page
          setTimeout(() => {
            router.push("/");
          }, 2000);

        } else {
          setMessage(data.message);
          setMessagestatus(false)
        }
      }
      );

    console.log(res);
  }

  const changeHandler = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  }
  

  return(
    <div className="h-full py-12 flex flex-col place-items-center gap-5">
      {message && <p className={`${messagestatus ? "text-green-400": "text-red-500"} w-full text-left text-sm`}>{message}</p>}
      <form onSubmit={submitHandler} className="h-72 w-full overflow-x-hidden overflow-y-auto">
        {section === 0 && (
          <div className="flex flex-col font-[550] text-sm place-items-center gap-4">
            <div className="flex gap-2 w-full">
              <div className="flex flex-col w-[49%]">
                <label htmlFor="first_name">First Name *</label>
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  value={info.first_name}
                  onChange={changeHandler}
                  placeholder="Enter your First Name"
                  className="border border-[#8C8CA1] rounded-md text-base font-light py-1 px-2"
                  required
                />
              </div>
              <div className="flex flex-col w-[49%]">
                <label htmlFor="last_name">Last Name *</label>
                <input
                  type="text"
                  name="last_name"
                  id="last_name"
                  value={info.last_name}
                  onChange={changeHandler}
                  placeholder="Enter your Last Name"
                  className="border border-[#8C8CA1] rounded-md text-base font-light py-1 px-2"
                  required
                />
              </div>
            </div>  
            <div className="flex flex-col w-full">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                name="email"
                id="email"
                value={info.email}
                onChange={changeHandler}
                placeholder="Enter your Email"
                className="border border-[#8C8CA1] rounded-md text-base font-light py-1 px-2"
                required
              />
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                name="password"
                id="password"
                value={info.password}
                onChange={changeHandler}
                placeholder="Enter your Password"
                className="border border-[#8C8CA1] rounded-md text-base font-light py-1 px-2"
                required
              />
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="re_password">Re-enter Password *</label>
              <input
                type="password"
                name="re_password"
                id="re_password"
                value={info.re_password}
                onChange={changeHandler}
                placeholder="Re-enter your Password"
                className="border border-[#8C8CA1] rounded-md text-base font-light py-1 px-2"
                required
              />
            </div>
          </div>
        )}
        {section === 1 && (
          <div className="flex flex-col w-full gap-4 relative">
            <div className="flex flex-col">
              <label htmlFor="Birthdate">Birthdate *</label>
              <input
                type="date"
                name="date_of_birth"
                id="date_of_birth"
                value={info.date_of_birth}
                onChange={changeHandler}
                placeholder="Enter your Birthdate"
                className="border border-[#8C8CA1] rounded-md text-base font-light py-1 px-2"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="Gender">Gender *</label>
              <select name="Gender" id="Gender" onChange={changeHandler} className="border border-[#8C8CA1] rounded-md text-base font-light">
                <option value="Male" >Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="phone_no">Phone Number *</label>
              <input
                type="text"
                name="phone_no"
                id="phone_no"
                value={info.phone_no}
                onChange={changeHandler}
                placeholder="Enter your Phone Number"
                className="border border-[#8C8CA1] rounded-md text-base font-light py-1 px-2"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="Province">Province *</label>
              <input
                type="text"
                name="province"
                id="province"
                value={info.province}
                onChange={changeHandler}
                placeholder="Enter your Province"
                className="border border-[#8C8CA1] rounded-md text-base font-light py-1 px-2"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="District">District *</label>
              <input
                type="text"
                name="district"
                id="district"
                value={info.district}
                onChange={changeHandler}
                placeholder="Enter your District"
                className="border border-[#8C8CA1] rounded-md text-base font-light py-1 px-2"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="Sub_District">Sub-District *</label>
              <input
                type="text"
                name="sub_district"
                id="sub_district"
                value={info.sub_district}
                onChange={changeHandler}
                placeholder="Enter your Sub-District"
                className="border border-[#8C8CA1] rounded-md text-base font-light py-1 px-2"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="Postal_Code">Postal Code *</label>
              <input
                type="text"
                name="postcode"
                id="postcode"
                value={info.postcode}
                onChange={changeHandler}
                placeholder="Enter your Postal Code"
                className="border border-[#8C8CA1] rounded-md text-base font-light py-1 px-2"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="Address">Address *</label>
              <textarea
                name="address"
                id="address"
                value={info.address}
                onChange={changeHandler}
                placeholder="Enter your Address"
                className="border border-[#8C8CA1] rounded-md text-base font-light py-1 px-2"
                required
              />
            </div>
            
        </div>
        )}
      </form>
      {section === 0 && (
        <div onClick={() => setSection(1)} className="text-white font-medium text-lg bg-[#6C6EF2]  py-1 rounded-md uppercase text-center w-48">continue</div>
      )}
      {section === 1 && (
        <div onClick={submitHandler} className="text-white font-medium text-lg bg-[#6C6EF2]  py-1 rounded-md uppercase text-center w-48">submit</div>
      )}

      <div className="flex  place-content-center w-full">
          <div className={`flex rounded-full bg-[#6C6EF2] ${section === 0 ? "opacity-100" : "opacity-50"} w-4 h-4 `} onClick={() => setSection(0)}/>
          <div className={`flex rounded-full bg-[#6C6EF2] ${section === 1 ? "opacity-100" : "opacity-50"} w-4 h-4 ml-2`} onClick={() => setSection(1)}/>
        </div>
    </div>
  )
}