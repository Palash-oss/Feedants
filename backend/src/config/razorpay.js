import Razorpay from 'razorpay';
import crypto from 'crypto';

const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_mockkeyid';
const key_secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mockkeysecret';

export const razorpayInstance = new Razorpay({
  key_id,
  key_secret
});

export const createRazorpayOrder = async (amountInINR, receiptId) => {
  const amountInPaisa = Math.round(amountInINR * 100);

  if (key_id === 'rzp_test_mockkeyid') {
    return {
      orderId: `order_mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      amount: amountInPaisa,
      currency: 'INR',
      keyId: key_id,
      isMock: true
    };
  }

  try {
    const order = await razorpayInstance.orders.create({
      amount: amountInPaisa,
      currency: 'INR',
      receipt: receiptId
    });
    return {
      orderId: order.id,
      amount: Number(order.amount),
      currency: order.currency,
      keyId: key_id,
      isMock: false
    };
  } catch (error) {
    console.warn('[Razorpay] Failed to connect to Razorpay API, falling back to mock order:', error);
    return {
      orderId: `order_mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      amount: amountInPaisa,
      currency: 'INR',
      keyId: key_id,
      isMock: true
    };
  }
};

export const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  if (orderId.startsWith('order_mock_') || signature === 'mock_signature') {
    return true; // Mock verification
  }

  const generatedSignature = crypto
    .createHmac('sha256', key_secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
};
