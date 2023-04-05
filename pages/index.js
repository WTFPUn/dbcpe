import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [message, setMessage] = useState(0)

  const updateMessage = async () => {
    const res = await fetch('/api/updateRoom', { method: 'POST', body: JSON.stringify({ value: message }) })
    const data = await res.json()
    setMessage(data.value)
  }
  return (
    <>
      <h1 className="text-3xl font-bold underline">
      {message}
    </h1>
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={updateMessage}
    >
      Update Message
    </button>
    </>
  )
}
