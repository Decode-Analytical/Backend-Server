const User = require('../models/user.model');
const { Course } = require('../models/course.model');
const Student = require('../models/student.model');
// const Comment = require('../models/comment.model');
const sendEmail = require('../emails/email');
const Payment = require('../models/transaction.model');
const Meeting = require('../models/meeting.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const referralCodeGenerator = require('referral-code-generator');
const {Paystack} = require( 'paystack-sdk');
const paystack_live = new Paystack(process.env.DECODE_LIVE_CLASS );
const MeetingTransaction = require('../models/meetingTransact.model');
const WalletTransaction = require('../models/walletTransaction.model')
const crypto = require("crypto");
const PDFDocument  = require('pdfkit');
const fs = require('fs');
const Token = require("../models/token.model");
const otpGenerator = require('otp-generator')


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
        if (userStatus.roles === 'superadmin') {
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
        if (userStatus.roles === 'admin' || userStatus.roles === "superadmin") {
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
        if (userStatus.roles === 'superadmin') {
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
        if (userStatus.roles === 'admin' || userStatus.roles === 'superadmin' ) {
            const total = await Student.countDocuments({});
            return res.status(200).json({
                totalRegisteredStudent: total,
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
        const userId = req.user;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.roles.includes('admin') && !user.roles.includes('superadmin')) {
            return res.status(401).json({ message: 'You are not authorized to schedule a meeting' });
        }

        const { description, startDate, startTime, duration, endDate, endTime, courseName, isPaid, amount } = req.body;

        // const start = new Date(`${startDate}`).toLocaleDateString();
        const end = new Date(`${endDate}`).toLocaleDateString();

        const existingCourseMeeting = await Meeting.findOne({ courseName, userId: user._id });
        if (existingCourseMeeting) {
            return res.status(400).json({ message: 'You have already scheduled meeting for this course' });
        }

        const course = await Course.findOne({ course_title: courseName });
        const linkMeeting = referralCodeGenerator.custom('lowercase', 6, 4, 'decodelms');

        const meeting = await Meeting.create({
            instructor: `${user.firstName} ${user.lastName}`,
            description,
            instructorId: user._id,
            userId: user._id,
            courseId: course ? course._id : 'No course registered',
            courseName: course ? course.course_title : courseName,
            startDate,
            startTime,
            duration,
            endDate: end,
            roomId: linkMeeting,
            email: user.email,
            isPaid,
            amount,
            course_image: course ? course.course_image : null,
        });
        return res.status(201).json({
            message: `Meeting created ${course ? 'with a registered course' : 'without a registered course'} successfully`,
            meeting
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Meeting not created due to an error',
            error: error.message
        });
    }
};

exports.deleteMeeting = async (req, res) => {
    try {
        const meetingId = req.params.meetingId;
        const meeting = await Meeting.findOne({ roomId: meetingId });
        if (meeting) {
            await Meeting.findByIdAndDelete(meeting._id);
            return res.status(200).json({
            message: 'Meeting deleted successfully'
        });
    }else {
        return res.status(404).json({
            message: 'Meeting not found'
        });
    }
    } catch (error) {
        return res.status(500).json({
            message: 'Meeting not deleted due to an error',
            error: error.message
        });
    }
}

exports.otpForMeeting = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Your email is not registered on this platform.' });
        }
        const otp = await Token.create({
            userId: user._id,
            token: otpGenerator.generate(6, { upperCase: false, specialChars: false }),
            type: 'otp',
            expires: Date.now() + 300000,
        });
        const link = `https://decode-mnjh.onrender.com/api/admin/verifyMeeting/${otp.token}`;
        await sendEmail({
            email: email,
            subject: 'Meeting OTP',
            message: `
                <h3>Hi, ${user.firstName} ${user.lastName}</h3>
                <p>Please use the following OTP to join the meeting</p>
                <h2>OTP Code: ${otp.token}</h2>
                <p>Or click on the link below to join the meeting</p>
                <a href="${link}">Link</a>
                <p>This OTP will expire in 5 minutes</p>
                <p>If you did not request this email, please ignore it</p>
                <p>Regards</p>
                <p>Decode LMS</p>
                `,
        })
    return res.status(200).json({
            message: 'OTP sent successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'OTP not sent due to an error',
            error: error.message
        });
    }
}

exports.verifyOtpMeeting = async (req, res) => {
    try {
        const { token } = req.params;
        const otp = await Token.findOne({ token, type: 'otp' });
        if (!otp) {
            return res.status(404).json({ message: 'Invalid OTP' });
        }
        if (otp.expires < Date.now()) {
            return res.status(400).json({ message: 'OTP has expired' });
        }
        await Token.findByIdAndDelete(otp._id);
        const user = await User.findById(otp.userId);
        return res.status(200).json({
            message: 'OTP verified successfully',
        });
    }catch (error) {
        return res.status(500).json({
            message: 'Meeting not joined due to an error',
            error: error.message
        });
    }
}

// ? get user information by email
exports.studentJoinMeeting = async (req, res) => {
    try {
        const { token, email } = req.body;
        const otp = await Token.findOne({ token, type: 'otp' });
        if (!otp) {
            return res.status(404).json({ message: 'Invalid OTP' });
        }
        if (otp.expires < Date.now()) {
            return res.status(400).json({ message: 'OTP has expired' });
        }
        await Token.findByIdAndDelete(otp._id);

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Your email is not registered on this platform.' });
        }
        
        const roomId = req.params.roomId;
        const meeting = await Meeting.findOne({ roomId });

        if (!meeting) {
            return res.status(404).json({ message: 'This room meeting does not exist.' });
        }

        const link = `https://decode-mnjh.onrender.com/api/admin/paymentInitialized/${roomId}`;

        if (meeting.isPaid === "paid") {
            const hasPaid = await MeetingTransaction.findOne({ meetingId: meeting._id, userId: user._id });

            if (!hasPaid) {
                return res.status(401).json({ message: `This meeting is paid. Please proceed to make payment here: ${link}.` });
            }

            if (hasPaid.transactionType === "refunded") {
                return res.status(401).json({ message: "Your payment was not successful, kindly contact admin." });
            }
        }

        const student = await Student.findOne({ userId: user._id, title: meeting.courseName });
        const userStatus = await User.findById(user._id);

        if (userStatus.roles === 'student' && student || userStatus.roles === 'IT' || userStatus.roles === "admin") {
            return res.status(200).json({
                meeting,
                name: `${user.firstName} ${user.lastName}`,
                userId: user._id,
                image: user.picture
            });
        } else {
            return res.status(401).json({ message: 'You are not authorized to view this page.' });
        }

    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};



// view all the meeting events
exports.studentViewAllMeeting = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === 'student' || userStatus.roles === 'admin' || userStatus.roles === 'IT') {
            const meeting = await Meeting.find({ });
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
            const paymentExist = await MeetingTransaction.findOne({ meetingId: meeting._id, userId: userStatus._id });
            if(paymentExist){
                return res.status(401).json({
                    message: "You have already paid for this meeting"
                })
            }
            const payments = await MeetingTransaction.create({
                reference: crypto.randomBytes(8).toString('hex'),
                amount: meeting.amount,
                userId: userStatus._id,
                meetingId: meeting._id,
                email: userStatus.email,
                tutorId: meeting.userId,
            })
            const paystackPayment = paystack_live.transaction.initialize({
                amount: payments.amount * 100,
                email: payments.email,
                reference: payments.reference,                
                first_name: userStatus.firstName,
                last_name: userStatus.lastName,
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
                // update User's earnings and wallet 
                const user = await User.findOneAndUpdate({ _id: existingCourse.userId }, {
                    $inc: {
                        earnings: +transaction.amount * 80/100,
                        wallet: +transaction.amount * 80/100
                    }
                },
                {
                    new: true
                })

                const totalCredited = await User.findOneAndUpdate({ roles: "superadmin" }, {
                    $inc: {
                        wallet : + transaction.amount * 20/100,
                        earnings: +transaction.amount * 20/100
                }
                },
                {
                    new: true
                })
            }
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
    return res.status(200).json({
        message: 'Payment Successful',
                data: transaction
        });
    }
    } catch (error) {
        return res.status(500).json({
            error: 'An error occurred while Receiving payment.',
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
        if (userStatus.roles === 'superadmin') {
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
               let totalStudents = totalRegisteredStudents.map(student => student.price);
               let total = 0;
               for (let i = 0; i < totalStudents.length; i++) {
                total += totalStudents[i];
               }            
                return res.status(200).json({
                    message: 'Your Total sales fetched successfully',
                    sales: totalStudents,
                    totalSales: total
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


exports.totalSales = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === 'superadmin') {
            const course = await User.findById(userStatus._id);
            if (course) {
                const totalRegisteredStudents = await Student.find({ });
               let totalStudents = totalRegisteredStudents.map(student => student.price);
               let total = 0;
               for (let i = 0; i < totalStudents.length; i++) {
                total += totalStudents[i];
               }
                return res.status(200).json({
                    message: 'Total sales fetched successfully',
                    sales: totalStudents,
                    totalSales: total
                })

            } else {
                return res.status(404).json({
                    message: 'Course not found registered by you'
                });
            }
        }else{
            return res.status(401).json({
                message: 'You are not authorized to view total sales'
            });
        }
    }catch (error) {
            return res.status(500).json({
                message: "Failed to get total sales",
                error: error.message
            })
        }
    }



exports.totalSalesForLiveSession = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === 'admin') {
            const course = await User.findById(userStatus._id);
            if (course) {
                const totalRegisteredStudents = await MeetingTransaction.find({ tutorId: course._id });
               let totalStudents = totalRegisteredStudents.map(student => student.amount);
               let total = 0;
               for (let i = 0; i < totalStudents.length; i++) {
                total += totalStudents[i];
               }
                return res.status(200).json({
                    message: 'Total sales fetched successfully',
                    sales: totalStudents,
                    totalSales: total
                })

            } else {
                return res.status(404).json({
                    message: 'Course not found registered by you'
                });
            }
        }else{
            return res.status(401).json({
                message: 'You are not authorized to view total sales'
            });
        }
    }catch (error) {
            return res.status(500).json({
                message: "Failed to get total sales",
                error: error.message
            })
        }
    }



