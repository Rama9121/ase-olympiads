import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

function Appointments() {
  const [schools, setSchools] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [form, setForm] = useState({ status: 'Pending', date: '', time: '', description: '' });
  const [filters, setFilters] = useState({
    school_name: '', phone: '', state: '', district: '', area: '', status: '', incharge: ''
  });

  const pendingReasons = [
    "Share details through WhatsApp",
    "Call not answered",
    "Number invalid",
    "Appointment on July",
    "Appointment on June",
    "Not interested",
    "Registered with other Olympiad",
    "Already visited",
    "They will callback",
    "Not reachable",
    "Already written other Olympiads",
    "Share details through mail",
    "Call me later",
    "Already written SOF / SEMs Olympiads",
    "Others"
  ];

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/schools/')
      .then(res => res.json())
      .then(data => {
        setSchools(data);
        setFilteredSchools(data);
      });

    fetch('http://127.0.0.1:8000/api/appointments/')
      .then(res => res.json())
      .then(data => {
        setAppointments(data);
        setFilteredAppointments(data);
      });
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);

    const result = appointments.filter(app =>
      Object.keys(updatedFilters).every(
        key =>
          updatedFilters[key] === '' ||
          String(app[key] || '').toLowerCase().includes(updatedFilters[key].toLowerCase())
      )
    );
    setFilteredAppointments(result);
  };

  const handleSchoolSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const result = schools.filter(s =>
      Object.values(s).some(v => String(v).toLowerCase().includes(value))
    );
    setFilteredSchools(result);
  };

  const selectSchool = (school) => {
    setSelectedSchool(school);
    setForm({ status: 'Pending', date: '', time: '', description: '' });
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAppointment = async () => {
    if (!selectedSchool) return;

    const payload = {
      ...selectedSchool,
      ...form,
    };

    const res = await fetch('http://127.0.0.1:8000/api/appointments/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const newAppt = await res.json();
      const updated = [newAppt, ...appointments];
      setAppointments(updated);
      setFilteredAppointments(updated);
      setSelectedSchool(null);
    } else {
      alert("Failed to save appointment");
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredAppointments);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Appointments');
    XLSX.writeFile(wb, 'appointments_log.xlsx');
  };

  return (
    <div className="container py-4">
      <h2 className="text-success text-center mb-4">📅 School Appointments</h2>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search school by name, phone, district, area..."
        onChange={handleSchoolSearch}
      />

      {/* FORM: Ask Appointment */}
      {selectedSchool ? (
        <div className="card p-4 mb-4 border-success shadow-sm rounded-4">
          <h5 className="text-primary">Appointment for: <b>{selectedSchool.school_name}</b></h5>

          <div className="row g-3 mt-2">
            <div className="col-md-4">
              <label>Status</label>
              <select className="form-select" name="status" value={form.status} onChange={handleFormChange}>
                <option>Pending</option>
                <option>Fixed</option>
              </select>
            </div>

            {form.status === 'Fixed' && (
              <>
                <div className="col-md-4">
                  <label>Date</label>
                  <input type="date" className="form-control" name="date" value={form.date} onChange={handleFormChange} />
                </div>
                <div className="col-md-4">
                  <label>Time</label>
                  <input type="time" className="form-control" name="time" value={form.time} onChange={handleFormChange} />
                </div>
              </>
            )}

            <div className="col-12">
              <label>{form.status === 'Pending' ? "Pending Reason" : "Description"}</label>
              {form.status === 'Pending' ? (
                <select name="description" className="form-select" value={form.description} onChange={handleFormChange}>
                  {pendingReasons.map((reason, idx) => (
                    <option key={idx} value={reason}>{reason}</option>
                  ))}
                </select>
              ) : (
                <textarea className="form-control" name="description" rows="2" value={form.description} onChange={handleFormChange} />
              )}
            </div>

            <div className="col-12 text-end">
              <button onClick={handleAppointment} className="btn btn-success mt-3">
                ✅ Submit Appointment
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          {filteredSchools.map((school, i) => (
            <div key={i} className="col-md-6 col-lg-4 mb-3">
              <div className="card border-light shadow-sm p-3 rounded-4">
                <h5>{school.school_name}</h5>
                <p><b>📞</b> {school.phone}</p>
                <p><b>📍</b> {school.state}, {school.district}</p>
                <p><b>🏠</b> Area: {school.area}</p>
                <p><b>👤</b> Incharge: {school.incharge}</p>
                <button className="btn btn-outline-primary" onClick={() => selectSchool(school)}>
                  Ask Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Appointments Log */}
      {filteredAppointments.length > 0 && (
        <>
          <hr className="my-4" />
          <h4 className="text-center text-warning">📘 Appointment Logs</h4>

          {/* Filters */}
          <div className="row g-2 mb-3">
            {['school_name', 'phone', 'state', 'district', 'area', 'incharge', 'status'].map((field, i) => (
              <div key={i} className="col-md-2">
                <input
                  className="form-control"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  value={filters[field]}
                  onChange={handleFilterChange}
                />
              </div>
            ))}
          </div>

          {/* Export */}
          <button className="btn btn-outline-primary mb-3" onClick={exportToExcel}>
            ⬇️ Export to Excel
          </button>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-light">
                <tr>
                  <th>School</th>
                  <th>Phone</th>
                  <th>State</th>
                  <th>District</th>
                  <th>Area</th>
                  <th>Incharge</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appt, i) => (
                  <tr key={i}>
                    <td>{appt.school_name}</td>
                    <td>{appt.phone}</td>
                    <td>{appt.state}</td>
                    <td>{appt.district}</td>
                    <td>{appt.area}</td>
                    <td>{appt.incharge}</td>
                    <td>{appt.status}</td>
                    <td>{appt.date || '-'}</td>
                    <td>{appt.time || '-'}</td>
                    <td>{appt.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Appointments;
