import React from "react";
import { Link } from "react-router-dom";

const ProfileActions = () => {
  return (
    <div className="btn-group mb-4 dashboard-control" role="group">
      <Link to="/edit-profile" className="btn btn-light">
        <i className="fas fa-user-circle"></i> Edit Profile
      </Link>
      <Link to="/add-experience" className="btn btn-light">
        <i className="fab fa-black-tie"></i>
        {"  "}Add Experience
      </Link>
      <Link to="/add-education" className="btn btn-light">
        <i className="fas fa-graduation-cap"></i>
        {"  "}Add Education
      </Link>
    </div>
  );
};

export default ProfileActions;
