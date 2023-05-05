/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useRouter } from "next/router";
import Template from "../../../components/Template";
import { useEffect, useState } from "react";
import Section from "@/components/booking/Section";
import BookForm from "@/components/booking/BookForm";

export default function booking() {
  const router = useRouter();
  const [room_id, setRoom_id] = useState();
  useEffect(() => {
    setRoom_id(router.query.exhibition_id);
  });

  // fetch room data with room id from slug
  const [room, setRoom] = useState({});

  const asyncFetch = async () => {
    const res = await fetch(`/api/room/getroombyId?roomId=${room_id}`);
    const data = await res.json();
    if (data.roomByID.length > 0) {
      setRoom(data.roomByID[0]);
    }
  }

  useEffect(() => {
    if (room_id) {
      asyncFetch();
    }
    
  }, [room_id]);
  return(
    <Template title="Booking">
      <div className="bg-white w-3/4 rounded-t-md flex flex-col place-items-center py-8 ">
        <Section />
        {
          room && (
          <div className="flex flex-col w-full px-[15%] mt-8 h-max">
            <div className="font-semibold text-xl w-full ">{room.roomtype && room.roomtype[0].roomtype_name}</div>
            <div className="flex flex-row w-full gap-4 mt-4">
              <div className="w-[60%] flex flex-col">
                {room.roomtype && (<img src={`data:image/jpeg;base64,${room.roomtype[0]?.image}`} className="w-full h-[450px] object-cover rounded-md"/>)}
                <div className="flex flex-wrap place-items-center border-b border-[#ECF1F4]">
                  <div className="py-4 px-1 flex">
                    <div className="rounded-full px-4 py-1 border border-[#6C6EF2] text-[#6C6EF2] h-8">{room.roomtype && room.roomtype[0].count_bed + " " + room.roomtype[0].bed_type}</div>
                  </div>
                  <div className="py-4 px-1 flex">
                    <div className="rounded-full px-4 py-1 border border-[#6C6EF2] text-[#6C6EF2] h-8">{room.roomtype && "maximum " +  room.roomtype[0].num_people_stay + " persons"}</div>
                  </div>
                  <div className="ml-auto flex flex-col py-4">
                    <p className=" text-lg text-right">{room.roomtype && "$" + room.roomtype[0].room_price}</p>
                    <p>per night</p>
                  </div>
                </div>
                <div className="flex flex-col mt-4 w-full">
                  {room.roomtype && room.roomtype[0].description}
                </div>
              </div>
              <BookForm room_id={room.room_id} guestInRoom={room.roomtype && room.roomtype[0].num_people_stay} room_number={room.room_no}/>
            </div>
          </div>
          )
        }
        
      </div>
    </Template>
  )
}