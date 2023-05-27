import CheckInIcon from "../icons/CheckInIcon";

export default function CheckInCard({value}) {
  return(
    <div className=" rounded-2xl px-4 py-5 bg-[#1890FF] flex justify-between text-white w-[18rem]">
      <div className="flex flex-col content-between">
        <div className="text-5xl font-bold">{value}</div>
        <div className="text-lg mt-4">Check-in</div>
      </div>
      <div className="h-full place-items-start">
        <CheckInIcon/>
      </div>
    </div>
  )
}