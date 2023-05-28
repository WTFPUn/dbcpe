import Template from "@/components/Template";
import DownIcon from "@/components/icons/Confirm/DownIcon";
import { useEffect, useState } from "react";

export default function accommodationassignment() {

  const [accommodation, setAccommodation] = useState([]);
  const [accomodationType, setAccomodationType] = useState([]);

  const [filter, setFilter] = useState({
    clean: false,
    dirty: false,
    roomtype: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch('/api/admin/getroomforupdate',
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        })
        .then((res) => res.json())
        .then((data) => {
          // add selected property to each room
          data.getroom.forEach((room) => {
            room.selected = false;
          });
          setAccommodation(data.getroom);
        });

      fetch('/api/room/getroomtype',
        {
          method: "GET",
        })
        .then((res) => res.json())
        .then((data) => {
          setAccomodationType(data.allroomtype);
        }
        );

    }
  }, []);

  const handleFilter = (e, filterkey) => {
    var clean = ""
    var dirty = ""
    var roomtype = ""

    if (filterkey === "clean_status" || filterkey === "dirty_status") {
      setFilter({
        ...filter,
        [filterkey]: e.target.checked,
      });
      if (filterkey === "clean_status") {
        clean = e.target.checked
        dirty = filter.dirty_status
        roomtype = filter.roomtype
      }
      if (filterkey === "dirty_status") {
        clean = filter.clean_status
        dirty = e.target.checked
        roomtype = filter.roomtype
      }
    } else {
      e.target.checked
      setFilter({
        ...filter,
        [filterkey]: e.target.value,
      });
      if (filterkey === "roomtype") {
        roomtype = e.target.value
        clean = filter.clean_status
        dirty = filter.dirty_status
      }
    }

    const clean_status = clean === dirty ? "" : clean ? 1 : 0;

    console.log(clean_status, roomtype)
    const token = localStorage.getItem("token");
    if (token) {
    fetch(`/api/admin/getroomforupdate?${"clean_status=" + clean_status + "&roomtype_id=" + roomtype}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      })
      .then((res) => res.json())
      .then((data) => {
        // add selected property to each room
        data.getroom.forEach((room) => {
          room.selected = false;
        });
        setAccommodation(data.getroom);
      }
      );    
  }
}

  const handleSubmit = () => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch('/api/admin/roomupdateworkforhousekeeper', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify(
          {
            room_id: accommodation,
          }
        ),
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message + " " + data.success);
          // reload page
          window.location.reload();
        });
    }
  }

  const renderTime = new Date()

  return(
    <Template hscreen>
      <div className="bg-[#F5F5F5] w-[60%] h-full mt-16 rounded-t-md px-[6rem] pt-8">
        <div className="w-full text-4xl font-semibold text-center h-[12%] pt-4 ">Accommodation Assignment</div>
        <div className="mt-4 w-full h-[80%]  flex flex-col gap-8">
          <div className="flex w-full h-[20%] gap-4">
            <div className="flex w-[25%] rounded-md bg-[#FAFCFE] flex-col drop-shadow px-4 py-4">
              <div className="text-lg font-semibold ml-4">Room Status</div>              
              <div className="flex w-full">
                <div className="flex items-center py-4 px-4">
                  <input type="checkbox" className="h-6 w-6 accent-[#06CBC3] rounded-md" onChange={(e) => handleFilter(e, "clean_status")} />
                  <div className="ml-2 text-base">Clean</div>
                </div>
                <div className="flex items-center font-light ">
                  <input type="checkbox" className="h-6 w-6 accent-[#FF6B4A] rounded-md" onChange={(e) => handleFilter(e, "dirty_status")} />
                  <div className="ml-2 text-base font-light">Dirty</div>
                </div>
              </div>
            </div>
            <div className="w-[75%] flex flex-col gap-4">
              <div className="w-full h-1/2 rounded-md bg-[#FAFCFE] drop-shadow flex pl-4 place-items-center">
                <DownIcon/>
                <select className="w-full h-full rounded-md bg-[#FAFCFE] ml-4 appearance-none outline-none px-4 text-[#C4C4C4]" onChange={(e) => handleFilter(e, "roomtype")}>
                  <option className="px-4 py-2" value="">All rooms</option>
                  {accomodationType.map((roomtype) => (
                    <option className="px-4 py-2" value={roomtype.roomtype_id}>{roomtype.roomtype_name}</option>
                  ))}
                </select>
              </div>
              <div className="w-full h-1/2 rounded-md bg-[#FAFCFE] drop-shadow place-items-center flex px-4 py-2">
                <div className=" font-semibold text-lg ">
                  Update selected room to be cleaned
                </div>
                <div
                  className="ml-auto px-16 py-2 text-white bg-[#6C6EF2] uppercase rounded-md cursor-pointer"
                  onClick={handleSubmit}
                >
                  Update now
                </div>
              </div>
            </div>
          </div>
          <div
            className="w-full h-[28rem] rounded-md bg-[#FAFCFE] drop-shadow px-4 py-4 overflow-y-auto"
          >
            <div className="flex font-semibold text-black h-[10%]">
              <div className="w-[10%] text-center">Selected</div>
              <div className="w-[15%] text-center">Room</div>
              <div className="w-[15%] text-center">Room Type</div>
              <div className="w-[15%] text-center">Floor</div>
              <div className="w-[15%] text-center">Status</div>
              <div className="w-[30%] text-center">Complete Time</div>
            </div>
            <div className="w-full h-[90%] flex-col flex overflow-y-auto text-[#8C8CA1]">
              {accommodation.map((room) => {
                return(
                  <div className="flex py-4 place-items-center">
                  <div className="w-[10%] flex items-center place-content-center">
                    <input
                      type="checkbox"
                      className="h-6 w-6 accent-[#06CBC3] rounded-md"
                      onClick={() => setAccommodation([...accommodation.map((roommap) => {
                        if (room.room_id === roommap.room_id) {
                          roommap.selected = !roommap.selected;
                        }
                        return roommap;
                      })])}
                    />
                  </div>
                  <div className="w-[15%]  text-center">{room.room_id}</div>
                  <div className="w-[15%]  text-center">{room.room_type.roomtype_name}</div>
                  <div className="w-[15%]  text-center">{room.room_floor}</div>
                  <div className={"w-[15%]  text-center " + (room.clean_status ? "" : "text-[#FF6B4A]")}>{room.clean_status ? "Clean" : "Dirty"}</div>
                  <div className="w-[30%]  text-center">{room.clean_status ? room.completed_time : "-"}</div>
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