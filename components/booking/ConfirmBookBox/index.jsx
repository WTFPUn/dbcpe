import ConfirmExhBookBox from "./ConfirmExhBookBox";
import ConfirmRoomBookBox from "./ConfirmRoomBookBox";

export default function ConfirmBookBox({roomtype, data}){
  if (roomtype == "room") {
    return <ConfirmRoomBookBox data={data} />
  }
  else if (roomtype == "exhibition") {
    return <ConfirmExhBookBox data={data} />
  }
}