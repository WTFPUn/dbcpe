import Template from "@/components/Template";
import React, { useState, useEffect } from 'react';
import { jwtdecode } from "@/utils/verify";
import BookHistoryBox from "@/components/BookHistory/BookHistoryBox";
import BookHistory from "@/components/BookHistory";


export default function history() {
  const [token, setToken] = useState("");
  const [history, setHistory] = useState([{
    "account_id": "",
    "bill_id": "",
    "book_list": [{
      "book_id": "",
      "book_type": "",
    }],
    "code_id": "",
    "total_bill": "",
    "create_date": "",
    "pay_status": "",
    "book": [{
      "book_id": "",
      "room_id": "",
      "book_date": "",
      "checkin_date": "",
      "checkout_date": "",
      "room_type": "",
    }],
  }]);
    

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
    if (token) {
      const decoded = jwtdecode(token);
      const { account_id } = decoded;
      fetch("/api/book/bookinghistory", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
            },
        })
        .then((res) => res.json())
        .then((data) => {
          setHistory(data.getbill);
        });
    }
    console.log(history);
  }, []);

  return(
    <Template title="History" hscreen>
      {/* <div>{history[0]['bill_id']}</div> */}
      <div className="flex flex-col w-[85%] px-8 bg-[#ECF1F4] rounded-t-md py-4 h-full overflow-y-hidden">
        <div className="text-4xl font-semibold w-full text-center px-8 border-b border-[#8C8CA1] py-8 h-[15%]">
          Booking History
        </div>
        <BookHistory dataList={history}/>
      </div>
    </Template>
  )
}