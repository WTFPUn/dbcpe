import Template from "@/components/Template";
import React, { useState, useEffect } from 'react';

export default function assigncleaning() {
  const [accomodationSub, setAccomodationSub] = useState([{}])
  const [exhibitionSub, setexhibitionSub] = useState([{}])
  const [housekeeper, setHousekeeper] = useState([{
    "account_id": "",
    "first_name": "",
    "last_name": "",
    "role": "",
    "sub_role": "",
  }])
    
  const [token, setToken] = useState("");
  const [roomType, setRoomType] = useState("Accommodation");
  const [selectHousekeeper, setSelectHousekeeper] = useState("");

  const [filter, setFilter] = useState({
    "dirty_status": false,
    "clean_status": false,
    "room_type": "",
  })

  const [room, setRoom] = useState([{
    "room_id": "",
    "room_no": "",
    "clean_status": "",
    "housekeeper": "",
    "housekeeper_fullname": "",
    "room_type_id": "",
    "room_type": {
      "roomtype_name": "",
    },
    "availability": "",
  }]);

  const [exhibition, setExhibition] = useState([{
    "exhibition_id": "",
    "exhibition_type_id": "",
    "name": "",
    "housekeeper": "",
    "housekeeper_fullname": "",
    "clean_status": "",
    "room_type": {
      "type_name": "",
    },
    "availability": "",
  }]);


  useEffect(() => {
    fetch("/api/room/getroomtype", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setAccomodationSub(data.allroomtype)
      });
    fetch("/api/exhibition/getexhibitiontype", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setexhibitionSub(data.allexhibitiontype)
      });
    fetch(`/api/admin/getroomforassign`,{
      method: "GET"
    })
      .then((res) => res.json())
      .then((data) => {
        // add selected to each room
        data.getroom.forEach((room) => {
          room.selected = false;
        });
        setRoom(data.getroom);
      });
    fetch(`/api/admin/getexhibitionforassign`,{
      method: "GET"
    })
      .then((res) => res.json())
      .then((data) => {
        // add selected to each room
        data.getroom.forEach((exhibition) => {
          exhibition.selected = false;
        });
        setExhibition(data.getroom);
      });


    fetch("/api/admin/getallhousekeeper", {
      method: "GET",
      })
      .then((res) => res.json())
      .then((data) => {
        setHousekeeper(data.gethousekeeper);
      });
    
    
  }, []);

  const handleClickFilter = (e, filterkey) => {
    var clean = ""
    var dirty = ""
    var room_type = ""

    if (filterkey === "clean_status" || filterkey === "dirty_status") {
      setFilter({
        ...filter,
        [filterkey]: e.target.checked,
      });
      if (filterkey === "clean_status") {
        clean = e.target.checked
        dirty = filter.dirty_status
        room_type = filter.room_type
      }
      if (filterkey === "dirty_status") {
        clean = filter.clean_status
        dirty = e.target.checked
        room_type = filter.room_type
      }
    } else {
      e.target.checked
      setFilter({
        ...filter,
        [filterkey]: e.target.value,
      });
      if (filterkey === "room_type") {
        room_type = e.target.value
        clean = filter.clean_status
        dirty = filter.dirty_status
      }
    }



    // XNOR clean and dirty 
    const clean_status = clean === dirty ? "" : clean ? 1 : 0;
    console.log("clean_status = ", clean_status)
    if (roomType === "Accommodation") {
      fetch(`/api/admin/getroomforassign?roomtype_id=${room_type}&clean_status=${clean_status}`,{
        method: "GET"
      })
        .then((res) => res.json())
        .then((data) => {
          // add selected to each room
          data.getroom.forEach((room) => {
            room.selected = false;
          });
          setRoom(data.getroom);
        }
      );
    } else {
      fetch(`/api/admin/getexhibitionforassign?roomtype_id=${room_type}&clean_status=${clean_status}`,{
        method: "GET"
      })
        .then((res) => res.json())
        .then((data) => {
          // add selected to each room
          data.getroom.forEach((exhibition) => {
            exhibition.selected = false;
          });
          setExhibition(data.getroom);
        }
      );
    }
  }

  const [message, setMessage] = useState("")
  const [submitStatus, setSubmitStatus] = useState(false)

  const handleClickAssign = () => {
    if(roomType === "Accommodation") {
       fetch("/api/admin/roomassignworkforhousekeeper",{
        method: "PUT",
        body: JSON.stringify({
          account_id: selectHousekeeper,
          room_id: room,  
       })
    }
    )
    .then((res) => res.json())
    .then((data) => {
      setMessage(data.message)
      setSubmitStatus(data.success)
      window.location.reload();

    }
    );
    } else {
      fetch("/api/admin/exhibitionassignworkforhousekeeper",{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        account_id: selectHousekeeper,
        room_id: exhibition,  
       })
    }
    )
    .then((res) => res.json())
    .then((data) => {
      setMessage(data.message)
      setSubmitStatus(data.success)
      // reload page
      window.location.reload();
    }
    );
  }
}

  return(
    <Template hscreen>
      <div className="bg-[#F5F5F5] w-[60%] h-full mt-16 rounded-t-md px-[10rem] pt-8">
        <div className="w-full text-4xl font-semibold text-center h-[15%] pt-4">House Keeping</div>
        <div className="h-[80%] w-full flex flex-col gap-4">
          <div className="w-full rounded-md drop-shadow px-8 flex  divide-x bg-[#FAFCFE] h-[8%]">
            <select className="text-[#C4C4C4] text-xl font-medium py-2 w-[90%] px-4 rounded-l-md appearance-none bg-[#FAFCFE]" onChange={(e) => {setRoomType(e.target.value)}}>
              <option value="Accommodation">Accommodation</option>
              <option value="Exhibition">Exhibition</option>
            </select>
            <select className="text-[#C4C4C4] text-xl font-medium py-2 w-[10%] px-4 rounded-r-md appearance-none bg-[#FAFCFE]" onChange={(e) => {handleClickFilter(e, "room_type")}}>
              <option value="">All</option>
              {roomType == "Accommodation" ? accomodationSub.map((data) => {
                return(
                  <option className="px-2" value={data.roomtype_id} key={"room_"+data.roomtype_name}>{data.roomtype_name}</option>
                )
              }) : exhibitionSub.map((data) => {
                return(
                  <option className="px-2" value={data.exhibition_type_id} key={"exhibition_"+data.type_name}>{data.type_name}</option>
                )
              })}
            </select>
          </div>
          <div className="w-full flex gap-4  h-[20%]">
              <div className="flex flex-col px-8 py-4 bg-[#FAFCFE]  rounded-md drop-shadow w-[25%]">
                <div className="text-black font-semibold text-medium">Clean Status</div>
                <div className="flex gap-2 mt-6 self-center">
                  <div className="flex gap-3">
                    <input type="checkbox" className="h-6 w-6 accent-[#1890FF]" onClick={(e) => {handleClickFilter(e, "clean_status")}}/>
                    <div className="text-black font-medium text-medium">Clean</div>
                  </div>
                  <div className="flex gap-3">
                    <input type="checkbox" className="h-6 w-6 accent-[#FF6B4A]" onClick={(e) => {handleClickFilter(e, "dirty_status")}}/>
                    <div className="text-black font-medium text-medium">Dirty</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col px-8 py-4 bg-[#FAFCFE]  rounded-md drop-shadow w-[75%]">
                <div className="text-black font-semibold text-medium">Assign selected room to</div>
                <div className="flex gap-4 py-4 place-items-center">
                  <select className="text-black text-base font-medium py-2 px-4 w-[60%] rounded-md appearance-none bg-[#FAFCFE] border border-[#C4C4C4]" onChange={(e) => {setSelectHousekeeper(e.target.value)}}>
                    <option value="">--Select Housekeeper--</option>
                    {housekeeper.map((data) => {
                      return(
                        <option className="px-2 text-[#C4C4C4]" value={data.account_id} key={"housekeeper_"+data.first_name + "_" + data.last_name}>{data.first_name + " " + data.last_name}</option>
                      )
                    })}
                  </select>
                  <div className=" uppercase bg-[#6C6EF2] text-white text-base w-[30%] rounded-md px-4 py-2 text-center " onClick={() => {handleClickAssign()}}>Assign now</div>
                </div>
              </div>
          </div>
          <div className="w-full h-[24rem] bg-[#FAFCFE] flex flex-col px-8 py-4 drop-shadow">
              <div className="flex font-semibold text-black h-[10%]">
                <div className=" w-[10%] text-center">Selected</div>
                <div className=" w-[10%] text-center">Room</div>
                <div className=" w-[20%] text-center">Room-type</div>
                <div className=" w-[20%] text-center">Availability</div>
                <div className=" w-[20%] text-center mr-2">Status</div>
                <div className=" w-[20%] text-center mr-5 truncate">Responsible by</div>
              </div>
              <div className="flex flex-col h-[90%] overflow-y-auto">
                {roomType === "Accommodation" ? room.map((data) => {
                  return(
                    <div className="flex font-medium text-[#8C8CA1] py-4" key={"room_"+data.room_id}>
                      <div className=" w-[10%] text-center">
                        <input type="checkbox" className="h-4 w-4" onClick={() => {setRoom([...room.map((room) => {
                          if(room.room_id === data.room_id){
                            room.selected = !room.selected;
                          }
                          return room;
                        })])}}/>
                      </div>
                      <div className=" w-[10%] text-center">{data.room_id}</div>
                      <div className=" w-[20%] text-center">{data.room_type.roomtype_name}</div>
                      <div className=" w-[20%] text-center">{data.availability}</div>
                      <div className=" w-[20%] text-center">{data.clean_status ? "Clean" : "Dirty"}</div>
                      <div className=" w-[20%] text-center">{data.housekeeper_fullname ? data.housekeeper_fullname : "-"}</div>
                    </div>
                  )
                }) : exhibition.map((data) => {
                  return(
                    <div className="flex font-medium text-[#8C8CA1] py-4" key={"exhibition_"+data.exhibition_id}>
                      <div className=" w-[10%] text-center">
                        <input type="checkbox" className="h-4 w-4" onClick={() => {setExhibition([...exhibition.map((room) => {
                          if(room.exhibition_id === data.exhibition_id){
                            room.selected = !room.selected;
                          }
                          return room;
                        })])}}/>
                      </div>
                      <div className=" w-[10%] text-center">{data.exhibition_id}</div>
                      <div className=" w-[20%] text-center">{data.room_type.type_name}</div>
                      <div className=" w-[20%] text-center">{data.availability}</div>
                      <div className=" w-[20%] text-center">{data.clean_status ? "Clean" : "Dirty"}</div>
                      <div className=" w-[20%] text-center">{data.housekeeper_fullname}</div>
                    </div>
                  )
                })}
                      
                        
              </div>
          </div>
        </div>
      </div>
    </Template>
  )
}