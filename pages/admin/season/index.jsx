import Template from "@/components/Template";
import TrashIcon from "@/components/icons/TrashIcon";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function coupon() {

  const [season, setSeason] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch('/api/admin/getallseasons', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((data) => setSeason(data.getseason))
      }
  }, []);

  const deleteSeason = (id) => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`/api/admin/deleteseasons`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
        body: JSON.stringify({ season_id: id }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            // reload
            alert("Delete success");
            window.location.reload();
          }
        })
    }
  }

  return(
    <Template hscreen>
      <div className="bg-[#F5F5F5] w-[60%] h-full mt-16 rounded-t-md px-[6rem] pt-8">
        <div className="w-full text-4xl font-semibold text-center h-[15%] pt-4">The Seasons</div>
        <div className="flex flex-col h-[24rem] bg-[#FAFCFE] w-full drop-shadow rounded-md py-4 px-8">
          <div className="text-black w-full h-[15%] flex font-semibold overflow-y-auto">
            <div className="w-[5%] text-center">Id</div>
            <div className="w-[25%] text-center">Description</div>
            <div className="w-[15%]  text-center">Start Date</div>
            <div className="w-[12%] text-center">End Date</div>
            <div className="w-[12%] text-center">Room Factor</div>
            <div className="w-[21%] text-center">Service Factor</div>
            <div className="w-[10%] text-center">Action</div>
          </div>
          <div className="w-full h-[85%] overflow-y-auto flex flex-col place-items-center">
            {season && season.map((item, index) => (
              <div key={index} className="text-[#8C8CA1] w-full h-[10%] flex">
                <div className="w-[5%] truncate text-center">{item.season_id}</div>
                <div className="w-[25%] truncate text-left" title={item.season_description}>{item.season_description}</div>
                <div className="w-[15%]  truncate text-center">{item.start_date}</div>
                <div className="w-[12%] truncate text-center">{item.end_date}</div>
                <div className="w-[12%] truncate text-center">{item.room_price_factor}</div>
                <div className="w-[21%] truncate text-center">{item.service_factor}</div>
                <div className="w-[10%] truncate place-content-center flex"><div onClick={() => {deleteSeason(item.season_id)}} className=" cursor-pointer"><TrashIcon/></div></div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full flex place-content-center">
          <Link className="mt-4 w-full text-center underline font-semibold text-[#1890FF]" href="/admin/season/addseason">{"We get a new Season >"}</Link>
        </div>
      </div>
    </Template>
  )
}