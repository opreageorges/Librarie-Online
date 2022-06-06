import './App.css';
import {HashRouter, Route, Switch, useRoutes} from "react-router-dom";
//import Footer from "./components/Footer";
import Register from "./components/Register";
import Login from "./components/Login";
import FirstPage from "./components/FirstPage";
import Loggedin from "./components/LoggedIn";

function App() {

    function AppRoutes() {
        const routes = useRoutes(
            [
                {path:'/',element:<FirstPage/>},
                {path: '/login', element:<Login/>},
                {path: '/register', element:<Register/>},
                {path: '/loggedin', element:<Loggedin/>}
            ]
        )
        return routes;
    }

    return (
      <div className="App">
          <AppRoutes/>
      </div>
    );
}

export default App;
