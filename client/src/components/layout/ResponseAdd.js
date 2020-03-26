import React from 'react'
import axios from '../../config/axios'
import 'mdbreact/dist/css/mdb.css'
export default class ResponseAdd extends React.Component{
    constructor(props){
        super(props)
        this.state={
            body:'',
            
        }
    }
    handleChange =(e)=>{
        const body=e.target.value
        this.setState(()=>({ body }))
    }
    handleSubmit =(e) => {
        e.preventDefault()
        const body=this.state.body
        if(body.length===0){
            window.alert("comment can't be empty")
        }
        const formdata = {
            body
        }
        const id = this.props.id
        axios.post(`/response/${id}`,formdata)
            .then(res=>{
                console.log(res.data.response)
                this.props.handleAddResponse(res.data.response)
                this.setState(()=>({ body:'' }))
            })
            .catch(err=>console.log(err))
    }
    render() {
        return(
            <div className="container m-2">
            <form onSubmit={this.handleSubmit}>
                <div className="media">
                <img src="https://mdbootstrap.com/img/Photos/Avatars/avatar-8.jpg" alt="user profile" className="d-flex rounded-circle avatar z-depth-1-half mr-3" />
                    <div className="media-body">
                        <div className="input-group form-group basic-textarea rounded-corners">
                            <input type="textarea" onChange={this.handleChange} value={this.state.body} className="form-control z-depth-1" placeholder="Response goes here..."  /> 
                        </div>
                    </div>
                </div>
            </form>
            </div>
        )
    }
}
