import { NextResponse } from "next/server";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import Payment from "@/models/Payment";
import connectDb from "@/db/connectDb";

export const POST = async (req) => {
    await connectDb();
    let body = await req.formData()
    body = Object.fromEntries(body)
    const secret = process.env.RAZORPAY_KEY_SECRET

    if (!secret) {
        return NextResponse.json({ success: false, message: "Razorpay secret is not configured" }, { status: 500 })
    }

    // Check if razorPayOrderId is present on the server

    let p = await Payment.findOne({ oid: body.razorpay_order_id })
    if (!p) {
        return NextResponse.json({ success: false, message: "Order id not found" })
    } 

    // Verify the Payment
    let xx = validatePaymentVerification(
        {
            "order_id": body.razorpay_order_id,
            "payment_id": body.razorpay_payment_id
        },

        body.razorpay_signature,
        secret

    );
    if (xx) {
        // Update the payment status in the database
        const updatedPayment = await Payment.findOneAndUpdate(
            { oid: body.razorpay_order_id },
            {
                done: true,

            },
            { new: true })

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/${updatedPayment.to_user}?paymentdone=true`)
    }

    else {
        return NextResponse.json({ sucess: false, message: "Payment verification failed" })
    }

}
