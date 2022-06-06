import React, {useState} from 'react'
import axios from "axios";
import './createProduct.scss'

const CreateProduct = (props) => {
    const [state, setState] = useState({"name": "", "author": ""});
    const [carte, setSelectedFile] = useState(null);
    const form = new FormData();
    form.append("book", carte);
    form.append("name", state.name);
    form.append("author", state.author);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://34.125.21.171:5000/book', form, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token"),
                "Content-Type": "multipart/form-data"
            },
            params: {
                    "name": state.name,
                    "author": state.author,
                },
        }).then((response) => {
            console.log(response);
            console.log("create");
        }, (error) => {
            console.log(props.book);
            console.log(error);
        });
    }
    // await axios({
    //     form,
    //     method: 'POST',
    //     url: 'http://34.125.21.171:5000/book',
    //     headers: {
    //         'Authorization': 'Bearer ' + localStorage.getItem("token"),
    //         "Content-Type": "multipart/form-data; boundary=<calculated when request is sent>"
    //     },
    // params: {
    //
    //     "book": carte,
    // },
    // files: {
    //     // "book": form,
    //     "book": carte,
    // }
    //     }).then((response) => {
    //         console.log("create")
    //         window.location.reload();
    //     }, (error) => {
    //         window.location.reload();
    //         console.log(props.book);
    //         console.log(error);
    //     });
    // }

    return (
        <div className='createProduct'>
            <form className="form" onSubmit={handleFormSubmit}>
                <label>{parseInt(localStorage.getItem("language")) === 0 ? "Name" : "Nume"}: <input required name="Name"
                                                                                                    placeholder={props.name}
                                                                                                    onChange={e => setState({
                                                                                                        ...state,
                                                                                                        name: e.target.value
                                                                                                    })}
                                                                                                    value={state.name}/></label>
                <label>{parseInt(localStorage.getItem("language")) === 0 ? "Author" : "Autor"}: <input required
                                                                                                       name="Author"
                                                                                                       placeholder={props.author}
                                                                                                       onChange={e => setState({
                                                                                                           ...state,
                                                                                                           author: e.target.value
                                                                                                       })}
                                                                                                       value={state.author}/></label>
                <div class="file-upload">
                    <input type="file" accept=".pdf" name="file" id="idFile"
                           onChange={e => setSelectedFile(e.target.files[0])}/>
                </div>
                <button type="submit">{parseInt(localStorage.getItem("language")) === 0 ? "Create" : "Adauga"}</button>
            </form>
        </div>
    );
}
export default CreateProduct
