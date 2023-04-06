import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import Signup from '@/components/accountmanage/Signup'



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
    <div className='font-oxygen'>
      
    </div>
  )
}
