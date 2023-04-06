import React, { useState } from "react";
import axios from "axios";

export default function Signup() {
  const [info, setInfo] = useState({
    address: "",
    date_of_birth: "",
    district: "",
    email: "",
    first_name: "",
    gender: "",
    password  : "",
    phone_no: "",
    postcode: "",
    province : "",
    role: "",
    sub_district: "",
    sub_role: "",
    user_name: "",
    last_name: "",
  });
  const [message, setMessage] = useState("");

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
        } else {
          setMessage(data.message);
        }
      }
      );

    console.log(res);
  }

  const changeHandler = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  }

  return (
    <div>
      <form onSubmit={submitHandler}>
        <div>
          <label>First Name</label>
          <input
            type="text"
            name="first_name"
            value={info.first_name}
            onChange={changeHandler}
          />

          <label>Last Name</label>
          <input
            type="text"
            name="last_name"
            value={info.last_name}
            onChange={changeHandler}
          />

          <label>Username</label>
          <input
            type="text"
            name="user_name"
            value={info.user_name}
            onChange={changeHandler}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={info.password}
            onChange={changeHandler}
          />
        </div>
    <div>


          <label>Address</label>
          <input

            type="text"
            name="address"
            value={info.address}
            onChange={changeHandler}
          />

          <label>Sub District</label>
          <input

            type="text"
            name="sub_district"
            value={info.sub_district}
            onChange={changeHandler}
          />

          <label>District</label>
          <input

            type="text"
            name="district"
            value={info.district}
            onChange={changeHandler}
          />

          <label>Province</label>
          <input

            type="text"
            name="province"
            value={info.province}
            onChange={changeHandler}
          />


          <label>Postcode</label>
          <input

            type="text"
            name="postcode"
            value={info.postcode}
            onChange={changeHandler}
          />

          <label>Phone Number</label>
          <input

            type="text"
            name="phone_no"
            value={info.phone_no}
            onChange={changeHandler}
          />

          <label>Email</label>
          <input

            type="text"
            name="email"
            value={info.email}
            onChange={changeHandler}
          />
          </div>
          <button type="submit">Submit</button>
          </form>
          </div>
  );
}
