import React from 'react'
import axios from '../../config/axios'
import { Link } from 'react-router-dom'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

class TopicList extends React.Component {
    constructor(){
        super()
        this.state={
            topics:[],
            name:'',
            isloaded:false,
            dropdownOpen: false
        }
    }
    toggle = () =>{
        this.setState(prevState=>({ dropdownOpen: !prevState.dropdownOpen }))
    }
    handleChange = (e) =>{
        const name=e.target.value
        this.setState(()=>({ name }))
    }
    handleSubmit = (e) => {
        e.preventDefault()
        const data={
            name:this.state.name
        }
        console.log(data)
        axios.post('/topic',data)
            .then((res) => {
                this.setState((prevState)=>({ 
                    topics:[...prevState.topics,res.data]
                }))
                this.props.history.push(`/topic/${res.data._id}`)
        })
            .catch(err=>console.log(err))
    }
    componentDidMount(){
        axios.get("/topic")
            .then(res=> this.setState(()=>({ 
                topics:res.data,
                isloaded:true 
            })))
            .catch(err=> console.log(err))
    }
    render(){
        return (
                <div className="text-center">
                    {
                        this.state.isloaded ? (
                            <div>
                            <Dropdown isOpen={this.state.dropdownOpen} size="lg" toggle={this.toggle}>
                                <DropdownToggle className="btn btn-white btn-lg" caret>
                                    Select A Topic
                                </DropdownToggle>
                                <DropdownMenu>
                                    {
                                        this.state.topics.map(category=>{
                                            return(
                                                <Link to={`/topic/${category._id}`}  key={category._id} >
                                                    <DropdownItem>{category.name}</DropdownItem>
                                                </Link>
                                            )
                                        })
                                    }
                                </DropdownMenu>
                            </Dropdown>
                            <div  className="m-2">
                                <form className="form" onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <input type="text" placeholder="Add New Topic" className="form-control" onChange={this.handleChange} />
                                    </div>
                                </form>
                            </div>
                            </div>
                        ):<h2>Loading...</h2>
                    }
                </div>
          )
    }
}
  export default TopicList