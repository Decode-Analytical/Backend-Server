const User = require('../models/user.model');
const { Course } = require('../models/course.model');
const Student = require('../models/student.model');
// const Comment = require('../models/comment.model');
const Payment = require('../models/transaction.model');
const Meeting = require('../models/meeting.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const referralCodeGenerator = require('referral-code-generator');
const paystack = require('paystack')(process.env.PAYSTACK_MAIN_KEY);
const MeetingTransaction = require('../models/meetingTransact.model');
const crypto = require("crypto");






exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user.roles === "admin") {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    message: 'Incorrect username or password'
                });
            };
            const isActive = await User.findOne({ _id: user._id });
            if (isActive.isEmailActive === false) {
                return res.status(400).json({
                    message: 'Your account is pending. kindly check your email inbox and verify it'
                });
            };
            const token = jwt.sign({
                _id: user._id,
            }, process.env.JWT_SECRET, { expiresIn: '24h' });
            return res.status(200).json({
                message: 'User logged in successfully',
                token,
                user
            });
        } else {
            return res.status(400).json({
                message: 'You are not admin'
            });
        }
    } catch (error) {
        res.status(400).json({
            message: 'Error while logging in',
            error: error.message
        });
    }
};


exports.adminUpdateUserRoles = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === 'superadmin') {
            const { email } = req.body;
            const existingUser = await User.findOne({ email: email });
            const newRole = await User.findOneAndUpdate({ _id: existingUser._id }, {
                $set: {
                    roles: "admin"
                }
            });
            return res.status(200).json({
                message: 'User role updated successfully',
                newRole
            });
        } else {
            return res.status(200).json({
                message: 'You can not update this role since you are not a Supper admin'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'User role not updated'
        });
    }
}


// view transaction 
exports.adminViewTransactions = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === 'admin') {
            const transactions = await Payment.find({})
                .sort({ createdAt: -1 })
                .populate('student', 'name')
                .populate('course', 'title')
            return res.status(200).json({
                transactions
            });
        } else {
            return res.status(200).json({
                message: 'You are not authorized to view this page'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Transaction not found'
        });
    }
}


// view student 
exports.adminViewStudents = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === 'admin') {
            const students = await User.find({ roles: "student" })
                .sort({ createdAt: -1 })
            return res.status(200).json({
                students
            });
        } else {
            return res.status(200).json({
                message: 'You are not authorized to view this page'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Student not found',
            error: error.message
        });
    }
}


// view course 
exports.adminViewCourses = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === 'admin') {
            const courses = await Course.find({})
                .sort({ createdAt: -1 })
            return res.status(200).json({
                courses
            });
        } else {
            return res.status(200).json({
                message: 'You are not authorized to view this page'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Course not found'
        });
    }
}


// view comment 
exports.adminViewComments = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === 'admin') {
            const comments = await Comment.find({})
                .sort({ createdAt: -1 })
                .populate('student', 'name')
                .populate('course', 'title')
            return res.status(200).json({
                comments
            });
        } else {
            return res.status(200).json({
                message: 'You are not authorized to view this page'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Comment not found'
        });
    }
}

// total student registered 
exports.adminTotalStudent = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === 'admin') {
            const total = await User.countDocuments({});
            const totalStudent = await User.countDocuments({ roles: 'student' });
            const admin = await User.countDocuments({ roles: 'admin' });
            const it = await User.countDocuments({ roles: 'IT' });
            return res.status(200).json({
                TotalUser: total,
                TotalStudent: totalStudent,
                Admin: admin,
                IT: it
            });
        } else {
            return res.status(200).json({
                message: 'You are not authorized to view this page'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Total student not found',
            error: error.message
        });
    }
};





// total payment 
exports.adminTotalPayment = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === 'admin') {
            const totalPayment = await Payment.find({
                student: { $exists: true },
                course: { $exists: true },
                paymentMethod: { $exists: true }
            });
            return res.status(200).json({
                total: totalPayment.length,
                totalPayment
            });
        } else {
            return res.status(200).json({
                message: 'You are not authorized to view this page'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Total payment not found'
        });
    }
};


