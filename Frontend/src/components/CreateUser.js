import React, {useState} from 'react'
import axios from "axios";
import './createUser.scss'

const CreateUser = (props) => {
    const[state, setState] = useState({"username": "", "email" : "", "password" : ""})
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        await axios({
            method: 'POST',
            url: 'http://34.125.21.171:5000/user',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
            params: {
                "username" : state.username,
                "email" : state.email,
                "password" : state.password
            }
        }).then((response) => {
            console.log("create")
            window.location.reload();
        }, (error) => {
            console.log(error);
        });
    }

    return (
        <div className='createUser'>
            <form className="form" onSubmit={handleFormSubmit}>
                <label>{parseInt(localStorage.getItem("language")) === 0 ? "Username" : "Nume de utilizator"}: <input required name="Username" onChange={e => setState({...state, username: e.target.value})} value={state.username}/></label>
                <label>Email: <input required name="Email" type="email" onChange={e => setState({...state, email: e.target.value})} value={state.email}/></label>
                <label>{parseInt(localStorage.getItem("language")) === 0 ? "Password" : "Parola"}: <input required name="Password" type="password" onChange={e => setState({...state, password: e.target.value})} value={state.password}/></label>
                <button type="submit">{parseInt(localStorage.getItem("language")) === 0 ? "Create" : "Adauga"}</button>
            </form>
        </div>
    );
}

export default CreateUser
