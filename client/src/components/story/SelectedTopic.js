import React from 'react'
import { Link } from 'react-router-dom'
import StoryList from './StoryList'
import axios from '../../config/axios';
class SelectedTopic extends React.Component{
    constructor(props){
        super(props)
        this.state={
            topic:{},
            isloaded:false
        }
    }
    componentDidMount(){
        const id= this.props.match.params.id
        axios.get(`/topic/${id}`)
            .then((res)=>this.setState(()=>({ 
                topic:res.data,
                isloaded:true 
            })))
            .catch(err=>console.log(err))

    }
    render(){
        console.log(this.state.topic._id)
        return (
            <div className=" container">
            {
                this.state.isloaded && (
                    <div className=" container">
                        <div className="font-weight-bold">
                            Topic Selected -: <h1 className="text-center font-weight-bold">{this.state.topic.name} </h1>
                        </div> 
                        <div  className="text-center m-2">
                            <Link to={`/story/new/${this.state.topic._id}`}>Add New Story</Link>
                            <StoryList id={this.state.topic._id}/>
                        </div>
                    </div>
                )
            }
                
            </div>
        )
    }
}
export default SelectedTopic