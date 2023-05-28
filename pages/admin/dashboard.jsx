import Template from "@/components/Template";
import CheckInCard from "@/components/dashboard/CheckInCard";
import CheckOutCard from "@/components/dashboard/CheckOutCard";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import { jwtdecode } from "@/utils/verify";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

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

  const sectionShow = () => {
    if (!token) return false;
    const decoded = jwtdecode(token);
    return decoded.role == 1 ? true : false;
  }

  const sectionSubRole = () => {
    if (!token) return false;
    const decoded = jwtdecode(token);
    console.log(decoded.subrole)
    return decoded.subrole;
  }

  if(!sectionShow()) {
    return(
      <Template hscreen>
        <div className="bg-[#F5F5F5] w-[60%] h-full mt-16 rounded-t-md px-[6rem] pt-8 text-center text-5xl font-semibold">
          No permission
        </div>
      </Template>
    )
  }

  const ChefGraph = () => {
    // return Doughnut graph
    const graphData = {
      // get labels by loop key of dashboardInfo object
      labels: Object.keys(dashboardInfo.local).map((key) => key),
      // get data by loop value of dashboardInfo object
      datasets: [
        {
          label: "food type",
          data: Object.values(dashboardInfo.local).map((value) => value),
          backgroundColor: [
            "#FF6B4A",
            "#ECF1F4"
          ],
          
        }
      ],
    }

    const colorKeyChef = {
      "halal_food": "#FF6B4A",
      "regular_food": "#ECF1F4"
    }

      return(
        <div className="h-[36rem] py-8 flex">
            <div className="w-1/2">
              <Doughnut data={graphData}/>
            </div>
            <div className="w-1/2 h-full flex flex-col  place-items-center place-content-center gap-4">
              <div className="text-xl font-semibold self-start ml-16">{"Total(" + (dashboardInfo.local["halal_food"] + dashboardInfo.local["regular_food"]) + ")"}</div>
              {/* loop value an key in dashboardInfo.local */}
              <div className="flex flex-wrap">
                {Object.entries(dashboardInfo.local).map(([key, value]) => (
                <div className="flex place-content-center place-items-center">
                  <div className={`w-4 h-4 rounded-full bg-[${colorKeyChef[key]}]`}/>
                  <div className="text-xl font-semibold ml-4">{key + "(" + value + ")"}</div>
                </div>
                ))}
              </div>
            </div>
          </div>
      )
  }
  // roomType is 0 represent Accomodation, 1 represent Exhibition
  // checkType is 0 represent checkin, 1 represent checkout
  const HallporterCheckInOutGraph = (roomType, checkType) => {
    // return Doughnut graph
    console.log("hello:>")
    let data = {}
    let colorKey = {}
    let Total = 0
    if (roomType == 0 && checkType == 0) {
      data = dashboardInfo.local.count_checkin_accom[0].Accommodation
      colorKey = {
        Standard_Room: "#6C6EF2",
        King_Room: "#1890FF",
        Queen_Room: "#4BD4FF",
        Deluxe_Room: "#FF9F9F",
        Loft_Room: "#FF6B4A",
        Suite: "#FFA030",
        Honeymoon_Suite: "#FAB248",
        Executive_Suite: "#ACE89D",
        Penthouse_Suite: "#3AB25C"
      }
      // loop value in data(data is an object)
      Object.values(data).forEach(element => {
        Total += element
      }
      )
    }
    else if (roomType == 0 && checkType == 1) {
      data = dashboardInfo.local.count_checkout_accom[0].Accommodation
      colorKey = {
        Standard_Room: "#6C6EF2",
        King_Room: "#1890FF",
        Queen_Room: "#4BD4FF",
        Deluxe_Room: "#FF9F9F",
        Loft_Room: "#FF6B4A",
        Suite: "#FFA030",
        Honeymoon_Suite: "#FAB248",
        Executive_Suite: "#ACE89D",
        Penthouse_Suite: "#3AB25C"
      }
      Object.values(data).forEach(element => {
        Total += element
      }
      )
    }
    else if (roomType == 1 && checkType == 0) {
      data = dashboardInfo.local.count_checkin_accom[1].Exhibition
      colorKey = {
        Ballroom: "#6C6EF2",
        Boardroom: "#1890FF",
        Conference_Room: "#4BD4FF",
        Exhibition_Hall: "#FF9F9F",
        Meeting_Room: "#FF6B4A",
        Training_Room: "#FFA030",
      }
      Object.values(data).forEach(element => {
        Total += element
      }
      )
    }
    else if (roomType == 1 && checkType == 1) {
      data = dashboardInfo.local.count_checkout_accom[1].Exhibition
      colorKey = {
        Ballroom: "#6C6EF2",
        Boardroom: "#1890FF",
        Conference_Room: "#4BD4FF",
        Exhibition_Hall: "#FF9F9F",
        Meeting_Room: "#FF6B4A",
        Training_Room: "#FFA030",
      }
      Object.values(data).forEach(element => {
        Total += element
      }
      )
    }

    console.log(data)
    console.log(colorKey)

    const graphData = {
      // get labels by loop key of dashboardInfo object
      labels: Object.keys(data).map((key) => key),
      // get data by loop value of dashboardInfo object
      datasets: [
        {
          label: "room type",
          data: Object.values(data).map((value) => value),
          backgroundColor: Object.keys(data).map((key) => colorKey[key]),
        }
      ],
  }

      return(
          <div className="h-[36rem] py-8 flex flex-col place-items-center bg-[#FAFCFE] rounded-md mt-8 w-1/2">
            <div className="text-xl font-semibold mb-4">{"Our guests " + (checkType == 0 ? "check-in" : "check-out") + " to the " + (roomType == 1 ? "Exhibition" : "Accommodation")}</div>
            <div className="h-3/4">
              <Doughnut data={graphData}/>
            </div>
            <div className="h-1/4 w-full flex  place-items-center  px-2">
              <div className="text-xl font-semibold self-start ">{"Total(" + Total + ")"}</div>
              {/* loop value an key in dashboardInfo.local */}
              <div className="flex flex-wrap gap-2 mt-4">
                {Object.entries(data).map(([key, value]) => (
                // show only if value is not 0
                value != 0 ?
                <div className="flex place-content-center place-items-center">
                  <div className={`w-4 h-4 rounded-full bg-[${colorKey[key]}]`}/>
                  <div className=" text-base font-semibold ml-4">{key + "(" + value + ")"}</div>
                </div>
                : null
                ))}
              </div>
            </div>
          </div>
      )
  }


  if(dashboardInfo.role == "Chef" || dashboardInfo.role == "Hall porter") {
    return(
      <Template>
        <div className="bg-[#F5F5F5] w-[60%] h-full mt-16 rounded-t-md px-[6rem] pt-8">
          <div className="w-full text-4xl font-semibold text-center h-[15%] pt-4">Dashboard</div>
          <div className="flex gap-12 place-content-center">
            <CheckInCard value={dashboardInfo.global?.count_checkin ? dashboardInfo.global?.count_checkin : 0}/>
            <CheckOutCard value={dashboardInfo.global?.count_checkout ? dashboardInfo.global?.count_checkout : 0 }/>
            <WelcomeCard/>
          </div>
          {dashboardInfo.role === "Chef" ? 
          ChefGraph()
          : dashboardInfo.role === "Hall porter" ?
          <div className="flex flex-col w-full gap-2">
            <div className="flex w-full gap-4">
              {HallporterCheckInOutGraph(0, 0)}
              {HallporterCheckInOutGraph(0, 1)}
            </div>
            <div className="flex w-full gap-4">
              {HallporterCheckInOutGraph(1, 0)}
              {HallporterCheckInOutGraph(1, 1)}
            </div>
          </div>
          : null}
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
          {
            dashboardInfo.role === "Hall porter" ?
            <div className="bg-[#FAFCFE] w-full h-[30rem] text-black mt-8 rounded-md drop-shadow flex flex-col px-6 py-6">
            <div className="font-semibold text-3xl">Our guests are leaving today</div>
            <div className="flex  text-lg w-full h-[10%] font-semibold overflow-y-auto mt-4">
              <div className="w-[20%] text-center">Name</div>
              <div className="w-[20%] text-center">Type</div>
              <div className="w-[20%] text-center">Sub-Type</div>
              <div className="w-[20%] text-center">Room</div>
              <div className="w-[20%] text-center">Floor</div>
            </div>
            <div className="flex flex-col w-full h-[90%] overflow-y-auto gap-4 text-[#8C8CA1]">
              {dashboardInfo.local?.guest_checkout?.map((guest) => (
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
          : null
          }
        </div>
      </Template>
    )
  }
  else {
    return (
      <Template  hscreen>
          <div className="bg-[#F5F5F5] w-[60%] h-full mt-16 rounded-t-md px-[6rem] pt-8">
            <div className="w-full text-4xl font-semibold text-center h-[15%] pt-4">Dashboard</div>
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