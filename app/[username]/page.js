import React from 'react'
import PaymentPage from '@/components/PaymentPage'
import { notFound } from "next/navigation"
import connectDb from '@/db/connectDb'
import User from '@/models/User'
// const Username = async ({ params }) => {

//   // If the username is not present in the database, show a 404 page
//   const checkUser = async () => {
//     await connectDb()
//     let u = await User.findOne({ username: params.username })
//     if (!u) {
//       return notFound()
//     }
//   }
//   await checkUser()



//   return (
//     <>
//       <PaymentPage username={params.username} />
//     </>
//   )
// }

// export default Username

// export async function generateMetadata() {
//   return {
//     title: "Support Raunit Kumar - Get me a PS5",
//   }
// }

const Username = async ({ params }) => {
  await connectDb()

  const creatorUsername =
    params.username === process.env.CREATOR_USERNAME
      ? params.username
      : process.env.CREATOR_USERNAME

  let u = await User.findOne({
    username: creatorUsername,
  })

  if (!u) {
    return notFound()
  }

  return (
    <>
      <PaymentPage username={creatorUsername} />
    </>
  )
}
export default Username

export async function generateMetadata({ params }) {
  return {
    title: `Support ${process.env.CREATOR_USERNAME} - Get me a PS5`,
  }
}