exports.adminTotalSalesForLiveSession = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === 'superadmin') {
            const course = await User.findById(userStatus._id);
            if (course) {
                const totalRegisteredStudents = await MeetingTransaction.find({  });
               let totalStudents = totalRegisteredStudents.map(student => student.amount);
               let total = 0;
               for (let i = 0; i < totalStudents.length; i++) {
                total += totalStudents[i];
               }
                return res.status(200).json({
                    message: 'Total sales fetched successfully',
                    sales: totalStudents,
                    totalSales: total
                })

            } else {
                return res.status(404).json({
                    message: 'Course not found registered by you'
                });
            }
        }else{
            return res.status(401).json({
                message: 'You are not authorized to view total sales'
            });
        }
    }catch (error) {
            return res.status(500).json({
                message: "Failed to get total sales",
                error: error.message
            })
        }
    }

// total students registered for admin all courses  

exports.adminViewTotalStudentRegistered= async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === 'admin') {
            const total = await Student.countDocuments({ userId: userStatus._id});
            return res.status(200).json({
                totalStudents: total,
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


exports.adminDailyCourseVisitCount = async (req, res) => {
    try {
    const id = req.user;
    const user = await User.findById(id);
    const userStatus = await User.findById(user._id);
    if (userStatus.roles === 'admin') {
      const today = new Date();
      const lastWeek = new Date(today.getTime() - (7*24*60*60*1000));
      const total = await Course.aggregate([
        {
          $match: {
            createdAt: {
              $gte: lastWeek
            },
            userId: userStatus._id
          }
        },
        {
          $group: {
            _id: null,
            count: { $sum: "$visitCount" }
          }
        }
      ]);
      return res.status(200).json({
        visitCount: total[0] ? total[0].count : 0
      });
    } else {
      return res.status(200).json({
        message: 'You are not authorized to view this page'
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Daily visit count not found',
      error: error.message
    });
  }
};


// sales analytics of the course by month by the admin 
exports.adminMonthlyCourseSalesAnalytics = async (req, res) => {
    try {
    const id = req.user;
    const user = await User.findById(id);
    const userStatus = await User.findById(user._id);

    if (userStatus.roles === 'admin') {

      const months = [
        "January", "February", "March",
        "April", "May", "June",
        "July", "August", "September",
        "October", "November", "December"
      ];

      const salesAnalytics = await Payment.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().setMonth(new Date().getMonth()-11))
            },
            tutorId: userStatus._id
          }
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            total: { $sum: "$amount" }
          }
        }
      ]);

      return res.status(200).json({
        salesAnalytics: salesAnalytics.map(item => ({
          month: months[item._id - 1],
          totalSales: item.total
        }))
      });

    } else {
      return res.status(401).json({
        message: "You are not authorized to view sales analytics",
        });
    }
}catch (error) {
    return res.status(500).json({
    message: 'Monthly sales analytics not found',
    error: error.message
  });
}
}


