"use client"
import React, { useState } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import Link from 'next/link'


const Navbar = () => {
  const { data: session } = useSession()
  const [showdropdown, setShowdropdown] = useState(false)
  const isCreator = session?.user?.isCreator
  
  return (
    <nav className='bg-gray-900 shadow-lg shadow-white text-white flex justify-between items-center px-4 py-3 md:px-6 md:py-4 flex-col md:flex-row gap-4 md:gap-0'>
        <Link className="Logo font-bold text-base md:text-lg flex justify-center items-center" href={"/"}>
          <img src="/giphy.webp" width={44} alt="" />
          <span className='ml-2'>Patreon Clone</span>
        </Link>

        <div className='relative w-full md:w-auto flex justify-center md:justify-end'>
{session && <><button onClick={()=>setShowdropdown(!showdropdown)} onBlur={()=> {setTimeout(() => {
  setShowdropdown(false)
}, 300);}}  id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className="inline-flex items-center justify-center text-white mx-2 md:mx-4 bg-blue-700 box-border border border-transparent hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 shadow-xs font-medium leading-5 rounded-lg text-xs md:text-sm px-3 md:px-4 py-2 md:py-2.5 focus:outline-none truncate" type="button">
  <span className='hidden sm:inline'>Welcome</span> {session.user.email}
  <svg className="w-4 h-4 ms-1.5 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/></svg>
</button>

<div id="dropdown" className={`z-10 ${showdropdown?"": "hidden"} absolute right-0 md:left-[150px] top-12 md:top-auto bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-44 dark:bg-gray-700`}>
    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200 font-medium" aria-labelledby="dropdownDefaultButton">
      
      <li>
        <Link href="/dashboard" className="inline-flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white rounded">Dashboard</Link>
      </li>
      
     
      <li>
        <Link href="/raunitkumar" className="inline-flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white rounded">Creator Page</Link>
      </li>
      
      
      <li>
        <Link onClick={()=> signOut()} href="#" className="inline-flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white  rounded">Sign out</Link>
      </li>
      <li>
        <Link href= "/" className="inline-flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white  rounded">Home</Link>
      </li>
    </ul>
</div></>
}
          
          {session && 
          <button className='text-white bg-linear-to-br from-purple-600 to-blue-500 hover:bg-linear-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-xs md:text-sm px-3 md:px-4 py-2 md:py-2.5 text-center leading-5' onClick={()=> {signOut()}}>Logout</button>}

          {!session &&  
          <Link href={"/login"}>
          <button className='text-white bg-linear-to-br from-purple-600 to-blue-500 hover:bg-linear-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-xs md:text-sm px-3 md:px-4 py-2 md:py-2.5 text-center leading-5'>Login</button></Link>}
        </div>
      
    </nav>
  )
}

export default Navbar
