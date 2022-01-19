import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

//import PersonList from './PersonList';
import DetailedView from "./Member Detail Components/DetailedView";
import CategoryList from "./CategoryList";
import CategorySortedList from "./CategorySortedList";
//import NotFound from './NotFound';

import PrivateRoute from "./Routes/PrivateRoute";

//College
import CollegeList from "./Category Components/College Components/CollegeList";
import CollegeBatches from "./Category Components/College Components/CollegeBatches";
import DepartmentList from "./Category Components/College Components/DepartmentList";
import SectionList from "./Category Components/College Components/SectionList";
import CollegeStudentList from "./Category Components/College Components/CollegeStudentList";

//School
import SchoolList from "./Category Components/School Components/SchoolList";
import SchoolMembersList from "./Category Components/School Components/SchoolMembersList";

//Company
import CompanyList from "./Category Components/Company Components/CompanyList";
import CompanyMembersList from "./Category Components/Company Components/CompanyMembersList";

//Admin
import AdminMain from "./Admin Components/AdminMain";
import Singleton from "./Admin Components/Singleton";
import EditSingleton from "./Admin Components/EditSingleton";
import AdminAboutUs from "./Admin Components/AdminAboutUs";
import AdminClientDetails from "./Admin Components/AdminClientDetails";

//Navbar components
import Login from "./Login";
import Registration from "./Registration";
import ContactUs from "./ContactUs";

//Profile
import MyProfile from "./MyProfile";
import MyContacts from "./Profile/MyContacts";
import EditAccountType from "./Profile/EditAccountType";
import SelectAccountType from "./Profile/SelectAccountType";
import EditBasicDetails from "./Profile/EditBasicDetails";
import EditContactDetails from "./Profile/EditContactDetails";
import Search from "./Search";
import AllMembers from "./AllMembers";
import Settings from "./Settings/Settings";
import Home from "./Home";
import AboutUs from "./AboutUs";
import { getCookie } from "../functions/getCookie";
import AdminContactMessages from "./Admin Components/AdminContactMessages";

export default class RoutesComponent extends Component {
  constructor(props) {
    super(props);

    this.loginHandler = this.loginHandler.bind(this);
    this.state = {
      loggedIn: this.props.loggedIn || false,
    };

    if (getCookie("loggedIn") === "true") {
      this.state = {
        loggedIn: true,
      };
    }
  }

  //Changes the loggedIn state of this Routes component from the login component
  loginHandler() {
    this.setState({
      loggedIn: true,
    });
    this.props.loginHandler();
  }

  render() {
    return (
      <div>
        <PrivateRoute component={AdminMain} path="/admin" exact />
        <PrivateRoute component={Singleton} path="/admin/singleton" exact />
        <PrivateRoute
          component={EditSingleton}
          path="/admin/singleton/edit"
          exact
        />
        <PrivateRoute component={AdminAboutUs} path="/admin/about_us" exact />
        <PrivateRoute
          component={AdminClientDetails}
          path="/admin/client_details"
          exact
        />
        <PrivateRoute
          component={AdminContactMessages}
          path="/admin/messages"
          exact
        />

        <Route exact path="/">
          <Home />
        </Route>

        <Route exact path="/register">
          <Registration loginAction={this.loginHandler} />
        </Route>

        <Route exact path="/login">
          <Login
            loginHandler={this.loginHandler}
            logoutHandler={this.props.logoutHandler}
          />
        </Route>

        <Route exact path="/:admin/login">
          <Login
            loginHandler={this.loginHandler}
            logoutHandler={this.props.logoutHandler}
          />
        </Route>

        <PrivateRoute
          component={SelectAccountType}
          path="/account/select_account_type"
          exact
        />
        <PrivateRoute
          component={EditAccountType}
          path="/account/account_type"
          exact
        />

        <Route exact path="/contact_us">
          <ContactUs />
        </Route>
        <Route exact path="/about_us">
          <AboutUs />
        </Route>
        <PrivateRoute component={MyProfile} path="/my_profile" exact />
        <PrivateRoute component={MyContacts} path="/my_contacts" exact />
        <PrivateRoute component={Settings} path="/settings" exact />

        <PrivateRoute
          component={EditBasicDetails}
          path="/account/edit_basic_details"
          exact
        />

        <PrivateRoute
          component={EditContactDetails}
          path="/account/edit_contact_details"
          exact
        />

        <Route exact path="/search">
          <Search />
        </Route>

        <Route exact path="/data">
          {/*<PersonList />*/}
          <AllMembers />
        </Route>

        <Route exact path="/category/college" component={CollegeList}></Route>

        <Route exact path="/category/company" component={CompanyList}></Route>

        <Route exact path="/category/school" component={SchoolList}></Route>

        <Route
          exact
          path="/category/general"
          component={CategorySortedList}
        ></Route>
        {/*
                        <Route exact path="/category/:type" component={CategorySortedList} >

                        </Route>
                        */}

        <Route exact path="/category">
          <CategoryList />
        </Route>

        <Route
          exact
          path="/company/:company_id"
          component={CompanyMembersList}
        ></Route>

        <Route
          exact
          path="/school/:school_id"
          component={SchoolMembersList}
        ></Route>

        <Route
          exact
          path="/college/:college_id/batch/:batch_id"
          component={DepartmentList}
        ></Route>

        <Route
          exact
          path="/college/:college_id"
          component={CollegeBatches}
        ></Route>
        <Route
          exact
          path="/department/:department_id/section/:section"
          component={SectionList}
        >
          Students
        </Route>

        <Route
          exact
          path="/department/:department_id"
          component={SectionList}
        ></Route>

        <Route
          exact
          path="/section/:section_id"
          component={CollegeStudentList}
        ></Route>
        {/*<Route exact path="/member/:member_id" component={CollegeStudent} />*/}

        <Route exact path="/details/:id" component={DetailedView} />
      </div>
    );
  }
}
