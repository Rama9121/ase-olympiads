import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

function Searchschool() {
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [totalSchools, setTotalSchools] = useState(0);
  const [filters, setFilters] = useState({
    school_name: '',
    phone: '',
    state: '',
    district: '',
    area: '',
  });

  // Fetch from API
  const fetchData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/schools/`);
      const data = await response.json();
      setSchools(data);
      setFilteredSchools(data);
      setTotalSchools(data.length);
    } catch (error) {
      console.error("Failed to fetch schools:", error);
      setSchools([]);
      setFilteredSchools([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = schools.filter((school) =>
      school.school_name?.toLowerCase().includes(filters.school_name.toLowerCase()) &&
      school.phone?.includes(filters.phone) &&
      school.state?.toLowerCase().includes(filters.state.toLowerCase()) &&
      school.district?.toLowerCase().includes(filters.district.toLowerCase()) &&
      school.area?.toLowerCase().includes(filters.area.toLowerCase())
    );
    setFilteredSchools(filtered);
  }, [filters, schools]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const exportToExcel = () => {
    if (filteredSchools.length === 0) return;
    const ws = XLSX.utils.json_to_sheet(filteredSchools);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'FilteredSchools');
    XLSX.writeFile(wb, 'filtered_schools.xlsx');
  };

  const handleDelete = async (schoolId) => {
    const confirmDelete = window.confirm('Are you sure to delete this school?');
    if (!confirmDelete) return;

    try {
      await fetch(`http://127.0.0.1:8000/api/schools/${schoolId}/`, {
        method: 'DELETE',
      });
      fetchData(); // Refresh data after delete
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="text-success text-center mb-4">🔍 Search, Export & Delete Schools</h2>

      <div className="d-flex justify-content-between mb-2">
        <span className="fw-semibold text-primary">Total Schools: {totalSchools}</span>
        <span className="fw-semibold text-success">Showing: {filteredSchools.length}</span>
      </div>

      {/* Filter Inputs */}
      <div className="row g-2 mb-3">
        <div className="col-md">
          <input
            type="text"
            className="form-control"
            placeholder="School Name"
            name="school_name"
            value={filters.school_name}
            onChange={handleChange}
          />
        </div>
        <div className="col-md">
          <input
            type="text"
            className="form-control"
            placeholder="Phone"
            name="phone"
            value={filters.phone}
            onChange={handleChange}
          />
        </div>
        <div className="col-md">
          <input
            type="text"
            className="form-control"
            placeholder="State"
            name="state"
            value={filters.state}
            onChange={handleChange}
          />
        </div>
        <div className="col-md">
          <input
            type="text"
            className="form-control"
            placeholder="District"
            name="district"
            value={filters.district}
            onChange={handleChange}
          />
        </div>
        <div className="col-md">
          <input
            type="text"
            className="form-control"
            placeholder="Area"
            name="area"
            value={filters.area}
            onChange={handleChange}
          />
        </div>
      </div>

      <button
        className="btn btn-outline-primary mb-4"
        onClick={exportToExcel}
        disabled={filteredSchools.length === 0}
      >
        ⬇️ Export to Excel
      </button>

      {/* School Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-success">
            <tr>
              <th>School Name</th>
              <th>Phone</th>
              <th>State</th>
              <th>District</th>
              <th>Area</th>
              <th>Incharge</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchools.length > 0 ? (
              filteredSchools.map((school, index) => (
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
                      onClick={() => handleDelete(school.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-danger">
                  🚫 No matching schools found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Searchschool;
