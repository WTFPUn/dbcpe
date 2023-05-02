import { useRouter } from 'next/router';

import QueueList from '../icons/booking/QueueList';
import CheckCircle from '../icons/booking/CheckCircle';
import HomeModern from '../icons/booking/HomeModern';


export default function Section() {
  const router = useRouter();
  const path = router.pathname;
  // regex to check if path includes 'booking/[number] (number can be any number)' and not include 'booking/confirmbook' and 'booking/bill'
  let pathList = {
    'room': path.includes('booking') && !path.includes('confirmbook') && !path.includes('bill'),
    'confirmbook': path.includes('confirmbook'),
    'bill': path.includes('bill'),
  }
  return(
    <div className='flex w-[85%] border-b border-[#8C8CA1] place-content-center gap-32 py-8'>
      <div className='flex flex-col w-max place-items-center gap-2'>
        <HomeModern isIn={pathList.room}/>
        <div className='text-[0.75rem] font-bold'>
          ROOMS
        </div>
      </div>
      <div className='flex flex-col w-max place-items-center gap-2'>
        <QueueList isIn={pathList.confirmbook}/>
        <div className='text-[0.75rem] font-bold'>
          ORDER
        </div>
      </div>
      <div className='flex flex-col w-max place-items-center gap-2'>
        <CheckCircle isIn={pathList.bill}/>
        <div className='text-[0.75rem] font-bold'>
          BILL
        </div>
      </div>
    </div>
  )
}