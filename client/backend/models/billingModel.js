const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Billing must belong to a User!']
  },
  billing_cycle_information: [
    {
      registration: {
        type: mongoose.Schema.ObjectId,
        ref: 'Registration',
        required: [true, 'Billing must belong to Registration!']
      },
      student: {
        type: mongoose.Schema.ObjectId,
        ref: 'Registration',
        required: [true, 'Billing must belong to a User!']
      },
      sessions_information: [{
        session: [
        {
          type: mongoose.Schema.ObjectId,
          ref: 'sessions',
          required: [
            true,
            'Billing cycle information must belong to a session!'
          ]
        },
      ]
    }],
      discount_information: [
        {
          discount_amount: Number,
          discount_percent: Number,
          discount_reason: String
        }
      ],
      creditting_information: [
        {
          credit_amount: Number,
          credit_percent: Number,
          credit_reason: String,
          attributed_session_credit: {
            type: mongoose.Schema.ObjectId,
            ref: 'sessions'
          }
        }
      ],
      billing_cycle_total: Number
    }
  ],
  billing_cycle_net_total: {
    type: Number,
    require: [true, 'Billing cycle must have a net total.']
  },
  billing_cycle_tax_total: {
    type: Number,
    require: [true, 'Billing cycle must have a tax total.']
  },
  billing_cycle_gross_total: {
    type: Number,
    require: [true, 'Billing cycle must have a gross total.']
  },
  billing_cycle_discount_total: {
    type: Number
  },
  billing_cycle_processing_date: Date,
  billing_cycle_completiong_date: Date,
  billing_cycle_reversal_date: Date,
  billing_status: {
    enum: ['paid', 'pending', 'processing', 'cancelled', 'reversed', 'suspended']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  editedAt: [
    {
      type: Date,
      default: Date.now()
    }
  ]
});

billingSchema.pre(/^find/, function(next) {
  this.populate('user').populate({
    path: 'studio',
    select: 'courseName'
  });
  next();
});

const Billing = mongoose.model('Billing', billingSchema);

module.exports = Billing;
