
import Template from "@/components/Template";
import { jwtdecode } from "@/utils/verify";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';

import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

export const lineOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
};


export default function analytics() {
  const [data, setData] = useState({})
  const [roomType, setRoomType] = useState("Accomodation")

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(token){
      fetch('/api/admin/getanalysis', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
          },
          })
          .then((res) => res.json())
          .then((data) => {
            setData(data)
          })
    }
  }, [])

  const stackedBarGraph = (roomType) => {
    const barDataObj = roomType == "Accomodation" ? data?.bars?.accommodation || [] : data?.bars?.exhibition || []
    
    const barData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep','Oct','Nov','Dec'],
      datasets: barDataObj,
    };
    return (
      <div className="w-full flex flex-col mt-4">
        <div className="bg-[#0E0E2C] rounded-md w-full text-white font-medium text-lg py-4 px-2">{"Monthly " + roomType + " Room Bookings Over Year " + new Date().getFullYear()}</div>
        <div className="w-full flex place-items-center bg-[#FAFCFE] rounded-md p-4">
          <Bar data={barData} options={options} />
        </div>

      </div>
    )
  }

  const lineGraph = (roomType) => {
    const lineDataObj = roomType == "Accomodation" ? data?.lines?.accommodation || [] : data?.lines?.exhibition || []

    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const lineData = {
      labels: labels,
      datasets: lineDataObj,
    };
    return (
      <div className="w-full flex flex-col mt-4">
        <div className="bg-[#0E0E2C] rounded-md w-full text-white font-medium text-lg py-4 px-2">{"Monthly Sales of " + roomType + " Room Bookings Over Year " + new Date().getFullYear()}</div>
        <div className="w-full flex place-items-center bg-[#FAFCFE] rounded-md p-4">
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>
    )
  }



  console.log(data)
  if (data) {
  return(
    <Template>
      <div className=" py-8 flex flex-col place-items-center bg-[#FAFCFE] rounded-md mt-8 w-1/2 px-16">
        <div className="text-xl font-semibold mb-4">Analysis Reports</div>
        <div className="flex">
          <div>Filter: </div>
          <select className="border-2 border-gray-300 rounded-md ml-2" onChange={(e) => setRoomType(e.target.value)}>
            <option value="Accomodation">Accomodation</option>
            <option value="Exhibition">Exhibition</option>
          </select>
        </div>
        {stackedBarGraph(roomType)}
        {lineGraph(roomType)}
      </div>
    </Template>
  )
  } else {
    return (
      <Template>
        <div className="h-[36rem] py-8 flex flex-col place-items-center bg-[#FAFCFE] rounded-md mt-8 w-1/2">
          <div className="text-xl font-semibold mb-4">Analysis Reports</div>
          <div className="flex">
            <div>Filter: </div>
            <select className="border-2 border-gray-300 rounded-md ml-2" onChange={(e) => setRoomType(e.target.value)}>
              <option value="Accomodation">Accomodation</option>
              <option value="Exhibition">Exhibition</option>
            </select>
            <div className="w-full text-5xl font-semibold">
              Loading...
          
            </div>
          </div>
        </div>
      </Template>
    )
  }
}