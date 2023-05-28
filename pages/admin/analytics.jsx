
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
  ArcElement,
} from 'chart.js';

import { Bar, Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
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
      <div className="w-full flex flex-col mt-4 gap-4">
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
      <div className="w-full flex flex-col mt-4 gap-4 ">
        <div className="bg-[#0E0E2C] rounded-md w-full text-white font-medium text-lg py-4 px-2">{"Monthly Sales of " + roomType + " Room Bookings Over Year " + new Date().getFullYear()}</div>
        <div className="w-full flex place-items-center bg-[#FAFCFE] rounded-md p-4">
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>
    )
  }

  const pieGraph = (roomType) => {
    const pieDataObj = roomType == "Accomodation" ? data?.pies?.accommodationPies || [] : data?.pies?.ExhibitionPies || []
    // [{key:{subkey: val, subkey:val}}, {key:{subkey: val, subkey:val}] -> {key: {subkey: val, subkey:val}, key: {subkey: val, subkey:val}}
    const pieExtractData = pieDataObj.reduce((acc, curr) => {
      const key = Object.keys(curr)[0]
      acc[key] = curr[key]
      return acc
    }, {})
    
    const pieDatas = Object.keys(pieExtractData).map((key) => {
      return {
        // push "-" until length equal 6
        labels: pieExtractData[key].labels.concat(Array(6 - pieExtractData[key].labels.length).fill("No Top 5")),
        datasets: [
          {
            // set value and put 0  until length equal 6
            label: key,
            data: pieExtractData[key].data.concat(Array(6 - pieExtractData[key].data.length).fill(0)),
            backgroundColor: pieExtractData[key].backgroundColor,
            borderWidth: 1,
          },
        ],
      }
    })

    const returnOption = {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    }
    console.log(pieDatas)
    return (
      <div className="w-full flex flex-col mt-4 h-max gap-4">
        <div className="bg-[#0E0E2C] rounded-md w-full text-white font-medium text-lg py-4 px-2">{"Monthly Workload of Housekeepers Over Year " + new Date().getFullYear()}</div>
        <div className="w-full flex overflow-x-auto gap-3">
          {pieDatas.map((pieData, index) => {
            return (
              <div className="w-1/3 flex flex-col place-items-center bg-[#FAFCFE] rounded-md p-4 h-[24rem] px-4" key={index}>
                <div className="text-lg  mb-4 text-black font-semibold">{pieData.datasets[0].label}</div>
                <Pie data={pieData} options={returnOption} />
              </div>
            )
          }
          )}
        </div>
      </div>
    )
  }

  pieGraph(roomType)
  if (data) {
  return(
    <Template>
      <div className=" py-8 flex flex-col place-items-center bg-[#F5F5F5] rounded-md mt-8 w-1/2 px-16">
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
        {pieGraph(roomType)}
      </div>
    </Template>
  )
  } else {
    return (
      <Template>
        <div className="h-[36rem] py-8 flex flex-col place-items-center bg-[#F5F5F5] rounded-md mt-8 w-1/2">
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