// sales analytics of the course by weeks by the admin 
exports.adminWeeklyCourseSalesAnalytics = async (req, res) => {
  try {
  const id = req.user;
  const user = await User.findById(id);
  const userStatus = await User.findById(user._id);

  if (userStatus.roles === 'admin') {

    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

    const salesAnalytics = await Payment.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate()-28))
          },
          tutorId: userStatus._id
        }
      },
      {
        $group: {
          _id: { $week: "$createdAt" },
          total: { $sum: "$amount" }
        }
      }
    ]);

    return res.status(200).json({
      salesAnalytics: salesAnalytics.map(item => ({
        week: weeks[item._id - 1],
        totalSales: item.total
      }))
    });

  } else {
    return res.status(401).json({
      message: "You are not authorized to view sales analytics"
    });
  }
}catch (error) {
  return res.status(500).json({
    message: 'Weekly sales analytics not found',
    error: error.message
  });
}
}


// sales analytics of the course by weeks and month by the admin 
exports.adminMonthlyAndWeeklyCourseSalesAnalytics = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);

        if (userStatus.roles === 'admin' || userStatus.roles === 'superadmin') {
            const months = [
                "January", "February", "March",
                "April", "May", "June",
                "July", "August", "September",
                "October", "November", "December"
            ];

            const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

            const salesAnalytics = await Payment.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(new Date().setMonth(new Date().getMonth() - 11))
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            month: { $month: "$createdAt" },
                            week: { $week: "$createdAt" }
                        },
                        total: { $sum: "$amount" }
                    }
                }
            ]);

            const monthlySales = [];
            const weeklySales = [];

            salesAnalytics.forEach(item => {
                monthlySales.push({
                    month: months[item._id.month - 1],
                    totalSales: item.total
                });

                weeklySales.push({
                    week: weeks[item._id.week - 1],
                    totalSales: item.total
                });
            });

            return res.status(200).json({
                monthlySales,
                weeklySales
            });
        } else {
            return res.status(401).json({
                message: "You are not authorized to view sales analytics"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Monthly and weekly sales analytics not found',
            error: error.message
        });
    }
}



      // sales analytics of the course by date range by the admin 
      exports.adminDateRangeCourseSalesAnalytics = async (req, res) => {
        try {
          const id = req.user;
          const user = await User.findById(id);
          const userStatus = await User.findById(user._id);

          if (userStatus.roles === 'admin' || userStatus.roles === "superadmin") {

            const startDate = req.body.startDate;
            const endDate = req.body.endDate;
            const formattedStartDate = new Date(startDate).toLocaleDateString('en-GB');
            const formattedStartDate1 = new Date(endDate).toLocaleDateString('en-GB');


            const salesAnalytics = await MeetingTransaction.aggregate([
              {
                $match: {
                  createdAt: { 
                    $gte: formattedStartDate,
                    $lte: formattedStartDate1
                  },
                //   tutorId: userStatus._id
                }
              },
              {
                $group: {
                  _id: null,
                  total: { $sum: "$amount" }
                }
              }
            ]);

            return res.status(200).json({
              totalSales: salesAnalytics[0] ? salesAnalytics[0].total : 0
            });

          } else {
            return res.status(401).json({
              message: "You are not authorized to view sales analytics"
            });
          }
        }catch(error){
          return res.status(500).json({
            message: 'Date range sales analytics not found',
            error: error.message
          });
        }
      }



