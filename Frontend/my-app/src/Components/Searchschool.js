import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

function Searchschool() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSchools, setFilteredSchools] = useState([]);

  // Fetch data from Django API
  const fetchData = async (search = '') => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/schools/?search=${search}`);
      const data = await response.json();
      setFilteredSchools(data);
    } catch (error) {
      console.error("Failed to fetch schools:", error);
      setFilteredSchools([]);
    }
  };

  // Initial load
  useEffect(() => {
    fetchData();
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchData(value);
  };

  // Export filtered schools to Excel
  const exportToExcel = () => {
    if (filteredSchools.length === 0) return;

    const ws = XLSX.utils.json_to_sheet(filteredSchools);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'FilteredSchools');
    XLSX.writeFile(wb, 'filtered_schools.xlsx');
  };

  return (
    <div className="container py-4">
      <h2 className="text-success mb-4 text-center">Search & Export Schools</h2>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by name, phone, state, district, area..."
        value={searchTerm}
        onChange={handleSearch}
      />

      <button
        className="btn btn-outline-primary mb-4"
        onClick={exportToExcel}
        disabled={filteredSchools.length === 0}
      >
        ⬇️ Export Filtered to Excel
      </button>

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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-danger">
                  🚫 No matching records found.
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