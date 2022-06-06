import React, {useState} from 'react'
import './user.scss'
import axios from "axios";
import UpdateUserForm from "./UpdateUserForm";

const User = (props) => {
    const [state, setState] = useState(false)
    const deleteUser = async () => {
        const url = 'http://localhost/api/users/' + props.id;
        await axios({
            method: 'DELETE',
            url: url,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        }).then((response) => {
            console.log("delete");
            window.location.reload();
        }, (error) => {
            console.log(error);
        })

    }

    const updateUser = () => {
        setState(true)
        console.log("update");
    }

    let role = ""

    if (parseInt(props.role_id) === 1) {
        role = "ADMIN";
    } else {
        if (parseInt(props.role_id) === 2) {
            role = "MANAGER"
        } else {
            role = "USER"
        }
    }

    if (state) {
        return (
            <div key={props.id} className='user'>
                <div className='userHelper'>
                    <p>Username: {props.username}</p>
                    <p>Email: {props.email}</p>
                    <p>Role: {role}</p>
                    <div className='buttons'>
                        <button className='button' type="button" onClick={deleteUser}>
                            {parseInt(localStorage.getItem("language")) === 0 ? "Delete User" : "Sterge utilizator"}
                        </button>
                    </div>
                </div>
                <UpdateUserForm username={props.username} email={props.email} role_id={props.role_id} id={props.id}/>
            </div>

        );
    }
    return (
        <div key={props.id} className='user'>
            <div className='userHelper'>
                <p>Username: {props.username}</p>
                <p>Email: {props.email}</p>
                <p>Role: {role}</p>
                <div className='buttons'>
                    <button className='button' type="button" onClick={deleteUser}>
                        {parseInt(localStorage.getItem("language")) === 0 ? "Delete User" : "Sterge utilizator"}
                    </button>
                    <button className='button' type="button" onClick={updateUser}>
                        {parseInt(localStorage.getItem("language")) === 0 ? "Update User" : "Actualizare utilizator"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default User
