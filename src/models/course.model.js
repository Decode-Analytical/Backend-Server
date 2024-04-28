const { required } = require("joi");
const mongoose = require("mongoose"); 

const courseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  course_title: {
    type: String,
    index: true,
    required: true ['write the title of course'],
  },
  course_description: {
    type: String,
  },
  course_language: {
    type: String,
  },
  visitCount: {
    type: Number,
    default: 0
  },
  reviews: {
    type: Array,
  },
  skill_level: {
    type: String,
  },
  course_image:{
    type: Array
  },
  isPaid_course: {
    type: String,
    enum: ['paid', 'free'],
    required: true ['choose one of these, is it Free or Paid?'],
  },
  isPrice_course:{
    type: Number,
    float: true,
  },
  modules: {
    type: Array,    
  },
  totalRegisteredByStudent: {
    type: Number,
    default: 0,
  },
  isUploadedCompleted: {
    type: Boolean,
    default: false,
  }
},
{
  timestamps: true,
  versionKey: false
});

courseSchema.index({ title: 'text', description: 'text' });

const moduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },

  module_title: {
    type: String,
    index: true,
    required: true ['write the title of module or subject'],
  },
  module_description: {
    type: String,
  },
  video: {
    type: Array,
  },
  image: {
    type: Array,
  },
  audio: {
    type: Array,
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  module_duration: {
    type: String,
    default: '4mins'
  },
  quizzes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: [true, "quiz ids required"],
      },    
    ],
  comments: {
    type: Array,    
  }, 
  likeAndDislikeUsers: {
    type: Array,    
  },
  comment_count: { type: Number, default: 0 },
 commentId:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: false, 
    },
  ],
  likeAndDislikeUsers:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, 
    },
  ],
  comment_count: { type: Number, default: 0 },
  like_count: { type: Number, default: 0 },
  dislike_count: { type: Number, default: 0 },

},
{
  timestamps: true,
  versionKey: false
});
moduleSchema.index({ title: 'text', description: 'text' });



const answerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
  },
  question_description: {
    type: String,
  },
  selected_answer_index: {
    type: Number,
  },
  correct_answer_index: {
    type: Number,
  },
  answers: [
    {
      type: String,
    },
  ],
  correctAnswerIndexes: {
    type: Number
  }
},
{
  timestamps: true,
  versionKey: false
});
answerSchema.index({ title: 'text', description: 'text' });

const questionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module",
  },
  question_title: {
    type: String,
    index: true,
    required: true ['write the title of question'],
  },
  question_description: {
    type: String,
  },
  question_duration: {
    type: String,
  }, 
  answers: [
    {
      type: String,
    },
  ],
  correct_answer: {
    type: String,
  },
  correctAnswerIndexes: {
    type: Number
  }

},
{
  timestamps: true,
  versionKey: false
});
questionSchema.index({ title: 'text', description: 'text' });



const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    questionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: [true, "quiz questions ids required"],
      },
      questionSchema,
    ],
    questions: {
      type: Array,
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: [true, "module id required"],
    },
  },
  {
    timestamps: true,
  }
);

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  answers: [
    {
      type: String,
    },
  ],
  score: Number,
});


const Course = mongoose.model("Course", courseSchema);
const Module = mongoose.model("Module", moduleSchema);
const Question = mongoose.model("Question", questionSchema);
const Answer = mongoose.model("Answer", answerSchema);
const Submission = mongoose.model("Submission", submissionSchema);
const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = {
  Course,
  Module,
  Question,
  Answer,
  Submission,
  Quiz,
};