exports.adminMonthlyLiveSessionSalesAnalytics = async (req, res) => {
    try {
    const id = req.user;
    const user = await User.findById(id);
    const userStatus = await User.findById(user._id);

    if (userStatus.roles === 'admin') {

      const months = [
        "January", "February", "March",
        "April", "May", "June",
        "July", "August", "September",
        "October", "November", "December"
      ];

      const salesAnalytics = await MeetingTransaction.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().setMonth(new Date().getMonth()-11))
            },
            tutorId: userStatus._id
          }
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            total: { $sum: "$amount" }
          }
        }
      ]);

      return res.status(200).json({
        liveSessionSalesAnalytics: salesAnalytics.map(item => ({
          month: months[item._id - 1],
          totalLiveSessionSales: item.total
        }))
      });

    } else {
      return res.status(401).json({
        message: "You are not authorized to view sales analytics",
        });
    }
}catch (error) {
    return res.status(500).json({
    message: 'Monthly sales analytics not found',
    error: error.message
  });
}
}


exports.adminWeeklyLiveSessionSalesAnalytics = async (req, res) => {
  try {
  const id = req.user;
  const user = await User.findById(id);
  const userStatus = await User.findById(user._id);

  if (userStatus.roles === 'admin') {

    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

    const salesAnalytics = await MeetingTransaction.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate()-28))
          },
          tutorId: userStatus._id
        }
      },
      {
        $group: {
          _id: { $week: "$createdAt" },
          total: { $sum: "$amount" }
        }
      }
    ]);

    return res.status(200).json({
      liveSessionSalesAnalytics: salesAnalytics.map(item => ({
        week: weeks[item._id - 1],
        totalLiveSessionSales: item.total
      }))
    });

  } else {
    return res.status(401).json({
      message: "You are not authorized to view sales analytics"
    });
  }
}catch (error) {
  return res.status(500).json({
    message: 'Weekly sales analytics not found',
    error: error.message
  });
}
}


