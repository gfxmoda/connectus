// Because there's no life cycle moethod usage in this footer particularly,
// we'll be using the functional component instead of the class component
import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";

class Footer extends Component {
  render() {
    // const { auth } = this.props;
    const { isAuthenticated } = this.props.auth;
    return (
      <footer
        className={classnames(
          "bg-dark text-white mt-5 p-4 text-center app-footer",
          {
            "footer": !isAuthenticated,
          }
        )}
      >
        Copyright &copy; {new Date().getFullYear()}{" "}
        <span className="bold-title">connectus</span>. All rights reserved.
      </footer>
    );
  }
}

Footer.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Footer);
