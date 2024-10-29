import React, { useState } from "react";
import axios from "axios";

const ResumePreview = ({ formData }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Personal Info */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{formData.personal_info.name || 'Your Name'}</h1>
        <div className="text-gray-600 space-y-1">
          {formData.personal_info.email && <p>{formData.personal_info.email}</p>}
          {formData.personal_info.contactnumber && <p>{formData.personal_info.contactnumber}</p>}
          {formData.personal_info.linkedin && <p>LinkedIn: {formData.personal_info.linkedin}</p>}
          {formData.personal_info.github && <p>github: {formData.personal_info.github}</p>}
        </div>
      </div>

      {/* Work Experience */}
      {formData.work_experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 border-b pb-2">Work Experience</h2>
          {formData.work_experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold">{exp.job_title || 'Job Title'}</h3>
              <p className="text-gray-700">{exp.company || 'Company Name'}</p>
              <p className="text-gray-600 text-sm">
                {exp.start_date} - {exp.end_date}
              </p>
              <p className="mt-1">{exp.description || 'Description'}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {formData.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 border-b pb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {formData.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 border-b pb-2">Education</h2>
          {formData.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold">{edu.school_name || 'School Name'}</h3>
              <p>{edu.degree || 'Degree'}</p>
              <p className="text-gray-600">{edu.graduation_year || 'Graduation Year'}</p>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {formData.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 border-b pb-2">Projects</h2>
          {formData.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold">{project.project_name || 'Project Name'}</h3>
              {project.link && (
                <a href={project.link} className="text-blue-600 text-sm" target="_blank" rel="noopener noreferrer">
                  Project Link
                </a>
              )}
              <p className="mt-1">{project.description || 'Description'}</p>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {formData.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 border-b pb-2">Certifications</h2>
          {formData.certifications.map((cert, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold">{cert.name || 'Certification Name'}</h3>
              <p>{cert.issuer || 'Issuer'}</p>
              <p className="text-gray-600">{cert.date || 'Date'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function PdfBuilder() {
  const [formData, setFormData] = useState({
    personal_info: {
      name: "",
      contactnumber: "",
      email: "",
      linkedin: "",
      github: "",
    },
    work_experience: [
      {
        job_title: "",
        company: "",
        start_date: "",
        end_date: "",
        description: "",
      },
    ],
    skills: [],
    education: [
      {
        school_name: "",
        degree: "",
        graduation_year: "",
      },
    ],
    projects: [
      {
        project_name: "",
        description: "",
        link: "",
      },
    ],
    certifications: [
      {
        name: "",
        issuer: "",
        date: "",
      },
    ],
  });

  const sendFormData = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post("http://localhost:8000/api/resume", formData, {
            responseType: 'blob', // Set response type to blob to handle binary data
        });

        if (response.status === 200) {
            // Create a blob URL for the PDF
            const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
            const pdfURL = URL.createObjectURL(pdfBlob);

            // Create a temporary link to trigger the download
            const link = document.createElement('a');
            
            link.href = pdfURL;
            link.download = 'resume.pdf'; // Set the desired file name
            document.body.appendChild(link);
            link.click();

            // Clean up by removing the link and revoking the blob URL
            document.body.removeChild(link);
            URL.revokeObjectURL(pdfURL);
        }
    } catch (error) {
        console.log("Error:", error.message);
    }
};


  const handleInputChange = (section, index, event) => {
    const updatedData = formData[section].map((item, i) =>
      i === index ? { ...item, [event.target.name]: event.target.value } : item
    );
    setFormData({ ...formData, [section]: updatedData });
  };

  const handlePersonalInfoChange = (e) => {
    setFormData({
      ...formData,
      personal_info: {
        ...formData.personal_info,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleSkillsChange = (event) => {
    const skillsArray = event.target.value.split(",").map((skill) => skill.trim());
    setFormData({ ...formData, skills: skillsArray });
  };

  const addField = (section) => {
    const newField = {
      work_experience: {
        job_title: "",
        company: "",
        start_date: "",
        end_date: "",
        description: "",
      },
      education: {
        school_name: "",
        degree: "",
        graduation_year: "",
      },
      projects: {
        project_name: "",
        description: "",
        link: "",
      },
      certifications: {
        name: "",
        issuer: "",
        date: "",
      },
    };

    setFormData({
      ...formData,
      [section]: [...formData[section], newField[section]],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg overflow-y-auto max-h-screen">
            <form className="space-y-6" onSubmit={sendFormData}>
              {/* Personal Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 gap-4">
                  <input
                    name="name"
                    value={formData.personal_info.name}
                    onChange={handlePersonalInfoChange}
                    placeholder="Name"
                    className="border p-3 rounded-lg w-full"
                  />
                  <input
                    name="contactnumber"
                    value={formData.personal_info.contactnumber}
                    onChange={handlePersonalInfoChange}
                    placeholder="Contact Number"
                    className="border p-3 rounded-lg w-full"
                  />
                  <input
                    name="email"
                    value={formData.personal_info.email}
                    onChange={handlePersonalInfoChange}
                    placeholder="Email"
                    className="border p-3 rounded-lg w-full"
                  />
                  <input
                    name="linkedin"
                    value={formData.personal_info.linkedin}
                    onChange={handlePersonalInfoChange}
                    placeholder="LinkedIn"
                    className="border p-3 rounded-lg w-full"
                  />
                  <input
                    name="github"
                    value={formData.personal_info.github}
                    onChange={handlePersonalInfoChange}
                    placeholder="github"
                    className="border p-3 rounded-lg w-full"
                  />
                </div>
              </div>

              {/* Work Experience */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Work Experience</h2>
                {formData.work_experience.map((experience, index) => (
                  <div key={index} className="grid grid-cols-1 gap-4 mb-4">
                    <input
                      name="job_title"
                      value={experience.job_title}
                      onChange={(e) => handleInputChange("work_experience", index, e)}
                      placeholder="Job Title"
                      className="border p-3 rounded-lg w-full"
                    />
                    <input
                      name="company"
                      value={experience.company}
                      onChange={(e) => handleInputChange("work_experience", index, e)}
                      placeholder="Company"
                      className="border p-3 rounded-lg w-full"
                    />
                    <input
                      name="start_date"
                      value={experience.start_date}
                      onChange={(e) => handleInputChange("work_experience", index, e)}
                      placeholder="Start Date"
                      className="border p-3 rounded-lg w-full"
                    />
                    <input
                      name="end_date"
                      value={experience.end_date}
                      onChange={(e) => handleInputChange("work_experience", index, e)}
                      placeholder="End Date"
                      className="border p-3 rounded-lg w-full"
                    />
                    <textarea
                      name="description"
                      value={experience.description}
                      onChange={(e) => handleInputChange("work_experience", index, e)}
                      placeholder="Description"
                      className="border p-3 rounded-lg w-full"
                    />
                  </div>
                ))}
                <button type="button" onClick={() => addField("work_experience")} className="bg-blue-600 text-white px-4 py-2 rounded">
                  Add Work Experience
                </button>
              </div>

              {/* Skills */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Skills (comma separated)</h2>
                <input
                  value={formData.skills.join(", ")}
                  onChange={handleSkillsChange}
                  placeholder="Skills"
                  className="border p-3 rounded-lg w-full"
                />
              </div>

              {/* Education */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Education</h2>
                {formData.education.map((education, index) => (
                  <div key={index} className="grid grid-cols-1 gap-4 mb-4">
                    <input
                      name="school_name"
                      value={education.school_name}
                      onChange={(e) => handleInputChange("education", index, e)}
                      placeholder="School Name"
                      className="border p-3 rounded-lg w-full"
                    />
                    <input
                      name="degree"
                      value={education.degree}
                      onChange={(e) => handleInputChange("education", index, e)}
                      placeholder="Degree"
                      className="border p-3 rounded-lg w-full"
                    />
                    <input
                      name="graduation_year"
                      value={education.graduation_year}
                      onChange={(e) => handleInputChange("education", index, e)}
                      placeholder="Graduation Year"
                      className="border p-3 rounded-lg w-full"
                    />
                  </div>
                ))}
                <button type="button" onClick={() => addField("education")} className="bg-blue-600 text-white px-4 py-2 rounded">
                  Add Education
                </button>
              </div>

              {/* Projects */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Projects</h2>
                {formData.projects.map((project, index) => (
                  <div key={index} className="grid grid-cols-1 gap-4 mb-4">
                  <input
                      name="link"
                      value={project.link}
                      onChange={(e) => handleInputChange("projects", index, e)}
                      placeholder="Project Link"
                      className="border p-3 rounded-lg w-full"
                    />
                    <textarea
                      name="description"
                      value={project.description}
                      onChange={(e) => handleInputChange("projects", index, e)}
                      placeholder="Description"
                      className="border p-3 rounded-lg w-full"
                    />
                  </div>
                ))}
                <button type="button" onClick={() => addField("projects")} className="bg-blue-600 text-white px-4 py-2 rounded">
                  Add Project
                </button>
              </div>

              {/* Certifications */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Certifications</h2>
                {formData.certifications.map((cert, index) => (
                  <div key={index} className="grid grid-cols-1 gap-4 mb-4">
                    <input
                      name="name"
                      value={cert.name}
                      onChange={(e) => handleInputChange("certifications", index, e)}
                      placeholder="Certification Name"
                      className="border p-3 rounded-lg w-full"
                    />
                    <input
                      name="issuer"
                      value={cert.issuer}
                      onChange={(e) => handleInputChange("certifications", index, e)}
                      placeholder="Issuer"
                      className="border p-3 rounded-lg w-full"
                    />
                    <input
                      name="date"
                      value={cert.date}
                      onChange={(e) => handleInputChange("certifications", index, e)}
                      placeholder="Date"
                      className="border p-3 rounded-lg w-full"
                    />
                  </div>
                ))}
                <button type="button" onClick={() => addField("certifications")} className="bg-blue-600 text-white px-4 py-2 rounded">
                  Add Certification
                </button>
              </div>

              {/* Submit Button */}
              <button type="submit" className="w-full bg-green-600 text-white px-4 py-2 rounded-lg">
                Submit and Generate PDF
              </button>
            </form>
          </div>

          {/* Resume Preview Section */}
          <ResumePreview formData={formData} />
        </div>
      </div>
    </div>
  );
}

export default PdfBuilder;
