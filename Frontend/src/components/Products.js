import React, {useEffect, useState} from 'react'
import Product from "./Product";
import axios from "axios";
import './products.scss'

const Products = (props) => {
    const[state, setState] = useState({"products" : []})

    const getProducts = async () => {
        //console.log(localStorage.getItem("token"))
        await axios({
            method: 'GET',
            url: 'http://34.125.21.171:5000/book',
            headers: {
                'Authorization': 'Bearer '+ localStorage.getItem("token")
            }
        }).then((response) => {
            const lst = response.data["books"].map(obj => ({name: obj.name,
                author: obj.author, remote_id: obj.remote_id}));
            setState({"products" : lst})
        }, (error) => {
            console.log(error);
        })
    }

    useEffect(() => {
        getProducts();
    }, [])

    return (
        <div className='products'>
            {state.products.map(prod => {
                return <Product name={prod.name.toString()} author={prod.author.toString()} remote_id={prod.remote_id.toString()} />
            })}
        </div>
    );
}

export default Products