exports.adminMonthlyAndWeeklyLiveSessionSalesAnalytics = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);

        if (userStatus.roles === 'admin' || userStatus.roles === 'superadmin') {
            const months = [
                "January", "February", "March",
                "April", "May", "June",
                "July", "August", "September",
                "October", "November", "December"
            ];

            const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

            const salesAnalytics = await MeetingTransaction.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(new Date().setMonth(new Date().getMonth() - 11))
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            month: { $month: "$createdAt" },
                            week: { $week: "$createdAt" }
                        },
                        total: { $sum: "$amount" }
                    }
                }
            ]);

            const monthlySales = [];
            const weeklySales = [];

            salesAnalytics.forEach(item => {
                monthlySales.push({
                    month: months[item._id.month - 1],
                    totalLiveSessionSales: item.total
                });

                weeklySales.push({
                    week: weeks[item._id.week - 1],
                    totalLiveSessionSales: item.total
                });
            });

            return res.status(200).json({
                monthlySales,
                weeklySales
            });
        } else {
            return res.status(401).json({
                message: "You are not authorized to view sales analytics"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Monthly and weekly sales analytics not found',
            error: error.message
        });
    }
}


// admin view his total earnings  
exports.adminTotalEarnings = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === 'admin') {
            const totalEarnings = await User.findOne({ _id: userStatus._id });
            return res.status(200).json({
                totalEarnings: totalEarnings.earnings
            });
        }
        else {
            return res.status(401).json({
                message: "You are not authorized to view total earnings"
            });
        }
    }catch (error) {
        return res.status(500).json({
            message: 'Total earnings not found',
            error: error.message
        });
    }
}


exports.superAdminTotalEarnings = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === 'superadmin') {
            const totalEarnings = await User.findOne({ _id: userStatus._id });
            return res.status(200).json({
                totalEarnings: totalEarnings.earnings
            });
        }
        else {
            return res.status(401).json({
                message: "You are not authorized to view total earnings"
            });
        }
    }catch (error) {
        return res.status(500).json({
            message: 'Total earnings not found',
            error: error.message
        });
    }
}


// get all the meetingTransaction and delete them all.
exports.adminDeleteAllMeetingTransactions = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === 'admin') {
            const meetingTransactions = await MeetingTransaction.find({});
            await MeetingTransaction.deleteMany({});
            return res.status(200).json({
                message: 'All meeting transactions deleted successfully',
                data: meetingTransactions
            });
        } else {
            return res.status(401).json({
                message: 'You are not authorized to delete meeting transactions'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete all meeting transactions",
            error: error.message
        });
    }
}


