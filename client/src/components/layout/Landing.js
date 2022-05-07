// Keep in mind that the Anchor tag will be changed to Link tag
// Because the Link components is the one used to link routes

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import logo from "../../img/logo512.png";

class Landing extends Component {
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  render() {
    return (
      <div className="landing">
        <div className="dark-overlay landing-inner text-light">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <img className="landing-logo" src={logo} alt="connectus" />
                <p className="lead mt-4 cta-copy">
                  {" "}
                  If you're looking to find a romantic match, obtain new
                  employment opportunities, find like-minded individuals, or get
                  involved in the politics of your community
                </p>
                <h2 className="display-4 mb-4">
                  <span className="bold-title">connectus</span> is your
                  destination
                </h2>
                <hr />
                <div className="divider">
                  <Link to="/register" className="btn btn-lg mr-2 blue">
                    Sign Up
                  </Link>
                  <Link to="/login" className="btn btn-lg btn-light white">
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Landing);
