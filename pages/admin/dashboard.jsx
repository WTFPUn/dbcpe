import Template from "@/components/Template";
import CheckInCard from "@/components/dashboard/CheckInCard";
import CheckOutCard from "@/components/dashboard/CheckOutCard";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";

export default function dashboard() {

  const [dashboardInfo, setDashboardInfo] = useState({});
  const [token, setToken] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
    if (token) {
      fetch("/api/admin/getdashboardinfo", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setDashboardInfo(data);
        });
    }
  }, []);

  if(dashboardInfo?.local) {
    return(
      <Template>
        <div className="bg-[#F5F5F5] w-[60%] h-full mt-16 rounded-t-md px-[6rem] pt-8">
          <div className="w-full text-4xl font-semibold text-center h-[15%] pt-4">Creating a new coupon code</div>
          
        </div>
      </Template>
    )
  }
  else {
    return (
      <Template  hscreen>
          <div className="bg-[#F5F5F5] w-[60%] h-full mt-16 rounded-t-md px-[6rem] pt-8">
            <div className="w-full text-4xl font-semibold text-center h-[15%] pt-4">Creating a new coupon code</div>
            <div className="flex gap-12 place-content-center">
              <CheckInCard value={dashboardInfo.global?.count_checkin ? dashboardInfo.global?.count_checkin : 0}/>
              <CheckOutCard value={dashboardInfo.global?.count_checkout ? dashboardInfo.global?.count_checkout : 0 }/>
              <WelcomeCard/>
            </div>
            <div className="bg-[#FAFCFE] w-full h-[30rem] text-black mt-8 rounded-md drop-shadow flex flex-col px-6 py-6">
              <div className="font-semibold text-3xl">Our guests are coming today</div>
              <div className="flex  text-lg w-full h-[10%] font-semibold overflow-y-auto mt-4">
                <div className="w-[20%] text-center">Name</div>
                <div className="w-[20%] text-center">Type</div>
                <div className="w-[20%] text-center">Sub-Type</div>
                <div className="w-[20%] text-center">Room</div>
                <div className="w-[20%] text-center">Floor</div>
              </div>
              <div className="flex flex-col w-full h-[90%] overflow-y-auto gap-4 text-[#8C8CA1]">
                {dashboardInfo.global?.guest_coming?.map((guest) => (
                  <div className="flex text-lg w-full h-[10%] font-medium">
                    <div className="w-[20%] text-left truncate">{guest.Name}</div>
                    <div className="w-[20%] text-left">{guest.room_type}</div>
                    <div className="w-[20%] text-left">{guest.subroom_type}</div>
                    <div className="w-[20%] text-center">{guest.room_num}</div>
                    <div className="w-[20%] text-center">{guest.floor ? guest.floor : "-"}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
      </Template>
    )
  }
}