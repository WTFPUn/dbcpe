import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import Template from '@/components/Template'
import Link from 'next/link'



export default function Home() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    const data = await res.json()
    if (data.message) {
      setMessage(data.message)
    } else {
      setMessage('Login successful')
    }
  }

  return (
    <Template hscreen>
      <div className='w-full h-[94%] relative'>
        <img src='/images/homepage/Homepage.png' className='w-full h-full object-fill' />
        <div className='absolute top-[45%] left-1/4 transform -translate-x-1/2 -translate-y-1/2'>
          <div className='flex flex-col items-left'>
            <div className='flex flex-col items-left'>
              <div className='text-[6rem] font-bold text-white font-dmserif'>Welcome Our</div>
              <div className='text-[6rem]  font-bold text-white font-dmserif'>MISH Hotel</div>
              <Link href={"/accommodation"} className=' text-sm text-white font-medium bg-[#6C6EF2] rounded-full px-2 py-2 text-center uppercase w-[20rem] self-center'>explore our accommodation</Link>
            </div>
          </div>
        </div>
      </div>
    </Template>
  )
}