// view admin profile 
exports.adminViewProfile = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === 'admin') {
            const admin = await User.findById(req.params.userId);
            if (admin) {
                return res.status(200).json({
                    instructor: admin
                });
            } else {
                return res.status(404).json({
                    message: 'Your email is not registered on this platform as Instructor'
                })
            }
        } else {
            return res.status(401).json({
                message: 'You are not authorized to view this page'
            });
        }
    } catch (error) {
        return res.status(501).json({
            message: 'There is an error fetch instructor info',
            error: error.message
        });
    }
};



// view all the instructors/ admin 
exports.adminViewAllInstructors = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === 'admin') {
            const instructors = await User.find({ roles: "admin" })
                .sort({ createdAt: -1 })
            return res.status(200).json({
                instructors
            });
        } else {
            return res.status(200).json({
                message: 'You are not authorized to view this page'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Instructor not found'
        });
    }
};




// to know the total student registered for a course!!!
exports.adminTotalStudentForCourse = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === 'admin' || userStatus.roles === 'student' || userStatus.roles === 'IT') {
            const total = await Student.countDocuments({ Course });
            return res.status(200).json({
                totalCourseRegisteredByStudent: total,
            });
        } else {
            return res.status(200).json({
                message: 'You are not authorized to view this page'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Total student not found',
            error: error.message
        });
    }
};


//? admin schedule google meeting for students 
exports.adminScheduleMeeting = async (req, res) => {
    try {
        const { email, description, date, time, courseName, isPaid, amount } = req.body;
        const organizerN = await User.findOne({ email });
        const linkMeeting = referralCodeGenerator.custom('lowercase', 3, 3, 'lmsore');
        const course = await Course.findOne({ course_title: courseName });
        if (!course) {
            return res.status(404).json({
                message: "This course does not exist in the database"
            })
        }
        if (organizerN) {
            const meeting = await Meeting.create({
                instructor: organizerN.firstName + '' + organizerN.lastName,
                description,
                instructorId: organizerN._id,
                courseId: course._id,
                date,
                time,
                courseName: course.course_title,
                roomId: linkMeeting,
                email,
                isPaid,
                amount,
            });
            return res.status(201).json({
                message: 'Meeting created successfully',
                meeting
            });
        } else {
            return res.status(404).json({
                message: 'Your email registered on this platform'
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Meeting not created because the course name or your email is not registered',
            error: error.message
        });
    }
};


// ? get user information by email
exports.studentJoinMeeting = async (req, res) => {
    try {
        const { email, } = req.body;
        const admin = await User.findOne({ email });
        if (!admin) {
            return res.status(404).json({
                message: 'Your email is not registered on this platform as student'
            })
        }
        const roomId = req.params.roomId;
        const meeting = await Meeting.findOne({ roomId });
        if (!meeting) {
            return res.status(404).json({
                message: "This room meeting does not exist"
            })
        }
        const link = `https://decode-mnjh.onrender.com/api/admin/paymentInitialized/${roomId}`;
        if (meeting.isPaid === "paid") {
            const hasPaid = await MeetingTransaction.findOne({ meetingId: meeting._id, userId: admin._id });
            if (hasPaid === null) {
                return res.status(401).json({
                    message: `This meeting is paid. Please proceed to payment here: ${link}.`,
                });
            }

            if (hasPaid.transactionType === "refunded") {
                return res.status(401).json({
                    message: "Your payment is not successfully yet, kindly contact admin"
                })
            }
            const student = await Student.findOne({ userId: admin._id, title: meeting.courseName });
            const userStatus = await User.findById(admin._id);
            if (userStatus.roles === 'student' && student || userStatus.roles === 'IT' || userStatus.roles === "admin") {
                return res.status(200).json({
                    meeting,
                    name: admin.firstName + ' ' + admin.lastName,
                    userId: admin._id,
                    image: admin.picture
                });
            } else {
                return res.status(200).json({
                    message: 'You are not authorized to view this page'
                });
            }
        } else {
            const student = await Student.findOne({ userId: admin._id, title: meeting.courseName });
            const userStatus = await User.findById(admin._id);
            if (userStatus.roles === 'student' && student || userStatus.roles === 'IT' || userStatus.roles === "admin") {
                return res.status(200).json({
                    meeting,
                    name: admin.firstName + ' ' + admin.lastName,
                    userId: admin._id,
                    image: admin.picture
                });
            }
        }
    } catch (error) {
        return res.status(500).json({
            message: 'You are not a registered student',
            error: error.message
        });
    }
};


// view all the meeting events
exports.studentViewAllMeeting = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === 'student' || userStatus.roles === 'admin' || userStatus.roles === 'IT') {
            const meeting = await Meeting.find({
                instructor: { $exists: true },
                course: { $exists: true },
                date: { $exists: true },
                time: { $exists: true }
            });
            const total = await Meeting.countDocuments({
                instructor: { $exists: true },
                course: { $exists: true },
                date: { $exists: true },
                time: { $exists: true }
            });
            return res.status(200).json({
                total,
                meeting,
            });
        } else {
            return res.status(200).json({
                message: 'You are not authorized to view this page'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Meeting not found',
            error: error.message
        });
    }
};



