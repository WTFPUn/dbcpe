import DownIcon from "@/components/icons/Confirm/DownIcon";
import UpIcon from "@/components/icons/Confirm/UpIcon";
import { useState } from "react"

export default function ConfirmRoomBookBox({data}) {
  const [visible, setVisible] = useState(false);

  return(
    <div className="flex flex-col">
      <div className="flex h-full w-full gap-4 place-items-center py-2">
        <div className="w-[30%]">
          <img src={`data:image/jpeg;base64,${data.roomtype?.image}`} className="w-[300px] h-[75px] object-cover rounded-md"/>
        </div>
        <div className="h-full w-[70%] flex flex-col">
          <div className="font-semibold">
            {"room number: " + data.room.room_no}
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
            <p className="font-semibold">Guests: </p> 
            <p>{data.guests}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold">Halal need: </p> 
            <div>{data.halal_need ? <p className="text-green-500"> Yes </p> : <p className="text-red-500"> No </p>}</div>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold">Clean need: </p> 
            <div>{data.clean_need ? <p className="text-green-500"> Yes </p> : <p className="text-red-500"> No </p>}</div>
          </div>
          {data.laundry_need ?
            <>
              <div className="flex justify-between">
                <p className="font-semibold">Laundry need: </p> 
                <div>{data.clean_need ? <p className="text-green-500"> Yes </p> : <p className="text-red-500"> No </p>}</div>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold">Laundry Date: </p> 
                <div>{data.laundry_date}</div>
              </div>
            </> :
            <div className="flex justify-between">
              <p className="font-semibold">Laundry need: </p> 
              <div>{data.clean_need ? <p className="text-green-500"> Yes </p> : <p className="text-red-500"> No </p>}</div>
            </div>
          }
          <div className="flex justify-between">
              <p className="font-semibold">Price: </p> 
              <div className="font-semibold line-through">{data.roomtype.room_price}</div>
            </div>
        </div>

        </div>

    </div>
  )
}