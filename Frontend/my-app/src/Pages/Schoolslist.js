import React from 'react';
import '../Assets/Styles/Schoolslist.css';
import { Link } from 'react-router-dom';

function Schoolslist() {
  return (
    <div>
      {/* Banner Section */}
      <div className="banner text-white text-center">
        <div className="overlay">
          <h1>Ase Olympiads Schools Data</h1>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="container my-4">
        <div className="row g-3 justify-content-center">
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <Link to="/add-school">
              <button
                type="button"
                className="btn btn-success btn-lg w-100 rounded-pill fw-bold shadow-sm"
              >
                ➕ Add Schools
              </button>
            </Link>
          </div>

          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <Link to="/Search-school">
              <button
                type="button"
                className="btn btn-primary btn-lg w-100 rounded-pill fw-bold shadow-sm"
              >
                🔍 Search Schools
              </button>
            </Link>
          </div>

          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <Link to="/Appointments">
              <button
                type="button"
                className="btn btn-warning btn-lg w-100 rounded-pill fw-bold shadow-sm"
              >
                📅 Appointments
              </button>
            </Link>
          </div>

          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <Link to="/FixedAppoinemnts">
              <button
                type="button"
                className="btn btn-danger btn-lg w-100 rounded-pill fw-bold shadow-sm"
              >
                ✅ Fixed Appointments
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Schoolslist;
