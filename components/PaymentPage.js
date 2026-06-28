"use client"
import React, { useState, useEffect } from 'react'
import Script from 'next/script'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { fetchuser, fetchpayments, initiate } from '@/actions/useractions'
import { notFound } from "next/navigation"
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'


const PaymentPage = ({ username }) => {

  // const {data:session} = useSession()  
  const [paymentform, setPaymentform] = useState({ name: "", message: "", amount: "" })
  const [currentUser, setcurrentUser] = useState({})
  const [payments, setPayments] = useState([])
  const searchParams = useSearchParams()
  const router = useRouter()


  useEffect(() => {

    getData();

  }, [username])

  useEffect(() => {
    if (searchParams.get("paymentdone") === "true") {
      toast('🦄 Payment Successful!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
    router.push(`${username}`)
  }, [])


  const handleChange = (e) => {
    setPaymentform({
      ...paymentform,
      [e.target.name]: e.target.value
    })
  }

  const getData = async () => {
    let u = await fetchuser(username)
    setcurrentUser(u)
    let dbpayments = await fetchpayments(username)
    setPayments(dbpayments)
    console.log(u, dbpayments)
  }

  const pay = async (amount) => {
    // Get the orderId
    let a = await initiate(amount, username, paymentform)
    let orderId = a.id

    var options = {
      "key": currentUser.razorpayid, // Enter the Key ID generated from the Dashboard
      "amount": amount, // Amount is in currency subunits. 
      "currency": "INR",
      "name": "Patreon Clone", //your business name
      "description": "Test Transaction",
      "image": "https://example.com/your_logo",
      "order_id": orderId, // This is a sample Order ID. Pass the id obtained in the response of Step 1
      "callback_url": `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
      "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
        "name": "Gaurav Kumar", //your customer's name
        "email": "gaurav.kumar@example.com",
        "contact": "+919876543210" //Provide the customer's phone number for better conversion rates 
      },
      "notes": {
        "address": "Razorpay Corporate Office"
      },
      "theme": {
        "color": "#3399cc"
      }
    }
    var rzp1 = new Razorpay(options);

    rzp1.open();
  }
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
      <div className='cover w-full bg-red-50 relative'>
        <img className='object-cover w-full h-[20vh] md:h-[40vh]' src={currentUser.coverpic || "/Coverpic.jpeg"} />

        <div className='absolute -bottom-15 right-[32%] md:right-[45%]  border-2 rounded-full'>
          <img className='rounded-full' width={150} height={150} src={currentUser.profilepic || "/Picture.jpg"} />
        </div>
      </div>
      <div className="info flex flex-col justify-center items-center my-16 mb-32  gap-2">
        <div className='font-bold text-lg'>
          @{username}
        </div>
        <div className='text-slate-400'>
          Let's help {username} get a PS5 !
        </div>
        <div className='text-slate-400'>
          {payments.length} payments . {currentUser.name} has raised ₹{payments.reduce((total, p) => total + p.amount, 0)}
        </div>

        <div className="payment flex gap-3 w-[80%] mt-11 flex-col md:flex-row">
          <div className="Supporters w-full md:w-1/2 bg-slate-900 rounded-lg p-5 text-white">
            {/* Show the list of all the supporters as a leaderboard */}
            <h2 className='text-2xl font-bold my-5'>Supporters</h2>
            {payments.length === 0 && <div className='text-center text-slate-400'>No supporters yet. Be the first one to support!</div>}
            <ul className='mx-5 text-lg'>
              {payments.map((p, i) => {
                return <li key={i} className='my-4 flex gap-2 items-center'>
                  <img src="avatar.gif" alt="use avatar" />
                  <span>{p.name} donated<span className='font-bold'> ₹{p.amount} </span> with a message "{p.message}"</span></li>
              })}
            </ul>
          </div>

          <div className="MakePayment w-full md:w-1/2 bg-slate-900 rounded-lg p-5 text-white">
            <h2 className='text-2xl font-bold my-5'>Make a Payment</h2>

            <div className="flex gap-2 flex-col">
              <input onChange={handleChange} value={paymentform.name} type="text" name='name' className='w-full p-3 rounded-lg bg-slate-800' placeholder='Enter Name' />

              <input onChange={handleChange} value={paymentform.message} type="text" name='message' className='w-full p-3 rounded-lg bg-slate-800' placeholder='Enter Message' />

              <input onChange={handleChange} value={paymentform.amount} type="text" name="amount" className='w-full p-3 rounded-lg bg-slate-800' placeholder='Enter Amount' />

              <button onClick={() => pay(Number.parseInt(paymentform.amount) * 100)} type="button" className="text-white bg-linear-to-br from-black to-blue-500 hover:bg-linear-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-4 py-2.5 text-center leading-5 disabled:from-slate-500 " disabled={paymentform.name?.length < 3 || paymentform.message?.length < 4 || paymentform.amount?.length<1}>Pay</button>

            </div>
            {/* or choose from these amounts */}
            <div className='flex flex-col md:flex-row gap-2 mt-5'>
              <button className='p-3 rounded-lg bg-slate-800 cursor-pointer' onClick={() => pay(2000)}>Pay ₹20</button>
              <button className='p-3 rounded-lg bg-slate-800' onClick={() => pay(3000)}>Pay ₹30</button>
              <button className='p-3 rounded-lg bg-slate-800' onClick={() => pay(4000)}>Pay ₹40</button>
            </div>
          </div>
        </div>
      </div>


    </>
  )
}

export default PaymentPage


