import React, {useState} from 'react'
import './updateUserForm.scss'
import axios from "axios";

const UpdateUserForm = (props) => {
    const[state, setState] = useState({"username": "", "email" : "", "role_id" : ""})

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        await axios({
            method: 'PUT',
            url: 'http://localhost/api/users',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
            data: {
                "id" : props.id,
                "username" : state.username,
                "email" : state.email,
                "role_id" : state.role_id
            }
        }).then((response) => {
            console.log("update form")
            window.location.reload();
        }, (error) => {
            console.log(error);
        });
    }

    return (
        <div className='updateUserForm'>
            <form className="form" onSubmit={handleFormSubmit}>
                <label>Username: <input required name="Username" placeholder={props.username} onChange={e => setState({...state, username: e.target.value})} value={state.username}/></label>
                <label>Email: <input required name="Email" placeholder={props.email} type="email" onChange={e => setState({...state, email: e.target.value})} value={state.email}/></label>
                <p>1 - ADMIN</p>
                <p>2 - MANAGER</p>
                <p>3 - USER</p>
                <label>{parseInt(localStorage.getItem("language")) === 0 ? "Role Id" : "Identificator tip utilizator"}:
                    <input required name="Role Id" placeholder={props.role_id} onChange={e => setState({...state, role_id: e.target.value})} value={state.role_id}/></label>
                <button type="submit">{parseInt(localStorage.getItem("language")) === 0 ? "Update" : "Actualizeaza utilizator"}</button>
            </form>
        </div>
    );
}

export default UpdateUserForm
