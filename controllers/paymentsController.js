// import Razorpay from 'razorpay';
// import crypto from 'crypto';

// let razorpayInstance = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID, // Use environment variables to keep keys secure
//     key_secret: process.env.RAZORPAY_KEY_SECRET,
//   });


// export const createOrderController = async (req, res) => {
//     const { amount } = req.body;
//     try {
//         const options = {
//         amount: amount * 100, // Razorpay expects the amount in the smallest currency unit (paise for INR)
//         currency: "INR",
//         };

//         const order = await razorpayInstance.orders.create(options);
//         res.json(order);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// }
// export const verifyPaymentController = async (req, res) => {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
//     const secret = 'YOUR_KEY_SECRET';
//     const generatedSignature = crypto.createHmac('sha256', secret)
//         .update(razorpay_order_id + "|" + razorpay_payment_id)
//         .digest('hex');

//     if (generatedSignature === razorpay_signature) {
//         res.json({ success: true, message: 'Payment verification successful' });
//     } else {
//         res.status(400).json({ success: false, message: 'Payment verification failed' });
//     }
// }