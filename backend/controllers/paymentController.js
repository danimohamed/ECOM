const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Payment = require('../models/Payment');

// @POST /api/payments/create-intent
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // cents
      currency: 'eur',
      metadata: { orderId: order._id.toString() },
    });

    await Payment.create({
      order: order._id,
      user: req.user._id,
      method: 'stripe',
      amount: order.totalPrice,
      stripePaymentIntentId: paymentIntent.id,
      status: 'pending',
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    next(error);
  }
};

// @POST /api/payments/webhook (Stripe webhook)
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    await Order.findByIdAndUpdate(orderId, {
      isPaid: true,
      paidAt: Date.now(),
      status: 'paid',
      paymentResult: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        email: paymentIntent.receipt_email,
      },
    });

    await Payment.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntent.id },
      { status: 'completed' }
    );
  }

  res.json({ received: true });
};

// @GET /api/payments (admin)
exports.getPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate('order', 'totalPrice status')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    next(error);
  }
};

// @POST /api/payments/cod
exports.codPayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await Payment.create({
      order: order._id,
      user: req.user._id,
      method: 'cod',
      amount: order.totalPrice,
      status: 'pending',
    });

    order.status = 'pending';
    await order.save();

    res.json({ message: 'COD order placed successfully' });
  } catch (error) {
    next(error);
  }
};
