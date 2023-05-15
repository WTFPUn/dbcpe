import Template from "@/components/Template";
import { sampleRoomQuery } from "@/utils/sample";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";

export default function accommodation() {
  
  let paramsRoomType = [];
  let queriedRoom = [];
  let roomType = [];
  const router = useRouter();
  const { slug } = router.query;
  console.log("slug: ", router);
  
  // get room type from slug for first time of page load
  useEffect( () => {
    const slug = router.query.slug;
    console.log(slug);
    if (slug) {
      paramsRoomType = slug;
      console.log(slug);
    }
    const fetchRoom = async () => {
      const res = await fetch(`/api/room/getroomquery${slug ? new URLSearchParams({roomType: slug}) : new URLSearchParams({})}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      const data = await res.json();
      queriedRoom = data;
    }
    fetchRoom();

    const fetchRoomType = async () => {
      const res = await fetch(`/api/room/getroomtype`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      const data = await res.json();
      roomType = data;
    }
    fetchRoomType();
  }, []);
  
  // const sampleRoom = sampleRoomQuery;
  const [accommodationList, setAccommodationList] = useState({
    "checkIn": "",
    "checkOut": "",
    "minPerson": "",
    "roomType": paramsRoomType,
  });

  const handleSearch = async () => {
    const res = await fetch(`/api/room/getroomquery${new URLSearchParams(
      accommodationList)})`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  }

  return (
    <Template title="Accommodation">
      <FilterBar setAccommodationList={setAccommodationList} accommodationList={accommodationList} />
    </Template>
  )
}

function FilterBar({setAccommodationList, accommodationList}) {

  return (
    <div className="w-1/2 bg-white rounded-md flex flex-col px-16">
      <div className="flex px-4 mt-8 gap-4">
        <CheckInOutFilter setAccommodationList={setAccommodationList} accommodationList={accommodationList} />
        <MinPersonFilter setAccommodationList={setAccommodationList} accommodationList={accommodationList} />
      </div>
      <div className=" flex flex-wrap">
        
      </div>

    </div>
  )
}

function CheckInOutFilter({setAccommodationList, accommodationList}) {
    const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    return(
      <div className="w-2/3 bg-white divide-x-2 divide-[#8C8CA1] h-28 flex relative rounded-xl font-semibold">
        <div className="bg-[#ECF1F4] px-4 py-1 text-lg rounded-l-xl relative w-1/2">
          <input 
          type="date" 
          id="session-date"
          name="session-date"
          className="w-full bg-[#ECF1F4] h-full text-lg outline-none pb-8" 
          onChange={(e) => setAccommodationList({...accommodationList, "checkIn":new Date(e.target.value)})}
          format="dd MM yyyy"
          onFocus={(e) => e.target.click()}
          />
          <div className="text-[#8C8CA1] h-8 absolute bottom-6 left-[33%] text-center">{accommodationList.checkIn ? day[accommodationList.checkIn.getDay()]: day[today.getDay()]}</div>
        </div>
        <div className="bg-[#ECF1F4] px-4 py-1 text-lg rounded-r-xl w-1/2 relative">
          <input 
          type="date" 
          className="w-full bg-[#ECF1F4] h-full text-lg outline-none pb-8"
          id="session-date"
          name="session-date"
          onChange={(e) => setAccommodationList({...accommodationList, "checkOut": new Date(e.target.value)})}
          format="dd MM yyyy"
          onFocus={(e) => e.target.click()}
          />
          <div className="text-[#8C8CA1] h-8 absolute bottom-6 left-[33%]  text-center">{accommodationList.checkOut ? day[accommodationList.checkIn.getDay()]: day[today.getDay()]}</div>
        </div>
      </div>
    )
  }

function MinPersonFilter({setAccommodationList, accommodationList}) {
  const sendAccommodationList = useCallback((key, value) => {
    setAccommodationList({
      ...accommodationList,
      [key]: value,
    })
  }, [accommodationList])

  return(
    <div className="w-1/3 bg-[#ECF1F4] rounded-xl py-1 flex flex-col place-content-center place-items-center font-semibold relative">
      <div className="flex rounded-xl text-black w-full place-content-center">
        <input 
        type="number"
        onChange={(e) => sendAccommodationList("minPerson", e.target.value)}
        className="w-8 bg-[#ECF1F4]   text-lg rounded-xl text-center outline-none mr-2"
        placeholder="1"
        />
        <div className="text-lg">Person</div>
      </div>
      <div className="w-full text-center">
        per room
      </div>
    </div>
  )
}