// view total student enrolled for a particular course 
exports.studentTotalStudentForCourse = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === 'student' || userStatus.roles === 'admin' || userStatus.roles === 'IT') {
            const courseId = req.params.courseId;
            const total = await Student.countDocuments({ courseId });
            return res.status(200).json({
                totalStudentRegistered: total,
            });
        } else {
            return res.status(200).json({
                message: 'You are not authorized to view this page'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Total student not found',
            error: error.message
        });
    }
};



// Meeting Payment 

exports.studentPayForMeeting = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        const roomId = req.params.roomId;
        const meeting = await Meeting.findOne({ roomId });
        if (userStatus.roles === 'student' || userStatus.roles === 'admin' || userStatus.roles === 'IT') {
            // Payment logic
            const payments = await MeetingTransaction.create({
                reference: crypto.randomBytes(8).toString('hex'),
                amount: meeting.amount,
                userId: userStatus._id,
                meetingId: meeting._id,
                email: userStatus.email
            })
            const paystackPayment = paystack.transaction.initialize({
                amount: payments.amount * 100,
                email: payments.email,
                reference: payments.reference,
            },
                (error, response) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).json({ error: 'An error occurred while initializing payment.' });
                    } else {
                        return res.json(response.data.authorization_url);
                    }
                }
            )
        } else {
            return res.status(200).json({
                message: 'You are not authorized to pay for this meeting'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Payment failed",
            error: error.message
        });
    }
}


