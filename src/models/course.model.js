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
  reviews: {
    type: Array,
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
  },
  modules: {
    type: Array,    
  },
  subjects: {
    type: Array,
  },
  totalRegisteredByStudent: {
    type: Number,
    default: 0,
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
 
  module_duration: {
    type: String,
  },
  questions: {
    type: Array,    
  },
  comments: {
    type: Array,    
  },
  likeAndDislikeUsers: {
    type: Array,    
  },
  comment_count: { type: Number, default: 0 },
 comments:[
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
  options: {
    type: Array,    
  },
  answers: {
    type: Array,    
  },
  correct_answer: {
    type: String,
    required: true ['write the correct answer'],
  },
  correct_answer_index: {
    type: Number,
    required: true ['write the correct answer index'],
  },
},
{
  timestamps: true,
  versionKey: false
});
questionSchema.index({ title: 'text', description: 'text' });

const answerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
  },
  answer: {
    type: String,
    required: true ['write the answer'],
  },
  correct_answer_index: {
    type: Number,
    required: true ['write the correct answer index'],
  },
},
{
  timestamps: true,
  versionKey: false
});
answerSchema.index({ title: 'text', description: 'text' });

const quizSchema = new mongoose.Schema(
  {
    title: String,
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: [true, "quiz questions ids required"],
      },
    ],
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
  answers: [{ questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' }, selected_answer_index: Number }],
  score: Number,
});

courseSchema.add({ modules: [moduleSchema] });
moduleSchema.add({ questions: [questionSchema] });
questionSchema.add({ answers: [answerSchema] });


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
  Quiz
};