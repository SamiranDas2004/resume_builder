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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <form onSubmit={sendFormData}>
        <div>
          <input
            value={formData.personal_info.name}
            type="text"
            onChange={(e) =>
              setFormData({
                ...formData,
                personal_info: {
                  ...formData.personal_info,
                  name: e.target.value,
                },
              })
            }
            placeholder="Name"
            className="border p-2 w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default PdfBuilder;
