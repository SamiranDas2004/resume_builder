import PDFDocument from 'pdfkit';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES modules
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

    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${personal_info.name.replace(/\s+/g, '_')}_Resume.pdf`);

    // Pipe the PDF to the response
    doc.pipe(res);

    // Header - Name and Contact Info
    doc.fontSize(24).text(personal_info.name || 'No Name Provided', { align: 'center' }).moveDown(0.2);
    if (personal_info.phone) doc.fontSize(10).text(personal_info.phone, { align: 'center' });
    if (personal_info.email) doc.text(personal_info.email, { align: 'center' });
    
    // Define the image paths as strings using the __dirname workaround
    const githubIconPath = path.join(__dirname, 'output/githubicon.png');
    const linkedinIconPath = path.join(__dirname, 'output/linkedinicon.png');

    // Draw GitHub icon and link if provided
    if (personal_info.github) {
        doc.image(githubIconPath, 270, doc.y, { width: 15, height: 15 });
        doc.fillColor('blue').text(personal_info.github, 290, doc.y - 15, { link: personal_info.github });
    }

    // Draw LinkedIn icon and link if provided
    if (personal_info.linkedin) {
        doc.image(linkedinIconPath, 270, doc.y + 15, { width: 15, height: 15 });
        doc.fillColor('blue').text(personal_info.linkedin, 290, doc.y - 15, { link: personal_info.linkedin });
    }

    // Sections (Education, Skills, Experience, Certifications, Projects)
    const addSectionTitle = (title) => doc.fontSize(14).text(title).moveDown(0.5);
    const addSubsection = (title, content) => {
        doc.fontSize(12).text(title, { bold: true });
        doc.fontSize(10).text(content).moveDown(0.5);
    };

    // Education
    if (education.length > 0) {
        addSectionTitle('Education');
        education.forEach((edu) => {
            addSubsection(`${edu.degree || ''} | ${edu.school_name || ''}`, `Graduation Year: ${edu.graduation_year || ''}`);
        });
    }

    // Skills
    if (skills.length > 0) {
        addSectionTitle('Technical Skills');
        doc.fontSize(10).text(skills.join(', ')).moveDown(1);
    }

    // Work Experience
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

    // Certifications
    if (certifications.length > 0) {
        addSectionTitle('Certifications');
        certifications.forEach((cert) => {
            addSubsection(`${cert.name || ''} - ${cert.issuer || ''}`, `Issued: ${cert.date || ''}`);
        });
    }

    // Projects
    if (projects.length > 0) {
        addSectionTitle('Projects');
        projects.forEach((project) => {
            addSubsection(project.project_name || '', project.description || '');
            if (Array.isArray(project.technologies)) {
                doc.fontSize(10).text(`Technologies: ${project.technologies.join(', ') || ''}`);
            }
            if (project.link) doc.text(`Link: ${project.link}`).moveDown(0.5);
        });
    }

    doc.end();
};
