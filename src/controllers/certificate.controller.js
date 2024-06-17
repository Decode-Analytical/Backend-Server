const Student = require('../models/student.model');
const User = require('../models/user.model');
const { Course } = require('../models/course.model');
const  PDF = require('pdfkit');
const sendEmail = require('../emails/email');


const generateCertificatePDF = (courseName, user, student) => {
    const doc = new PDF();
    doc.fontSize(25).text('Certificate of Completion', { align: 'center' });
    doc.moveDown();
    doc.fontSize(20).text(`This certifies that ${user.firstName} ${user.lastName}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(18).text(`has successfully completed the course "${courseName.course_title}"`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Student ID: ${student[0].certificateCode}`, { align: 'right' });
    doc.moveDown();
    doc.moveDown();
    doc.fontSize(18).text(`Decode Institute`, { align: 'bottom' });
    doc.moveDown();
    doc.fontSize(14).text(`Date: ${new Date()}`, { align: 'left' });
    // doc.fontSize(14).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'left' });
    doc.end();
    return doc;
};

exports.studentCertificate = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await User.findById(id);

        if (user.roles !== 'student') {
            return res.status(401).json({ message: 'Unauthorized, only students can generate certificates' });
        }

        const student = await Student.find({ userId: user._id });

        if (!student) {
            return res.status(404).json({ message: 'No Courses found' });
        }

        // Check if all modules are completed
        const completedCourses = [];
        for (const courseId of student.map(module => module.courseId)) {
            const allModulesCompleted = student.every(module => module.isCompleted);
            if (allModulesCompleted === false) {
                 completedCourses.push(courseId);
                }else {
                    return res.status(400).json({ message: 'Not all modules are completed' });
                }
            }

            for (const course of completedCourses) {
                const courseName = await Course.findById(student[0].courseId);

            const pdfDoc = generateCertificatePDF(courseName, user, student);

            
            await sendEmail({
                email: user.email,
                subject: 'Certificate of Completion',
                message: `This certifies that ${user.firstName} ${user.lastName} has successfully completed the course "${courseName.course_title}"`,
                attachments: [
                    {
                        filename: `certificate_${user.firstName}_${courseName.course_title}.pdf`,
                        content: pdfDoc,
                    }
                ]
            });
        return res.status(200).json({ message: 'Certificates generated and sent successfully', Title: student[0].title })
        };
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
