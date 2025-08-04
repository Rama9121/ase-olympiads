import React, { useState } from 'react';
import * as XLSX from 'xlsx';

function Addsschool() {
  const [schools, setSchools] = useState([]);
  const [formData, setFormData] = useState({
    school_name: '',
    phone: '',
    state: '',
    district: '',
    area: '',
    incharge: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Submit manually to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/schools/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newSchool = await response.json();
        setSchools([newSchool, ...schools]); // save with ID from backend
        setFormData({
          school_name: '',
          phone: '',
          state: '',
          district: '',
          area: '',
          incharge: '',
        });
      } else {
        alert("❌ Failed to save school");
      }
    } catch (error) {
      console.error("Error saving school:", error);
    }
  };

  // ✅ Upload Excel and POST to backend
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);

      for (let row of data) {
        const formatted = {
          school_name: row['School Name'],
          phone: row['Phone'],
          state: row['State'],
          district: row['District'],
          area: row['Area'],
          incharge: row['Incharge Name'],
        };

        const res = await fetch('http://127.0.0.1:8000/api/schools/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formatted),
        });

        if (res.ok) {
          const saved = await res.json();
          setSchools((prev) => [saved, ...prev]);
        }
      }
    };
    reader.readAsBinaryString(file);
  };

  // ✅ Download sample Excel
  const downloadSample = () => {
    const sampleData = [{
      'School Name': 'Oxford High School',
      Phone: '9876543210',
      State: 'Telangana',
      District: 'Hyderabad',
      Area: 'Banjara Hills',
      'Incharge Name': 'Mr. Sharma',
    }];
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Schools');
    XLSX.writeFile(workbook, 'sample_school_list.xlsx');
  };

  // ✅ Delete from UI and Backend
  const handleDelete = async (index, id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/schools/${id}/`, {
        method: 'DELETE',
      });

      if (res.status === 204) {
        const updatedSchools = schools.filter((_, i) => i !== index);
        setSchools(updatedSchools);
      } else {
        alert("❌ Could not delete from server");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow-lg p-4 rounded-4">
        <h2 className="text-center text-success mb-4">Add New School</h2>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">School Name</label>
              <input type="text" name="school_name" className="form-control" required value={formData.school_name} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Phone Number</label>
              <input type="tel" name="phone" className="form-control" required value={formData.phone} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">State</label>
              <input type="text" name="state" className="form-control" required value={formData.state} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">District</label>
              <input type="text" name="district" className="form-control" required value={formData.district} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Area</label>
              <input type="text" name="area" className="form-control" required value={formData.area} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Incharge Name</label>
              <input type="text" name="incharge" className="form-control" required value={formData.incharge} onChange={handleChange} />
            </div>
          </div>

          <div className="text-center mt-4">
            <button type="submit" className="btn btn-success px-5 py-2 rounded-pill fw-bold shadow">
              ➕ Add School
            </button>
          </div>
        </form>
      </div>

      <hr className="my-5" />

      <div className="card shadow-sm p-4 rounded-4 bg-light">
        <h4 className="mb-3">📤 Upload Schools via Excel</h4>
        <input type="file" accept=".xlsx, .xls" className="form-control mb-3" onChange={handleFileUpload} />
        <button className="btn btn-outline-primary" onClick={downloadSample}>
          ⬇️ Download Sample Excel Format
        </button>
      </div>

      {schools.length > 0 && (
        <div className="mt-5">
          <h4 className="text-primary">📋 Recently Added Schools</h4>
          <div className="table-responsive">
            <table className="table table-bordered table-striped mt-3">
              <thead className="table-success">
                <tr>
                  <th>School Name</th>
                  <th>Phone</th>
                  <th>State</th>
                  <th>District</th>
                  <th>Area</th>
                  <th>Incharge</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schools.map((school, index) => (
                  <tr key={index}>
                    <td>{school.school_name}</td>
                    <td>{school.phone}</td>
                    <td>{school.state}</td>
                    <td>{school.district}</td>
                    <td>{school.area}</td>
                    <td>{school.incharge}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(index, school.id)} // 🧠 ID passed here
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Addsschool;
