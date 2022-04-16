import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import UserManage from "../containers/System/Admin/UserManage";
import ProductManage from "../containers/System/ProductManage";
import RegisterPackageGroupOrAcc from "../containers/System/RegisterPackageGroupOrAcc";
import Header from "../containers/Header/Header";
import ManageTopics from "../containers/System/Admin/ManageTopics";
import ViewIdeas from "../containers/System/ViewIdeas";
import ViewStaff from "../containers/System/ViewStaff";
import ManageIdeaByStaff from "../containers/System/ManageIdeaByStaff";

class System extends Component {
  render() {
    const { systemMenuPath, isLoggedIn } = this.props;
    return (
      <React.Fragment>
        {isLoggedIn && <Header />}
        <div className="system-container">
          <div className="system-list">
            <Switch>
              <Route path="/system/user-manage" component={UserManage} />
              <Route path="/system/topics-manage" component={ManageTopics} />
              <Route path="/system/product-manage" component={ProductManage} />
              <Route path="/system/view-ideas" component={ViewIdeas} />
              <Route path="/system/view-staff" component={ViewStaff} />
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
