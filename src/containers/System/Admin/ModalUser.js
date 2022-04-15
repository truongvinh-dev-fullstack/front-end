import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import _ from "lodash";

class ModalUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      role: "admin",
    };
  }

  componentDidMount() {
    let user = this.props.editUser;
    if (user && !_.isEmpty(user)) {
      this.setState({
        id: user.id,
        email: user.email,
        password: "hardcode",
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
      });
    }

    console.log("check did mount: ", this.props.editUser);
  }

  toggle = () => {
    this.props.toggleModalUser();
  };

  handleOnChangeInput = (e, id) => {
    let copystate = { ...this.state };
    copystate[id] = e.target.value;
    this.setState({
      ...copystate,
    });
  };

  checkValideInput = () => {
    let isValide = true;
    let arrInput = ["email", "password", "firstname", "lastname", "role"];
    for (let i = 0; i < arrInput.length; i++) {
      if (!this.state[arrInput[i]]) {
        isValide = false;
        alert("Missing parameter " + arrInput[i]);
        break;
      }
    }
    return isValide;
  };

  handleAddNewUser = () => {
    let check = this.checkValideInput();
    if (check) {
      this.props.createNewUser(this.state);
      this.setState({
        id: "",
        email: "",
        password: "",
        firstname: "",
        lastname: "",
        role: "",
      });
      console.log("Done");
    }
  };

  handleEditUser = () => {
    let check = this.checkValideInput();
    if (check) {
      this.props.DoEditUser(this.state);
      this.setState({
        email: "",
        password: "",
        firstname: "",
        lastname: "",
        role: "",
      });
      console.log("Done");
    }
  };

  render() {
    console.log("Check state model: ", this.state);
    return (
      <div>
        <Modal
          id="AddUser"
          isOpen={this.props.isOpenAdd}
          toggle={() => {
            this.toggle();
          }}
          size="lg"
          centered={true}
          className="modal-user-container"
        >
          <ModalHeader
            toggle={() => {
              this.toggle();
            }}
          >
            Create New User
          </ModalHeader>
          <ModalBody>
            <div className="modal-user-body">
              <div className="input-container">
                <label>Email</label>
                <input
                  type="text"
                  onChange={(e) => {
                    this.handleOnChangeInput(e, "email");
                  }}
                  value={this.state.email}
                />
              </div>
              <div className="input-container">
                <label>Password</label>
                <input
                  type="password"
                  onChange={(e) => {
                    this.handleOnChangeInput(e, "password");
                  }}
                  value={this.state.password}
                />
              </div>
              <div className="input-container">
                <label>First Name</label>
                <input
                  type="text"
                  onChange={(e) => {
                    this.handleOnChangeInput(e, "firstname");
                  }}
                  value={this.state.firstname}
                />
              </div>
              <div className="input-container">
                <label>Last Name</label>
                <input
                  type="text"
                  onChange={(e) => {
                    this.handleOnChangeInput(e, "lastname");
                  }}
                  value={this.state.lastname}
                />
              </div>

              <div className="input-container">
                <label>Role</label>
                <select
                  value={this.state.role}
                  onChange={(e) => {
                    this.handleOnChangeInput(e, "role");
                  }}
                >
                  <option value={"admin"}>Admin</option>
                  <option value={"staff"}>Staff</option>
                  <option value={"manage"}>QA-Manage</option>
                  <option value={"coordinator"}>QA-Coordinator</option>
                </select>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => {
                this.handleAddNewUser();
              }}
              className="px-3"
            >
              Save
            </Button>{" "}
            <Button
              onClick={() => {
                this.toggle();
              }}
              className="px-3"
            >
              Close
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          id="EditUser"
          isOpen={this.props.isOpenEdit}
          toggle={() => {
            this.toggle();
          }}
          size="lg"
          centered={true}
          className="modal-user-container"
        >
          <ModalHeader
            toggle={() => {
              this.toggle();
            }}
          >
            Edit User
          </ModalHeader>
          <ModalBody>
            <div className="modal-user-body">
              <div className="input-container">
                <label>Email</label>
                <input
                  type="text"
                  onChange={(e) => {
                    this.handleOnChangeInput(e, "email");
                  }}
                  value={this.state.email}
                  disabled
                />
              </div>
              <div className="input-container">
                <label>Password</label>
                <input
                  type="password"
                  onChange={(e) => {
                    this.handleOnChangeInput(e, "password");
                  }}
                  value={this.state.password}
                  disabled
                />
              </div>
              <div className="input-container">
                <label>First Name</label>
                <input
                  type="text"
                  onChange={(e) => {
                    this.handleOnChangeInput(e, "firstname");
                  }}
                  value={this.state.firstname}
                />
              </div>
              <div className="input-container">
                <label>Last Name</label>
                <input
                  type="text"
                  onChange={(e) => {
                    this.handleOnChangeInput(e, "lastname");
                  }}
                  value={this.state.lastname}
                />
              </div>

              <div className="input-container">
                <label>Role</label>
                <select
                  onChange={(e) => {
                    this.handleOnChangeInput(e, "role");
                  }}
                  value={this.state.role}
                >
                  <option>Admin</option>
                  <option>Staff</option>
                  <option>QA-Manage</option>
                  <option>QA-Coordinator</option>
                </select>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => {
                this.handleEditUser();
              }}
              className="px-3"
            >
              Save Change
            </Button>{" "}
            <Button
              onClick={() => {
                this.toggle();
              }}
              className="px-3"
            >
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
