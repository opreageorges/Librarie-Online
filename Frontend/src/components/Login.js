import React, {useState} from 'react'
import {ReactComponent} from "../Logo.svg";
import axios from 'axios';
import './login.scss'
import {Link} from "react-router-dom";
import {useNavigate } from "react-router-dom";

const Login = (props) => {
    const[state, setState] = useState({"username": "", "password" : ""})
    const navigate = useNavigate()
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await axios({
            method: 'GET',
            url: 'http://34.125.21.171:5000/user',
            params: {
                "username" : state.username,
                "password" : state.password
            }
        }).then((response) => {
            console.log(response.data);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("username", response.data["user"]["username"]);
            localStorage.setItem("role", response.data["user"]["isAdmin"]);
            localStorage.setItem("shoppingCart", "");
            localStorage.setItem("tabPrincipal", 0);
            localStorage.setItem("tabAdm", 0);
            localStorage.setItem("tabChat", 0);
            //0 - EN; 1 - RO
            localStorage.setItem("language", 0);
            navigate("/loggedin");
            console.log(response);
            }, (error) => {
                console.log(error);
            });
    };

    return (
            <div className="Login">
                <div className="left">
                    <p className="siteName"><Link to='/'/>Online Library</p>
                    <ReactComponent className="img"/>
                </div>
                <div className="login_form">
                    <p className="Alt">Don't have an acount? <Link to='/register'>Register</Link></p>
                    <p className="FormName">Login</p>
                    <form className="form" onSubmit={handleFormSubmit}>
                        <label>Username: <input required name="Username" onChange={e => setState({...state, username: e.target.value})} value={state.username}/></label>
                        <label>Password: <input required name="Password" type="password" onChange={e => setState({...state, password: e.target.value})} value={state.password}/></label>
                        <button className="button" type="submit">Login</button>
                    </form>
                </div>
            </div>
        );
}

export default Login
