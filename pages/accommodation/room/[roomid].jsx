import { useRouter } from "next/router";

export default function room() {
  const rounter = useRouter()
  const { roomid } = rounter.query
  return (
    <div>
      <h1>Room {roomid}</h1>
    </div>
  )
}