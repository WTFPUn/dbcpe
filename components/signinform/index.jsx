import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Signinform() {
  const router = useRouter();
  const [info, setInfo] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [messagestatus, setMessagestatus] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    const res = fetch("http://localhost:3000/api/users/login", {
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
          setMessagestatus(true);
          // set token to local storage
          localStorage.setItem("token", data?.token);
          // wait 2 seconds and redirect to home
          setTimeout(() => {
            router.push("/");
          }, 2000);
        } else {
          setMessage(data.message);
        }
      });
  };

  const changeHandler = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };
  
  return(
    <div className="h-full py-12 flex flex-col place-items-center gap-5">
      {message && <p className={`${messagestatus ? "text-green-400": "text-red-500"} w-full text-left text-sm`}>{message}</p>}
      <form onSubmit={submitHandler} className="h-72 w-full overflow-x-hidden overflow-y-auto">
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
      </form>
      <button onClick={submitHandler} className="bg-[#6C6EF2] text-white font-[550] text-sm py-2 px-4 rounded-md">Sign In</button>
    </div>
  );
}