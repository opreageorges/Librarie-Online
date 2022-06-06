import React from 'react'
import {ReactComponent} from '../Logo.svg'
import "./firstPage.scss"
import "./Login"
import {useNavigate } from "react-router-dom";

const FirstPage = (props) => {
    const navigate = useNavigate()
    return (
        <div className="FirstPage">
            <div className="imgLogo">
                <img src="../logo.jpg" alt="Logo"/>
            </div>
            <div className="img"><ReactComponent/></div>
            <div className="lander">
                <h1>Online Library</h1>
                <p>A place for everybody who want knowledge</p>
                <form>
                    <button className="button" onClick={() => {navigate("/login");}}>Login</button>
                    <button className="button" onClick={() => {navigate('register');}}>Register</button>
                </form>
            </div>
        </div>

    );
}

export default FirstPage
