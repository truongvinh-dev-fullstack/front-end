import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { CRUD_Actions, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import TableManageAccount from "./TableManageAccount";

class ManageAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      role: "",

      userEditId: "",
      action: CRUD_Actions.CREATE,
    };
  }

  async componentDidMount() {}

  componentDidUpdate(prevProps, prevState, snapshot) {}

  onChangeInput = (event, id) => {
    // let copyState = { ...this.state };
    // copyState[id] = event.target.value;
    // this.setState({
    //   ...copyState,
    // });
  };

  checkValidateInput = () => {
    // let isValid = true;
    // let arrCheck = [
    //   "email",
    //   "password",
    //   "firstname",
    //   "lastname",
    //   "address",
    //   "phonenumber",
    //   "gender",
    //   "role",
    //   "position",
    // ];
    // for (let i = 0; i < arrCheck.length; i++) {
    //   if (!this.state[arrCheck[i]]) {
    //     isValid = false;
    //     alert("This input missing " + arrCheck[i]);
    //     break;
    //   }
    // }
    // return isValid;
  };

  handleSaveUser = () => {
    // console.log("Check state for edit: ", this.state);
    // let isValid = this.checkValidateInput();
    // if (isValid === false) return;
    // let { action } = this.state;
    // if (action === CRUD_Actions.CREATE) {
    //   this.props.createNewUser({
    //     email: this.state.email,
    //     password: this.state.password,
    //     firstname: this.state.firstname,
    //     lastname: this.state.lastname,
    //     address: this.state.address,
    //     phonenumber: this.state.phonenumber,
    //     gender: this.state.gender,
    //     roleId: this.state.role,
    //     positionId: this.state.position,
    //     image: this.state.image,
    //   });
    // }
    // if (action === CRUD_Actions.EDIT) {
    //   this.props.editUserRedux({
    //     id: this.state.userEditId,
    //     email: this.state.email,
    //     firstname: this.state.firstname,
    //     lastname: this.state.lastname,
    //     address: this.state.address,
    //     phonenumber: this.state.phonenumber,
    //     gender: this.state.gender,
    //     roleId: this.state.role,
    //     positionId: this.state.position,
    //     image: this.state.image,
    //   });
    // }
  };

  handleEditUserFromParent = (user) => {
    // this.setState({
    //   email: user.email,
    //   password: "*********",
    //   firstname: user.firstname,
    //   lastname: user.lastname,
    //   address: user.address,
    //   phonenumber: user.phonenumber,
    //   image: user.image,
    //   role: user.roleId,
    //   position: user.positionId,
    //   gender: user.gender,
    //   action: CRUD_Actions.EDIT,
    //   userEditId: user.id,
    //   previewImgUrl: imageBase64,
    // });
  };
  render() {
    console.log("Check state: ", this.state);
    let { email, password, firstname, lastname, role } = this.state;

    return (
      <React.Fragment>
        <div className="react-redux-container">
          <div className="title">User Redux</div>
          <div className="react-redux-body">
            <div className="container">
              <div className="row">
                <div
                  className="col-12 my-3
                "
                >
                  <span>Create new account</span>
                </div>
                <div className="col-6">
                  <label>Email</label>
                  <input
                    className="form-control"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      this.onChangeInput(e, "email");
                    }}
                  />
                </div>
                <div className="col-6">
                  <label>Password</label>
                  <input
                    className="form-control"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      this.onChangeInput(e, "password");
                    }}
                  />
                </div>
                <div className="col-6">
                  <label>First Name</label>
                  <input
                    className="form-control"
                    type="text"
                    value={firstname}
                    onChange={(e) => {
                      this.onChangeInput(e, "firstname");
                    }}
                  />
                </div>
                <div className="col-6">
                  <label>Last Name</label>
                  <input
                    className="form-control"
                    type="text"
                    value={lastname}
                    onChange={(e) => {
                      this.onChangeInput(e, "lastname");
                    }}
                  />
                </div>

                <div class="col-3 mt-3">
                  <label>Role</label>
                  <select
                    class="form-control"
                    value={role}
                    onChange={(e) => {
                      this.onChangeInput(e, "role");
                    }}
                  >
                    <option>Admin</option>
                    <option>QA-manage</option>
                    <option>QA-Coordinator</option>
                    <option>Staff</option>
                  </select>
                </div>

                <div className="col-12 mt-3">
                  <button
                    className={
                      this.state.action === CRUD_Actions.EDIT
                        ? "btn btn-warning"
                        : "btn btn-primary"
                    }
                    style={{ padding: "inherit" }}
                    onClick={() => {
                      this.handleSaveUser();
                    }}
                  >
                    <FormattedMessage
                      id={
                        this.state.action === CRUD_Actions.EDIT
                          ? "Upload"
                          : "Save"
                      }
                    />
                  </button>
                </div>
                <div className="col-12">
                  <TableManageAccount
                  // handleEditUserFromParent={this.handleEditUserFromParent}
                  // action={this.state.action}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    // language: state.app.language,
    // genderRedux: state.admin.genders,
    // isGetGender: state.admin.isLoadingGender,
    // roleRedux: state.admin.roles,
    // positionRedux: state.admin.positions,
    listUsers: state.admin.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // getPositionStart: () => dispatch(actions.fetchPositionStart()),
    // getRoleStart: () => dispatch(actions.fetchRoleStart()),
    // createNewUser: (data) => dispatch(actions.createNewUser(data)),
    // editUserRedux: (data) => dispatch(actions.EditUserStart(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageAccount);
