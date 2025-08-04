import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

function Appointments() {
  const [schools, setSchools] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [form, setForm] = useState({ status: 'Pending', date: '', time: '', description: '' });
  const [filters, setFilters] = useState({
    school_name: '', phone: '', state: '', district: '', area: '', status: ''
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
        setFiltered(data);
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
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    const result = appointments.filter(app => {
      return Object.keys(newFilters).every(key =>
        newFilters[key] === '' || String(app[key] || '').toLowerCase().includes(newFilters[key].toLowerCase())
      );
    });
    setFilteredAppointments(result);
  };

  const handleSchoolSearch = (e) => {
    const val = e.target.value.toLowerCase();
    const results = schools.filter(s =>
      Object.values(s).some(v => String(v).toLowerCase().includes(val))
    );
    setFiltered(results);
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
      setAppointments([newAppt, ...appointments]);
      setFilteredAppointments([newAppt, ...filteredAppointments]);
      setSelectedSchool(null);
    } else {
      alert('Failed to save appointment');
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
        placeholder="Search school by name, phone, district..."
        onChange={handleSchoolSearch}
      />

      {selectedSchool ? (
        <div className="card p-4 mb-4 shadow-sm border border-success rounded-4">
          <h5 className="mb-3 text-primary">
            Set Appointment for: <b>{selectedSchool.school_name}</b>
          </h5>

          <div className="row g-3">
            <div className="col-md-4">
              <label>Status</label>
              <select name="status" className="form-select" value={form.status} onChange={handleFormChange}>
                <option>Pending</option>
                <option>Fixed</option>
              </select>
            </div>

            {form.status === 'Fixed' && (
              <>
                <div className="col-md-4">
                  <label>Date</label>
                  <input type="date" name="date" className="form-control" value={form.date} onChange={handleFormChange} />
                </div>
                <div className="col-md-4">
                  <label>Time</label>
                  <input type="time" name="time" className="form-control" value={form.time} onChange={handleFormChange} />
                </div>
              </>
            )}

            <div className="col-12">
              <label>{form.status === 'Fixed' ? 'Description' : 'Reason for pending'}</label>
              {form.status === 'Pending' ? (
                <select name="description" className="form-select" value={form.description} onChange={handleFormChange}>
                  {pendingReasons.map((reason, i) => (
                    <option key={i} value={reason}>{reason}</option>
                  ))}
                </select>
              ) : (
                <textarea
                  name="description"
                  className="form-control"
                  rows="2"
                  value={form.description}
                  onChange={handleFormChange}
                />
              )}
            </div>
          </div>

          <button onClick={handleAppointment} className="btn btn-success mt-3">
            Save Appointment
          </button>
        </div>
      ) : (
        <div className="row">
          {filtered.map((school, i) => (
            <div key={i} className="col-md-6 col-lg-4 mb-3">
              <div className="card shadow p-3 border border-light rounded-4">
                <h5>{school.school_name}</h5>
                <p><strong>Phone:</strong> {school.phone}</p>
                <p><strong>State:</strong> {school.state}</p>
                <p><strong>District:</strong> {school.district}</p>
                <p><strong>Area:</strong> {school.area}</p>
                <button onClick={() => selectSchool(school)} className="btn btn-outline-primary mt-2">
                  Ask Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {appointments.length > 0 && (
        <>
          <hr className="my-4" />
          <h4 className="text-center text-warning">📝 Appointments Log</h4>

          {/* Filters */}
          <div className="row mb-3 g-2">
            {['school_name', 'phone', 'state', 'district', 'area', 'status'].map((field, i) => (
              <div className="col-md-2" key={i}>
                <input
                  name={field}
                  placeholder={field.replace('_', ' ')}
                  className="form-control"
                  value={filters[field]}
                  onChange={handleFilterChange}
                />
              </div>
            ))}
          </div>

          {/* Excel export */}
          <button className="btn btn-outline-primary mb-3" onClick={exportToExcel}>
            ⬇️ Export to Excel
          </button>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-bordered mt-2">
              <thead className="table-secondary">
                <tr>
                  <th>School Name</th>
                  <th>Phone</th>
                  <th>State</th>
                  <th>District</th>
                  <th>Area</th>
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
