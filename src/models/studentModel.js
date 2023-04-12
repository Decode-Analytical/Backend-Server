const mongoose = require('mongoose')

const studentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: 'users',
    },
    orderCourses: [
      {
        title: { type: String, require: true },
        description: { type: Number, require: true },
        image: { type: String, require: true },
        category: { type: Number, require: true },
        language: { type: Number, require: true },
        price: { type: Number, require: true },
        courses: {
          type: mongoose.Schema.Types.ObjectId,
          require: true,
          ref: 'Course',
        },
      },
    ],
    paymentMethod: {
      type: String,
      require: true,
      default: 'paystack',
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    points: {
      type: Number,
      default: 0
    },
    
    price: {
      type: Number,
      require: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      require: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model('Student', studentSchema);

export default Student;