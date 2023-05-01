import Template from "@/components/Template";
import RoomList from "@/components/accommodation/RoomList";
import { sampleRoomQuery } from "@/utils/sample";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";

export default function accommodation() {
  
  let paramsRoomType = [];
  const [queriedRoom, setQueriedRoom] = useState([]);
  const [roomType, setRoomType] = useState([]);
  
  // get room type from slug for first time of page load
 useEffect( () => {
      // not NaN then fetch room with room type
      fetch(`/api/room/getroomquery`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((res) => res.json())
      .then((data) => {
        setQueriedRoom(data.successRoom);
      })

    fetch(`/api/room/getroomtype`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => res.json())
    .then((data) => {
      let roomtyperes = data.allroomtype;
      // add selected key to each room type
      roomtyperes.forEach((roomtype) => {
        roomtype.selected = false;
      })
      setRoomType(roomtyperes);
      console.log(roomtyperes);
      setAccommodationList({
        ...accommodationList,
          roomType: Array(roomtyperes.length).fill(0)
  })
    }
    );

  }, []);
  
  // const sampleRoom = sampleRoomQuery;
  const [accommodationList, setAccommodationList] = useState({
    "checkIn": "",
    "checkOut": "",
    "minPerson": "",
    "roomType": roomType,
  });

  const handleSearch = async () => {
    fetch(`/api/room/getroomquery?${new URLSearchParams(
      accommodationList)})`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => res.json())
    .then((data) => {
      setQueriedRoom(data.successRoom);
    }
    );
  }
  return (
    <Template title="Accommodation">
      <FilterBar setAccommodationList={setAccommodationList} accommodationList={accommodationList} roomType={roomType} handleSearch={handleSearch}/>
      <RoomList roomList={queriedRoom} />
    </Template>
  )
}

function FilterBar({setAccommodationList, accommodationList, roomType, handleSearch}) {

  return (
    <div className="w-2/5 bg-white rounded-md flex flex-col px-16 pb-8 ">
      <div className="flex px-4 mt-8 gap-4">
        <CheckInOutFilter setAccommodationList={setAccommodationList} accommodationList={accommodationList} />
        <MinPersonFilter setAccommodationList={setAccommodationList} accommodationList={accommodationList} />
      </div>
      <div className=" flex flex-wrap">
        <RoomTypeFilter setAccommodationList={setAccommodationList} accommodationList={accommodationList} roomType={roomType} />
      </div>
      <div className="rounded-md bg-[#6C6EF2] text-white w-[40%] text-center py-2 self-center" onClick={handleSearch}> Search </div>

    </div>
  )
}

function CheckInOutFilter({setAccommodationList, accommodationList}) {
    const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();

    const [currnetDayCheckIn, setCurrentDayCheckIn] = useState(today.getDay());
    const [currnetDayCheckOut, setCurrentDayCheckOut] = useState(today.getDay());

    useEffect(() => {
      if(accommodationList.checkIn) {
        setCurrentDayCheckIn(accommodationList.checkIn.getDay());
        setCurrentDayCheckOut(accommodationList.checkIn.getDay());
      }
    }, [accommodationList.checkIn])
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
          <div className="text-[#8C8CA1] h-8 absolute bottom-6 left-[33%] text-center">{accommodationList.checkIn ? day[currnetDayCheckIn] : day[today.getDay()]}</div>
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
          <div className="text-[#8C8CA1] h-8 absolute bottom-6 left-[33%]  text-center">{accommodationList.checkIn ? day[currnetDayCheckOut] : day[today.getDay()]}</div>
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

function RoomTypeFilter({setAccommodationList, accommodationList, roomType}) {
  const sendAccommodationList = useCallback((key, value) => {
    setAccommodationList({
      ...accommodationList,
      [key]: value,
    })
  }, [accommodationList])

 return(
  <div className="flex flex-wrap place-content-center my-4 px-2 gap-4">
    {roomType.map((roomtype, index) => {

      return(
        <div 
          className={`border-2 px-2 py-1 bg-transparent rounded-full ${roomtype.selected ? "border-[#6C6EF2] text-[#6C6EF2]" : "border-[#8C8CA1] text-[#8C8CA1]"} font-medium`}
          key={index}
          onClick={() => {
            let newRoomType = [...roomType];
            newRoomType[index].selected = !newRoomType[index].selected;
            // setAccomodationList use selected key only
            let selectedRoomType = newRoomType.map((roomtype) => {
              return roomtype.selected ? 1 : 0;
            })
            
            sendAccommodationList("roomType", selectedRoomType);
          }}
        >
          {roomtype.roomtype_name}
        </div>
      )
    })}
  </div>
 ) 
}