// admin weekly, monthly and yearly earnings 
exports.adminWeeklyMonthlyAndYearlyEarnings = async (req, res) => {
    try {
        const id = req.user._id; 
        const user = await User.findById(id);

        if (user && user.roles.includes('admin')) { 
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            const earningsAnalysis = await User.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
                        },
                        _id: user._id
                    }
                },
                {
                    $group: {
                        _id: {
                            week: { $week: "$createdAt" },
                            month: { $month: "$createdAt" },
                            year: { $year: "$createdAt" }
                        },
                        totalEarnings: { $sum: "$earnings" }
                    }
                },
                { $sort: { "_id.year": 1, "_id.week": 1 } } 
            ]);

            const monthlyEarningsMap = {};
            const yearlyEarningsMap = {};

            earningsAnalysis.forEach(entry => {
                const { week, month, year } = entry._id;
                const monthName = months[month - 1];
                const monthYearKey = `${monthName}-${year}`;
                const yearKey = `${year}`;

                if (!monthlyEarningsMap[monthYearKey]) {
                    monthlyEarningsMap[monthYearKey] = entry.totalEarnings;
                } else {
                    monthlyEarningsMap[monthYearKey] += entry.totalEarnings;
                }

                if (!yearlyEarningsMap[yearKey]) {
                    yearlyEarningsMap[yearKey] = entry.totalEarnings;
                } else {
                    yearlyEarningsMap[yearKey] += entry.totalEarnings;
                }
            });

            const monthlyEarnings = Object.keys(monthlyEarningsMap).map(key => ({
                monthYear: key,
                totalMonthlyEarnings: monthlyEarningsMap[key]
            }));

            const yearlyEarnings = Object.keys(yearlyEarningsMap).map(key => ({
                year: key,
                totalYearlyEarnings: yearlyEarningsMap[key]
            }));

            const weeklyEarnings = earningsAnalysis.map(item => ({
                week: item._id.week,
                year: item._id.year,
                totalWeeklyEarnings: item.totalEarnings
            }));

            return res.status(200).json({
                monthlyEarnings,
                weeklyEarnings,
                yearlyEarnings
            });
        } else {
            return res.status(401).json({ message: "You are not authorized to view earnings analytics." });
        }
    } catch (error) {
        console.error("Error fetching earnings analytics:", error);
        return res.status(500).json({ message: 'Failed to fetch earnings analytics', error: error.message });
    }
};



// admin weekly, monthly and yearly withdrawal
exports.adminWeeklyMonthlyAndYearlyWithdrawals = async (req, res) => {
      try {
        const id = req.user._id; 
        const user = await User.findById(id);
        if (user && user.roles.includes('admin')) { 
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            const earningsAnalysis = await WalletTransaction.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
                        },
                        userId: user._id
                    }
                },
                {
                    $group: {
                        _id: {
                            week: { $week: "$createdAt" },
                            month: { $month: "$createdAt" },
                            year: { $year: "$createdAt" }
                        },
                        totalEarnings: { $sum: "$earnings" }
                    }
                },
                { $sort: { "_id.year": 1, "_id.week": 1 } } 
            ]);

            const monthlyEarningsMap = {};
            const yearlyEarningsMap = {};

            earningsAnalysis.forEach(entry => {
                const { week, month, year } = entry._id;
                const monthName = months[month - 1];
                const monthYearKey = `${monthName}-${year}`;
                const yearKey = `${year}`;

                if (!monthlyEarningsMap[monthYearKey]) {
                    monthlyEarningsMap[monthYearKey] = entry.totalEarnings;
                } else {
                    monthlyEarningsMap[monthYearKey] += entry.totalEarnings;
                }

                if (!yearlyEarningsMap[yearKey]) {
                    yearlyEarningsMap[yearKey] = entry.totalEarnings;
                } else {
                    yearlyEarningsMap[yearKey] += entry.totalEarnings;
                }
            });

            const monthlyEarnings = Object.keys(monthlyEarningsMap).map(key => ({
                monthYear: key,
                totalMonthlyWithdrawals: monthlyEarningsMap[key]
            }));

            const yearlyEarnings = Object.keys(yearlyEarningsMap).map(key => ({
                year: key,
                totalYearlyWithdrawals: yearlyEarningsMap[key]
            }));

            const weeklyEarnings = earningsAnalysis.map(item => ({
                week: item._id.week,
                year: item._id.year,
                totalWeeklyWithdrawals: item.totalEarnings
            }));

            return res.status(200).json({
                monthlyWithdrawal: monthlyEarnings,
                weeklyWithdrawal: weeklyEarnings,
                yearlyWithdrawal: yearlyEarnings
            });
        } else {
            return res.status(401).json({ message: "You are not authorized to view withdrawal analytics." });
        }
    } catch (error) {
        console.error("Error fetching earnings analytics:", error);
        return res.status(500).json({ message: 'Failed to fetch withdrawal analytics', error: error.message });
    }
};


