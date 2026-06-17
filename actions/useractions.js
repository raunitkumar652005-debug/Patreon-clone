"use server"
import Razorpay from "razorpay"
import Payment from "@/models/Payment"
import connectDb from "@/db/connectDb"
import User from "@/models/User"

export const initiate = async (amount, to_username, paymentform) => {
  await connectDb()

  // Fetch the secret of the user from the database who is receiving the payment 
  let user = await User.findOne({ username: to_username })
  const secret = user.razorpaysecret

  var instance = new Razorpay({
    key_id: user.razorpayid,
    key_secret: secret,
  });
  
  let options = {
    amount: Number.parseInt(amount),
    currency: "INR",
  }
  let x = await instance.orders.create(options)
  // Create a payment object which shows the pending payment in the datbase
  await Payment.create({ oid: x.id, amount: amount / 100, to_user: to_username, name: paymentform.name, message: paymentform.message, })
  return x
}

export const fetchuser = async (username) => {
  await connectDb()

  let user = await User.findOne({ username }).lean()

  if (!user) return null

  return {
    ...user,
    _id: user._id.toString()
  }
}
// export const fetchuser = async (username) => {
//     await connectDb()
//     let u = await User.findOne({username: username})
//     // if(!u){
//     //     throw new error("User not found")
//     // }
//     // let user = u.toObject({flattenIds:true})
//     // return user
// }
export const fetchpayments = async (username) => {
  await connectDb()
  // Find all the payments in decreasing order of amount and flatten object ids
  let p = await Payment.find({ to_user: username, done: true }).sort({ amount: -1 }).limit(10).lean()
  return p
}

// export const updateProfile = async (data, oldusername) => {
//     await connectDb()
//     let ndata = Object.fromEntries(data.entries())
//     // If the username is being updated, check if the username is available
//     if (oldusername !== ndata.username) {
//     let u = await User.findOne({username: ndata.username})
//     if (u) {
//         return {error: "Username already exists"}
//     }
//     // await User.updateOne({email: ndata.email}, ndata)
//     await User.updateOne({ username: oldusername },{ $set: ndata })
//     return { success : true }
// }}
export const updateProfile = async (data, oldusername) => {
  await connectDb();

  await User.updateOne(
    { username: oldusername },
    { $set: data }
  );

  return { success: true };
};