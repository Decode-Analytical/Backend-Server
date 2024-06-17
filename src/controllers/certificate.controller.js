const Student = require('../models/student.model');
const User = require('../models/user.model');
const Certificate = require('../models/certificate.model');
const { Course } = require('../models/course.model');
const  PDF = require('pdfkit');
const sendEmail = require('../emails/email');



const generateCertificatePDF = (courseName, user, student) => {
    const doc = new PDF({ size: 'A4', layout: 'portrait', margin: 50,});
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f0f0f0');
    doc.rect(25, 25, doc.page.width - 50, doc.page.height - 50).stroke('#000');
    // doc.image(`${user.picture[0].path}`, { fit: [250, 300],align: 'right', valign: 'center'});
    doc.fontSize(25).fillColor('#000').text('Certificate of Completion', { align: 'center', underline: true,  bold: true, });
    doc.moveDown();
    doc.fontSize(20).text(`This certifies that`, { align: 'center', });
    doc.fontSize(20).text(`${user.firstName} ${user.lastName}`, { align: 'center', underline: true, bold: true, });
    doc.moveDown();
    doc.fontSize(18).text(`has successfully completed the course "${courseName.course_title}"`, { align: 'center', bold: true, });
    doc.moveDown();
    doc.fontSize(14).text(`Cert ID: ${student[0].certificateCode}`, { align: 'right' });
    doc.moveDown();
    doc.fontSize(14).text(`Date of Completion: ${new Date().toLocaleDateString()}`, { align: 'right' });
    doc.moveDown();
    doc.fontSize(18).text(`Decode Institute`, { align: 'bottom' });
    doc.moveDown();
    doc.moveDown();
    doc.fontSize(16).text('___macsdecode____', { align: 'center', italic: true, });
    doc.fontSize(12).text('Signature', { align: 'center' });
    doc.fontSize(14).text(`Date: ${new Date()}`, { align: 'left' });
    doc.end();
    return doc;

};


exports.studentCertificate = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await User.findById(id);

        if (user.roles !== 'superadmin') {
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
                const certificate = await Certificate.create({
                    userId: user._id,
                    course_id: student[0].courseId,
                    student_id: student[0]._id,
                    certificateCode: student[0].certificateCode,
                    studentName: `${user.firstName} ${user.lastName}`,
                    courseName: courseName.course_title,
                });

            const pdfDoc = generateCertificatePDF(courseName, user, student);

            await sendEmail({
                email: user.email,
                subject: 'Certificate of Completion',
                message: `Dear ${user.firstName} ${user.lastName}, here is your certificate of completion for the course ${courseName.course_title}`,
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



exports.getCertificate = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await User.findById(id);

        if (user.roles !== 'superadmin' && user.roles !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized, only super admin or admin can view certificates' });
        }
        const { certificateCode } = req.params;
        const certificate = await Certificate.findOne({ certificateCode });
        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        return res.status(200).json({ message: 'Certificate found', certificate });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}