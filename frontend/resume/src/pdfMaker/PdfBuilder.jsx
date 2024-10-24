import React, { useState } from "react";
import axios from "axios";

function PdfBuilder() {
  const [formData, setFormData] = useState({
    personal_info: {
      name: "",
      contactnumber: "",
      email: "",
      linkedin: "",
      portfolio: "",
    },
    work_experience: [
      {
        job_title: "",
        company: "",
        start_date: "",
        end_date: "",
        description: "",
        achievements: [],
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
        technologies: "",
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
      const response = await axios.post(
        "http://localhost:8000/api/resume",
        formData
      );
      if (response.status === 200) {
        console.log(response.data);
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  // Function to handle form data updates
  const handleInputChange = (section, index, event) => {
    const updatedData = formData[section].map((item, i) =>
      i === index ? { ...item, [event.target.name]: event.target.value } : item
    );
    setFormData({ ...formData, [section]: updatedData });
  };

  // Function to handle skills changes
  const handleSkillsChange = (event) => {
    const skillsArray = event.target.value.split(",").map((skill) => skill.trim());
    setFormData({ ...formData, skills: skillsArray });
  };

  // Functions to add new fields
  const addField = (section) => {
    const newItem = section === "work_experience"
      ? { job_title: "", company: "", start_date: "", end_date: "", description: "" }
      : section === "education"
      ? { school_name: "", degree: "", graduation_year: "" }
      : section === "projects"
      ? { project_name: "", description: "", technologies: "", link: "" }
      : { name: "", issuer: "", date: "" };
    setFormData({ ...formData, [section]: [...formData[section], newItem] });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <form onSubmit={sendFormData}>
        {/* Personal Information Section */}
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={formData.personal_info.name}
            type="text"
            onChange={(e) =>
              setFormData({ ...formData, personal_info: { ...formData.personal_info, name: e.target.value } })
            }
            placeholder="Name"
            className="border p-3 rounded-lg w-full"
          />
          <input
            value={formData.personal_info.contactnumber}
            type="text"
            onChange={(e) =>
              setFormData({ ...formData, personal_info: { ...formData.personal_info, contactnumber: e.target.value } })
            }
            placeholder="Contact Number"
            className="border p-3 rounded-lg w-full"
          />
          <input
            value={formData.personal_info.email}
            type="email"
            onChange={(e) =>
              setFormData({ ...formData, personal_info: { ...formData.personal_info, email: e.target.value } })
            }
            placeholder="Email"
            className="border p-3 rounded-lg w-full"
          />
          <input
            value={formData.personal_info.linkedin}
            type="text"
            onChange={(e) =>
              setFormData({ ...formData, personal_info: { ...formData.personal_info, linkedin: e.target.value } })
            }
            placeholder="LinkedIn"
            className="border p-3 rounded-lg w-full"
          />
          <input
            value={formData.personal_info.portfolio}
            type="text"
            onChange={(e) =>
              setFormData({ ...formData, personal_info: { ...formData.personal_info, portfolio: e.target.value } })
            }
            placeholder="Portfolio"
            className="border p-3 rounded-lg w-full"
          />
        </div>

        {/* Work Experience Section */}
        <h2 className="text-xl font-semibold mt-6 mb-4">Work Experience</h2>
        {formData.work_experience.map((experience, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              placeholder="Job Description"
              className="border p-3 rounded-lg w-full"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => addField("work_experience")}
          className="mt-4 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg"
        >
          Add Work Experience
        </button>

        {/* Skills Section */}
        <h2 className="text-xl font-semibold mt-6 mb-4">Skills</h2>
        <input
          type="text"
          placeholder="Skills (comma-separated)"
          onChange={handleSkillsChange}
          className="border p-3 rounded-lg w-full"
        />

        {/* Education Section */}
        <h2 className="text-xl font-semibold mt-6 mb-4">Education</h2>
        {formData.education.map((edu, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="school_name"
              value={edu.school_name}
              onChange={(e) => handleInputChange("education", index, e)}
              placeholder="School Name"
              className="border p-3 rounded-lg w-full"
            />
            <input
              name="degree"
              value={edu.degree}
              onChange={(e) => handleInputChange("education", index, e)}
              placeholder="Degree"
              className="border p-3 rounded-lg w-full"
            />
            <input
              name="graduation_year"
              value={edu.graduation_year}
              onChange={(e) => handleInputChange("education", index, e)}
              placeholder="Graduation Year"
              className="border p-3 rounded-lg w-full"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => addField("education")}
          className="mt-4 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg"
        >
          Add Education
        </button>

        {/* Projects Section */}
        <h2 className="text-xl font-semibold mt-6 mb-4">Projects</h2>
        {formData.projects.map((project, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="project_name"
              value={project.project_name}
              onChange={(e) => handleInputChange("projects", index, e)}
              placeholder="Project Name"
              className="border p-3 rounded-lg w-full"
            />
            <input
              name="description"
              value={project.description}
              onChange={(e) => handleInputChange("projects", index, e)}
              placeholder="Project Description"
              className="border p-3 rounded-lg w-full"
            />
            <input
              name="technologies"
              value={project.technologies}
              onChange={(e) => handleInputChange("projects", index, e)}
              placeholder="Technologies Used"
              className="border p-3 rounded-lg w-full"
            />
            <input
              name="link"
              value={project.link}
              onChange={(e) => handleInputChange("projects", index, e)}
              placeholder="Project Link"
              className="border p-3 rounded-lg w-full"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => addField("projects")}
          className="mt-4 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg"
        >
          Add Project
        </button>

        {/* Certifications Section */}
        <h2 className="text-xl font-semibold mt-6 mb-4">Certifications</h2>
        {formData.certifications.map((cert, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              placeholder="Issuing Organization"
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
        <button
          type="button"
          onClick={() => addField("certifications")}
          className="mt-4 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg"
        >
          Add Certification
        </button>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg"
        >
          Submit Form
        </button>
      </form>
    </div>
  );
}

export default PdfBuilder;
