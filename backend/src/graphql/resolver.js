import Razorpay from "razorpay";
import User from "../models/User.js";

const plans = [
  { id: "basic", name: "Basic", price: 19900, currency: "INR", interval: "month" },
  { id: "pro", name: "Pro", price: 39900, currency: "INR", interval: "month" }
];

const razor = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const resolvers = {
  Query: {
    ping: () => "pong",
    plans: () => plans,
    mySubscription: async (_p,_a,{req}) => {
      const u = await User.findById(req.userId || null).lean();
      if (!u) return { status: "inactive" };
      const s = u.subscription || {};
      return { status: s.status || "inactive", currentPeriodEnd: s.currentPeriodEnd, planId: s.planId };
    }
  },
  Mutation: {
    createOrder: async (_p,{ planId },{ req }) => {
      if (!req.userId) throw new Error("Unauthorized");
      const plan = plans.find(p => p.id === planId);
      if (!plan) throw new Error("Invalid plan");
      const order = await razor.orders.create({ amount: plan.price, currency: plan.currency, receipt: `sub_${req.userId}_${Date.now()}` });
      return { id: `local_${order.id}`, amount: order.amount, currency: order.currency, providerOrderId: order.id };
    },
    verifyPayment: async (_p,{ providerOrderId, paymentId, signature },{ req }) => {
      if (!req.userId) throw new Error("Unauthorized");
      // TODO: verify HMAC signature properly using Razorpay secret
      await User.updateOne(
        { _id: req.userId },
        { $set: { "subscription.status": "active", "subscription.planId": "pro", "subscription.currentPeriodEnd": new Date(Date.now()+30*24*60*60*1000) } }
      );
      return true;
    },
    cancelSubscription: async (_p,_a,{ req }) => {
      if (!req.userId) throw new Error("Unauthorized");
      await User.updateOne({ _id: req.userId }, { $set: { "subscription.status": "inactive" }});
      return true;
    }
  }
};
