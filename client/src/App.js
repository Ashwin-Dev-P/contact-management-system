//import logo from './logo.svg';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './css/modal.css'


import GlobalComponent from "./components/GlobalComponent";

import ClientDetails from "./components/Other Components/ClientDetails";
import { Provider } from 'react-redux';


//import NetworkDetector from "./components/NetworkDetector";

import store from './store'

function App() {

  return (
    <Provider store={store} >
      <div className="App">
        <ClientDetails />
        <GlobalComponent />
      </div>
    </Provider>

  );
}
//Warnigns need to be solved other than Route
//CollegeStudent.js and detailedView are same. So replace collegeStudent component with detailed view
export default App;
