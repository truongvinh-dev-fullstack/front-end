import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import UserManage from "../containers/System/Admin/UserManage";
import ProductManage from "../containers/System/ProductManage";
import RegisterPackageGroupOrAcc from "../containers/System/RegisterPackageGroupOrAcc";
import Header from "../containers/Header/Header";
import ManageCategory from "../containers/System/QA/ManageCategory";
import ViewIdeas from "../containers/System/ViewIdeas";
// import ViewStaff from "../containers/System/ViewStaff";
import ManageIdea from "../containers/System/Staff/ManageIdea";
import ManageIdeaByStaff from "../containers/System/ManageIdeaByStaff";
import ManageDepartment from "../containers/System/QA/ManageDepartment";
import DashboardAdmin from "../containers/System/Admin/DashboardAdmin";

class System extends Component {
  render() {
    const { systemMenuPath, isLoggedIn, userInfo } = this.props;
    console.log("check prop: ", this.props.userInfo.role == "admin");
    return (
      <React.Fragment>
        {isLoggedIn && <Header />}
        <div className="system-container">
          <div className="system-list">
            <Switch>
              {/* admin */}
              <Route
                path="/system/dashnoard-admin"
                component={DashboardAdmin}
              />
              <Route
                path="/system/user-manage"
                component={() => {
                  if (this.props.userInfo.role == "admin")
                    return <UserManage />;
                  if (userInfo.role == "staff")
                    return <Redirect to={"/system/view-ideas"} />;
                }}
              />
              <Route
                path="/system/category-manage"
                component={ManageCategory}
              />
              <Route
                path="/system/department-manage"
                component={ManageDepartment}
              />
              <Route path="/system/product-manage" component={ProductManage} />
              <Route path="/system/view-ideas" component={ViewIdeas} />
              <Route path="/system/manage-idea" component={ManageIdea} />
              <Route
                path="/system/manage-idea-by-staff"
                component={ManageIdeaByStaff}
              />
              {/* <Route
                path="/system/register-package-group-or-account"
                component={RegisterPackageGroupOrAcc}
              /> */}
              {/* <Route
                component={() => {
                  return <Redirect to={systemMenuPath} />;
                }}
              /> */}
            </Switch>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    systemMenuPath: state.app.systemMenuPath,
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
