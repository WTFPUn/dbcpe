import { useCallback } from "react";
import CheckInOutFilter from "./Filter/CheckInOutFilter";

// recieve set state function as props and pass it to the filter components
export default function FilterBar({setAccommodationList, accommodationList}) {

  return (
    <div className="w-1/2 bg-white rounded-md flex flex-col">
      <div className="flex">
      <CheckInOutFilter setAccommodationList={setAccommodationList} accommodationList={accommodationList} />
<FilterBar setAccommodationList={setAccommodationList} accommodationList={accommodationList} />

      </div>
      <div className=" flex flex-wrap">

      </div>

    </div>
  )
}