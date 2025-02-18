import React, { Component } from "react";
import {
  Layout, Menu, Icon, Breadcrumb
} from 'antd/lib';
import $ from 'jquery';
import {
  Link,
  NavLink,
  withRouter,
} from "react-router-dom";
import { connect } from 'react-redux';

const { Sider, Content } = Layout;

class LeftNav extends Component {
  state = {
    current: '/files',
    collapsed: false,
    selectedTopNav: this.props.selectedTopNav
  };

  componentDidUpdate() {
    $('[data-toggle="popover"]').popover({placement : 'right', trigger: 'focus', title: 'Application', html:true, content:'Please select an application from the dropdown or create a new application using Applications option under Settings'});
    var _self=this;
    $('[data-toggle="popover"]').click(function(event) {
      if(!_self.props.application || _self.props.application.applicationId == '') {
        event.preventDefault();
      }
    })
  }

  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  }

  render() {
    const selectedTopNav = window.location.pathname;
    const applicationId = this.props.application ? this.props.application.applicationId : '';
    if(!this.props.loggedIn) {
      this.props.history.push("/login");
      return false;
    }
    const isAdmin = (this.props.user && this.props.user.role == 'admin') ? true : false;
    //render the LeftNav only if an application is selected
    /*if((!this.props.isApplicationSet && (selectedTopNav == "/files")) || selectedTopNav == '/login')
      return false;*/
    if(selectedTopNav == '/login')
        return false;
    return (
      <React.Fragment>
      <Sider style={{ background: '#343a40', height: '100vh', position: 'fixed', paddingTop:"60px" }}
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
      >
          <nav className="d-md-block bg-dark sidebar">
          <div className="sidebar-sticky">
            <ul className="nav flex-column">
              <li className="nav-item" >
                <NavLink exact to={"/"+applicationId+"/files"} className="nav-link" data-toggle="popover" tabIndex="1"><i className="fa fa-lg fa-file"></i> Files</NavLink>
              </li>
              <li className="nav-item">
                <NavLink exact to={"/"+applicationId+"/index"} className="nav-link" data-toggle="popover" tabIndex="2"><i className="fa fa-lg fa-indent"></i> Index</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to={"/"+applicationId+"/queries"} className="nav-link" data-toggle="popover" tabIndex="3"><i className="fa fa-lg fa-search"></i> Queries</NavLink>
              </li>
              <li className="nav-item" >
                <NavLink to={"/"+applicationId+"/jobs"} className="nav-link" data-toggle="popover" tabIndex="4"><i className="fa fa-lg fa-clock-o"></i> Jobs</NavLink>
              </li>
              <li className="nav-item" >
                <NavLink to={"/"+applicationId+"/chart"} className="nav-link" data-toggle="popover" tabIndex="5"><i className="fa fa-lg fa-bar-chart"></i> Report</NavLink>
              </li>
            </ul>

            <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
              <span>Settings</span>
              <a className="d-flex align-items-center text-muted" href="#">
                <span data-feather="plus-circle"></span>
              </a>
            </h6>
            <ul className="nav flex-column mb-2">
              <li className="nav-item">
                <NavLink to={"/admin/applications"} className="nav-link"><i className="fa fa-lg fa-desktop"></i> Applications</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to={"/admin/clusters"} className="nav-link"><i className="fa fa-lg fa-server"></i> Clusters</NavLink>
              </li>
            </ul>
            { isAdmin ?
            <React.Fragment>
            <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
              <span>Admin</span>
              <a className="d-flex align-items-center text-muted" href="#">
                <span data-feather="plus-circle"></span>
              </a>
            </h6>

            <ul className="nav flex-column mb-2">
              <li className="nav-item">
                <NavLink to={"/admin/users"} className="nav-link"><i className="fa fa-lg fa-desktop"></i> Users</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to={"/admin/consumers"} className="nav-link"><i className='fa fa-lg fa-user-circle'></i> Consumers</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to={"/admin/controlsAndRegulations"} className="nav-link"><i className='fa fa-lg fa-address-card-o'></i> Controls & Regulations</NavLink>
              </li>
            </ul>
            </React.Fragment>
            : null}
          </div>
        </nav>

      </Sider>
    </React.Fragment>
    );
  }

}

function mapStateToProps(state) {
  const { application, selectedTopNav } = state.applicationReducer;
  const { loggedIn, user} = state.authenticationReducer;
  return {
      application,
      selectedTopNav,
      loggedIn,
      user
  };
}

const connectedLeftNav = connect(mapStateToProps)(withRouter(LeftNav));
export { connectedLeftNav as LeftNav };

//export default withRouter(LeftNav);