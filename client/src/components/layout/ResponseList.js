import React from 'react'
import axios from '../../config/axios'
import 'mdbreact/dist/css/mdb.css';
import  { MDBIcon }  from "mdbreact"
export default class ResponseList extends React.Component{
    componentDidMount(){
        const id = this.props.id
        axios.get(`/response/${id}`)
            .then(res=> {
                this.props.handleResponse(res.data)
            })
            .catch(err=> console.log(err))
    }
    render() {
        return(
            <div className="container-fluid">
                    {
                        this.props.response.map(data=>{
                            return (
                                <div className="media mb-3" key={data._id} >
                                <MDBIcon className="ml-2" icon="user-circle" size="5x"/>

                                    <div className="media-body p-2 shadow-sm rounded bg-light border">
                                        <small className="float-right text-muted">{data.createdAt.slice(11,16)}</small>
                                        <h6 className="mt-0 mb-1 text-muted font-weight-bold">user</h6>
                                        {data.body}
                                    </div>
                                </div>
                            )
                        })
                    }
            </div>
        )
    }
}
