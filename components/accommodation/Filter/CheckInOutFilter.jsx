import { useCallback } from "react"

export default function CheckInOutFilter({setAccommodationList, accommodationList}) {

  const sendAccommodationList = useCallback((key, value) => {
    setAccommodationList({
      ...accommodationList,
      [key]: value,
    })
  }, [accommodationList])

  

  return(
    <div className="w-2/3 bg-[#ECF1F4] divide-x-2 divide-black flex flex-col">
      <input type="date" className="w-full" onChange={(e) => sendAccommodationList("checkIn", e.target.value)}/>
    </div>
  )
}