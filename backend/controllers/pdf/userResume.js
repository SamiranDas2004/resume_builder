import PDFDocument from 'pdfkit';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const resumeBuilder = (req, res) => {
    const {
        personal_info,
        work_experience = [],
        skills = [],
        education = [],
        certifications = [],
        projects = []
    } = req.body;

    // Create a new PDF document
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const githubIconPath = path.join(__dirname, 'output/githubicon.png');
    const linkedinIconPath = path.join(__dirname, 'output/linkedinicon.png');

    // Set the response headers to indicate a file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${personal_info.name.replace(/\s+/g, '_')}_Resume.pdf`);

    // Pipe the PDF to the response
    doc.pipe(res);

    // Header - Name and Contact Info
  // Header - Name and Contact Info
doc.fontSize(24).text(personal_info.name || 'No Name Provided', { align: 'center' }).moveDown(0.2);

// Smaller font size for contact details
doc.fontSize(10);
if (personal_info.phone) doc.text(personal_info.phone, { align: 'center' });
if (personal_info.email) doc.text(personal_info.email, { align: 'center' });

// LinkedIn and GitHub with icons
const iconSize = 10; // Smaller size for icons
if (personal_info.linkedin) {
    doc.image(linkedinIconPath, doc.x - iconSize, doc.y, { width: iconSize, height: iconSize });
    doc.text(` ${personal_info.linkedin}`, { align: 'center', continued: true }).moveDown(0.2);
}
if (personal_info.github) {
    doc.image(githubIconPath, doc.x - iconSize, doc.y, { width: iconSize, height: iconSize });
    doc.text(` ${personal_info.github}`, { align: 'center', continued: true }).moveDown(0.2);
}

// Portfolio link in the same smaller font size
if (personal_info.portfolio) doc.text(personal_info.portfolio, { align: 'center' }).moveDown(1);

    // Helper functions for sections
    const addSectionTitle = (title) => doc.fontSize(14).text(title).moveDown(0.5);
    const addSubsection = (title, content) => {
        doc.fontSize(12).text(title, { bold: true });
        doc.fontSize(10).text(content).moveDown(0.5);
    };

    // Sections (Education, Skills, Experience, Certifications, Projects)
    if (education.length > 0) {
        addSectionTitle('Education');
        education.forEach((edu) => {
            addSubsection(`${edu.degree || ''} | ${edu.school_name || ''}`, `Graduation Year: ${edu.graduation_year || ''}`);
        });
    }

    if (skills.length > 0) {
        addSectionTitle('Technical Skills');
        doc.fontSize(10).text(skills.join(', ')).moveDown(1);
    }

    if (work_experience.length > 0) {
        addSectionTitle('Experience');
        work_experience.forEach((job) => {
            addSubsection(`${job.job_title || ''} | ${job.company || ''}`, `${job.start_date || ''} - ${job.end_date || ''}`);
            if (job.achievements && job.achievements.length > 0) {
                job.achievements.forEach((achievement) => {
                    doc.fontSize(10).text(`• ${achievement}`).moveDown(0.1);
                });
            }
            doc.moveDown(0.5);
        });
    }

    if (certifications.length > 0) {
        addSectionTitle('Certifications');
        certifications.forEach((cert) => {
            addSubsection(`${cert.name || ''} - ${cert.issuer || ''}`, `Issued: ${cert.date || ''}`);
        });
    }

    if (projects.length > 0) {
        addSectionTitle('Projects');
        projects.forEach((project) => {
            addSubsection(project.project_name || '', project.description || '');
            if (Array.isArray(project.technologies)) {
                doc.fontSize(10).text(`Technologies: ${project.technologies.join(', ') || ''}`);
            } else {
                doc.fontSize(10).text('Technologies: No technologies listed');
            }
            if (project.link) doc.text(`Link: ${project.link}`).moveDown(0.5);
        });
    }

    // Finalize the PDF and send it
    doc.end();
};
