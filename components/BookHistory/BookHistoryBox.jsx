import { useState } from "react"
import UpIcon from "../icons/Confirm/UpIcon";
import DownIcon from "../icons/Confirm/DownIcon";
import Link from "next/link";

export default function BookHistoryBox({data, idx}) {

  const [visible, SetVisible] = useState(false);
  
  return (
    <div className="bg-[#FAFCFE] rounded-md w-full drop-shadow">
      <div className="drop-shadow w-full text-xl font-semibold h-24 place-items-center px-8 flex gap-4 rounded-b-md">
        <div>{"No." + idx}</div>
        <div>{"Bill ID:" + data.bill_id}</div>
        {data.pay_status ? <div className="text-[#1890FF] font-medium">{"(Paid)"}</div> : <div className="text-[#F44336] font-medium">{"(Unpaid)"}</div>}
        <Link href={"/booking/bill/" + data.bill_id} className=" font-medium underline text-[#1890FF] ml-auto">View the bill</Link>
        {visible ? <div onClick={() => SetVisible(false)}> <UpIcon/> </div> : <div onClick={() => SetVisible(true)}><DownIcon/></div>}
      </div>
      {visible && (
        <div className="w-full rounded-b-md drop-shadow py-4 px-8 flex flex-col gap-4 font-semibold text-sm">
            {data.book.map((book, idx) => (
              <div key={idx}>
                <div className="flex justify-between">
                  <div>Book ID:</div>
                  <div className="text-[#6C6EF2]">{book?.book_id ? book?.book_id : book?.exhibition_booking_id}</div>
                </div>
                <div className="flex justify-between">
                  <div>Book On:</div>
                  <div className="text-[#6C6EF2]">{Date(book.book_date)}</div>
                </div>
                <div className="flex justify-between">
                  <div>Check-in Date:</div>
                  <div className="text-[#6C6EF2]">{book.checkin_date}</div>
                </div>
                <div className="flex justify-between">
                  <div>Check-out Date:</div>
                  <div className="text-[#6C6EF2]">{book.checkout_date}</div>
                </div>
                <div className="flex justify-between">
                  <div>Room type:</div>
                  <div className="text-[#6C6EF2]">{book?.book_id ? "Accomodation" : "Exhibition"}</div>
                </div>
            </div>
            ))
            }
            <div>
              <div className="flex justify-between">
                <div>Status:</div>
                <div className="text-[#6C6EF2]">{data.pay_status ? "Paid" : "Unpaid"}</div>
              </div>
              <div className="flex justify-between">
                <div>Payment method:</div>
                <div className="text-[#6C6EF2]">{data.payment_method ? data.payment_method : "-"}</div>
              </div>
              <div className="flex justify-between">
                <div>Paid to Date:</div>
                <div className="text-[#6C6EF2]">{data.pay_due_date}</div>
              </div>
            </div>
        </div> 
      )}
    </div>
  )
}