exports.studentPaid = async (req, res) => {
    try {
        const { event, data } = req.body;
        if (event === 'charge.success') {
            const { reference } = data;
            const transaction = await MeetingTransaction.findOne({ reference });
            if (!transaction) {
                return res.status(404).json({ message: 'Transaction not found' });
            }
            const existingCourse = await Meeting.findById(transaction.meetingId);
            // console.log({existingCourse})    
            if (existingCourse) {
                await MeetingTransaction.findOneAndUpdate(
                    {
                        _id: transaction._id
                    },
                    {
                        $set: { transactionType: "paid" }
                    },
                    {
                        new: true,
                    });
            }
            // send email notification to user
            const user = await User.findById(transaction.userId);
            await sendEmail({
                email: transaction.email,
                subject: `Payment Successful`,
                message: `            
  <head></head>

  <body style="background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif">
    <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%" style="max-width:37.5em;margin:0 auto;padding:20px 0 48px">
      <tr style="width:100%">
        <td><img alt="DECODE" src="/public/decodelogo.jpeg" width="170" height="50" style="display:block;outline:none;border:none;text-decoration:none;margin:0 auto" />        
          <p style="font-size:16px;line-height:26px;margin:16px 0">Hello, ${user.firstName} ${user.lastName}, <br>
                        You have successfully made the payment of the one time non-refundable ${transaction.amount} to be student for this online video tutor and course: ${existingCourse.courseName}. <br>                       
                        . <br><br><br>
                        Thanks for patronage.</p>
          <table style="text-align:center" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
            <tbody>
              <tr>
                <td><a href="#" target="_blank" style="background-color:#5F51E8;border-radius:3px;color:#fff;font-size:16px;text-decoration:none;text-align:center;display:inline-block;p-x:12px;p-y:12px;line-height:100%;max-width:100%;padding:12px 12px"><span><!--[if mso]><i style="letter-spacing: 12px;mso-font-width:-100%;mso-text-raise:18" hidden>&nbsp;</i><![endif]--></span><span style="background-color:#5F51E8;border-radius:3px;color:#fff;font-size:16px;text-decoration:none;text-align:center;display:inline-block;p-x:12px;p-y:12px;max-width:100%;line-height:120%;text-transform:none;mso-padding-alt:0px;mso-text-raise:9px">Reference: ${transaction.reference}.</span><span><!--[if mso]><i style="letter-spacing: 12px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a></td>
              </tr>
            </tbody>
          </table>
          <p style="font-size:16px;line-height:26px;margin:16px 0">Best,<br /><br/>The Decode team</p>
          <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#cccccc;margin:20px 0"/>
          <p style="font-size:12px;line-height:24px;margin:16px 0;color:#8898aa"> Ibadan, Nigeria </p>
        </td>
      </tr>
    </table>
  </body>
</html>`
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: 'An error occurred while initializing payment.',
            message: error.message
        });
    }
}



// tutor view his own his online meetings call created 
exports.tutorViewHisMeeting = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === 'admin') {
            const meeting = await Meeting.find({
                instructorId: userStatus._id
            });
            return res.status(200).json({
                message: 'Meetings fetched successfully',
                data: meeting
            });
        } else {
            return res.status(401).json({
                message: 'You are not authorized to view meetings'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Failed to get tutor's meetings",
            error: error.message
        });
    }
}


// superAdmin view all meetings/courses created by all tutors
exports.adminViewAllMeetings = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === 'admin') {
            const meetings = await Meeting.find({}).populate('instructorId');
            return res.status(200).json({
                message: 'All meetings fetched successfully',
                data: meetings
            });
        } else {
            return res.status(401).json({
                message: 'You are not authorized to view meetings'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Failed to get all meetings",
            error: error.message
        });
    }
}



// to blocked an Account of a tutor by toggle it from true to false or false to true 
exports.blockTutorAccount = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === 'superadmin') {
            const { tutorId } = req.params;
            const tutor = await User.findById(tutorId);
            if (tutor) {
                if (tutor.isBlocked === true) {
                    await User.findByIdAndUpdate(tutor._id, {
                        $set: { isBlocked: false }
                    });
                    return res.status(200).json({
                        message: 'Tutor unblocked successfully'
                    });
                } else {
                    await User.findByIdAndUpdate(tutor._id, {
                        $set: { isBlocked: true }
                    });
                    return res.status(200).json({
                        message: 'Tutor blocked successfully'
                    });
                }
            } else {
                return res.status(404).json({
                    message: 'Tutor not found'
                });
            }
        } else {
            return res.status(401).json({
                message: 'You are not authorized to block tutor'
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to block tutor",
            error: error.message
        });
    }
}


exports.totalRegisteredStudents = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === 'admin') {
            const course = await User.findById(userStatus._id);
            if (course) {
                const totalRegisteredStudents = await Student.find({ courseOwnerId: course._id });
                let totalStudents = 0;
                for (let i = 0; i < totalRegisteredStudents.length; i++) {
                    totalStudents += totalRegisteredStudents[i].price;                    
                }
                return res.status(200).json({
                    message: 'Total registered students fetched successfully',
                    data: totalStudents
                })
               
            } else {
                return res.status(404).json({
                    message: 'Course not found registered by you'
                });
            }
        } else {
            return res.status(401).json({
                message: 'You are not authorized to view registered students'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Failed to get total registered students",
            error: error.message
        })
    }
}