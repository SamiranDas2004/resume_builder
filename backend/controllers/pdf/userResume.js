import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const resumeBuilder = (req, res) => {
    const {
        personal_info,
        work_experience,
        skills,
        education,
        certifications,
        projects
    } = req.body;

    // Create a new PDF document
    const doc = new PDFDocument({
        margin: 50,
        size: 'A4'
    });

    // Set the directory where the PDF will be saved
    const outputDir = path.join(__dirname, 'output');

    // Check if the directory exists, if not, create it
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    // Set the file path where the PDF will be saved
    const filePath = path.join(outputDir, `${personal_info.name.replace(/\s+/g, '_')}_Resume.pdf`);

    // Pipe the PDF to a writable stream
    doc.pipe(fs.createWriteStream(filePath));

    // Helper function to add a section title and draw an underline
    const addSectionTitle = (title) => {
        doc.fontSize(16)
           .fillColor('#4A4A4A')
           .text(title, { underline: true })
           .moveDown(0.5);
        addUnderline();  // Add underline after section title
    };

    // Helper function to add a subsection
    const addSubsection = (title, content) => {
        doc.fontSize(12)
           .fillColor('#2C3E50')
           .text(title, { bold: true });
        doc.fontSize(10)
           .fillColor('#34495E')
           .text(content)
           .moveDown(0.5);
    };

    // Helper function to add a full-width underline
    const addUnderline = () => {
        const pageWidth = doc.page.width;
        const margin = doc.options.margin || 50;
        doc.moveTo(margin, doc.y)
           .lineTo(pageWidth - margin, doc.y)
           .strokeColor('#AAAAAA')
           .stroke()
           .moveDown(1);
    };

    // Add Header
    doc.fontSize(24)
       .fillColor('#2C3E50')
       .text(personal_info.name, { align: 'center' })
       .moveDown(0.2);

    // Add Personal Info
    doc.fontSize(12)
       .fillColor('#34495E')
       .text(personal_info.email, { align: 'center' })
       .text(personal_info.phone, { align: 'center' })
       .text(personal_info.linkedin, { align: 'center' })
       .text(personal_info.portfolio, { align: 'center' })
       .moveDown(1);



    // Add Work Experience Section
    addSectionTitle('Work Experience');
    work_experience.forEach((job) => {
        addSubsection(`${job.job_title} | ${job.company}`, `${job.start_date} - ${job.end_date}`);
        doc.fontSize(12)
           .fillColor('#555')
           .text(job.description)
           .moveDown(0.2);
        job.achievements.forEach((achievement) => {
            doc.list([achievement], { bulletRadius: 2, textIndent: 20 });
        });
        doc.moveDown(0.5);
    });

    // Add underline after work experience
    // addUnderline();

    // Add Skills Section
    addSectionTitle('Skills');
    const skillColumns = 3;
    const skillRows = Math.ceil(skills.length / skillColumns);
    for (let i = 0; i < skillRows; i++) {
        doc.text(skills.slice(i * skillColumns, (i + 1) * skillColumns).join(' | '), {
            columns: skillColumns,
            columnGap: 10,
            height: 20,
            width: 412,
            align: 'justify'
        });
    }
    doc.moveDown(1);

    // addUnderline();  // Add underline after skills

    // Add Education Section
    addSectionTitle('Education');
    education.forEach((edu) => {
        addSubsection(`${edu.degree} | ${edu.school_name}`, `Graduation Year: ${edu.graduation_year}`);
    });

    // addUnderline();  // Add underline after education

    // Add Certifications Section
    addSectionTitle('Certifications');
    certifications.forEach((cert) => {
        addSubsection(`${cert.name} - ${cert.issuer}`, `Issued: ${cert.date}`);
    });

    // addUnderline();  // Add underline after certifications

    // Add Projects Section
    addSectionTitle('Projects');
    projects.forEach((project) => {
        addSubsection(project.project_name, project.description);
        doc.fontSize(12)
           .fillColor('#555')
           .text(`Technologies: ${project.technologies.join(', ')}`)
           .text(`Link: ${project.link}`)
           .moveDown(0.5);
    });

    // addUnderline();  // Add underline after projects

    // Finalize the PDF and end the document
    doc.end();

    // Send the file path as a response
    res.json({ message: 'PDF generated', filePath });
};
