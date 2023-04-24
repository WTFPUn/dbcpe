import Room from "./Room"

export default function RoomList({roomList}) {
  // console.log("room", roomList)
  return(
    <div className="w-3/4 bg-white pb-16 rounded-md mt-8 px-16">
      <div className="w-full text-center text-4xl font-semibold py-16 border-[#8C8CA1] border-b mb-4">Accommodation</div>
      {roomList.map((room, index) => {
        return(
          <Room room={room} key={index}/>
        )
      }
      )}
    </div>
  )
}