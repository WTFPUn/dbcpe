import React, { useState } from "react";
import DownIcon from "@/components/icons/Confirm/DownIcon";
import UpIcon from "@/components/icons/Confirm/UpIcon";

export default function ConfirmExhBookBox({data}) {
  const [visible, setVisible] = useState(false);

  return(
    <div className="flex flex-col">
      <div className="flex h-full w-full gap-4 place-items-center py-2">
        <div className="w-[30%]">
          <img src={`data:image/jpeg;base64,${data.type_of_exhibition?.image}`} className="w-[300px] h-[75px] object-cover rounded-md"/>
        </div>
        <div className="h-full w-[70%] flex flex-col">
          <div className="font-semibold">
            {"room name: " + data.exhibition_room.name}
          </div>
        </div>
        {!visible ? <div className="ml-auto" onClick={() => {setVisible(!visible)}}><DownIcon/></div>: <div className="ml-auto" onClick={() => {setVisible(!visible)}}><UpIcon/></div>}
      </div>
      <div className={`${visible ? "flex flex-col" : "hidden"} gap-2 py-2 px-2 text-sm border-t-2 border-[#E4E4E4]`}>
        <div className="flex flex-col px-8">
          <div className="flex justify-between">
            <p className="font-semibold">check in: </p> 
            <p>{data.checkin_date}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold">check out: </p> 
            <p>{data.checkout_date}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold">participant: </p> 
            <p>{data.participant_count}</p>
          </div>
          
          <div className="flex justify-between">
              <p className="font-semibold">Price: </p> 
              <div className="font-semibold text-sm flex flex-row gap-2 place-items-center">
                <p className="text-xs strikediag withpadding">{data.price_summary.total_price}</p>
                <p className="text-green-500">{Math.round(data.price_summary.discounted_total_price * 100) / 100}</p>
              </div>
            </div>
        </div>

        </div>

    </div>
  )
}