const Subscriber = require('../models/subscriberModel');

const subscribe = async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    const existing = await Subscriber.findOne({ email });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed to ShopSphere updates.'
      });
    }

    await Subscriber.create({ email });

    return res.status(201).json({
      success: true,
      message: 'You are now subscribed to ShopSphere updates.'
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to subscribe right now'
    });
  }
};

module.exports = {
  subscribe
};