// weekly sales analytics of a course 
function getWeekNumber(date) {
    const onejan = new Date(date.getFullYear(), 0, 1);
    const millisecsInDay = 86400000;
    return Math.ceil((((date - onejan) / millisecsInDay) + onejan.getDay() + 1) / 7);
}
exports.courseWeeklySales = async (req, res) => {
    try {
        const userId = req.user; 
        const user = await User.findById(userId);
        
        if (!user || !user.roles.includes('admin')) {
            return res.status(403).json({ message: 'You are not authorized to perform this action' });
        }

        const courseId = req.params.courseId;
        const course = await Course.findOne({ _id: courseId, userId: user._id });
        
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        const sales = await Student.find({ courseId: course._id, userId: user._id });

        const weeklySales = {};
        const monthlySales = {};
        const yearlySales = {};

        sales.forEach(item => {
            const week = getWeekNumber(item.createdAt);
            const month = item.createdAt.getMonth() + 1; 
            const year = item.createdAt.getFullYear();

            // Weekly sales aggregation
            if (!weeklySales[week]) {
                weeklySales[week] = 0;
            }
            weeklySales[week] += item.totalRegisteredByStudent;

             // monthly sales aggregation
            if (!monthlySales[month]) {
                monthlySales[month] = 0;
            }
            monthlySales[month] += item.totalRegisteredByStudent;

            // Yearly sales aggregation
            if (!yearlySales[year]) {
                yearlySales[year] = 0;
            }
            yearlySales[year] += item.totalRegisteredByStudent;
        });

        return res.status(200).json({ weeklySales, monthlySales, yearlySales });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server error',
            error: error.message
        });
    }
};




exports.decodePdfDownloadableFile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user || !user.roles.includes('admin')) {
      return res.status(403).json({ message: 'You are not authorized to perform this action' });
    }

    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); 

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: 'Invalid date format. Please use YYYY-MM-DD format.' });
    }

    const monthlyOrders = await Student.aggregate([
      {
        $match: {
          userId: user._id,
          createdAt: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$price" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalSales: 1,
          count: 1,
        },
      },
    ]);

    if (!monthlyOrders || monthlyOrders.length === 0) {
      return res.status(404).json({ message: 'No orders found for the specified date range' });
    }

    const { totalSales, count } = monthlyOrders[0];

    // Create PDF
    const doc = new PDFDocument();
    const pdfFilePath = './monthly_sales_report.pdf';

    doc.pipe(fs.createWriteStream(pdfFilePath));
    doc.fontSize(24).text('Monthly Sales Report', { align: 'center', underline: true });
    doc.moveDown();
    doc.fontSize(18).text(`Tutor: ${user.firstName} ${user.lastName}`);
    doc.fontSize(18).text(`Balance: ${user.wallet}`);
    doc.moveDown();
    doc.fontSize(14).text(`Total Sales: $${totalSales.toFixed(2)}`);
    doc.fontSize(14).text(`Number of Orders: ${count}`);
    doc.moveDown();
    doc.fontSize(12).text(`Report Date: ${new Date().toLocaleDateString()}`);
    doc.end();

    // Wait for PDF to be written before sending response 
    return res.status(200).json({ downloadPath: pdfFilePath, monthlyOrders })    

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};



