import CheckOutIcon from "../icons/CheckOutIcon";

export default function CheckOutCard({value}) {
  return(
    <div className=" rounded-2xl px-4 py-5 bg-[#4BD4FF] flex justify-between text-white w-[18rem]">
      <div className="flex flex-col content-between">
        <div className="text-5xl font-bold">{value}</div>
        <div className="text-lg mt-4">Check-out</div>
      </div>
      <div className="h-full place-items-start">
        <CheckOutIcon/>
      </div>
    </div>
  )
}