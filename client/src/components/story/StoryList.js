import React from 'react'
import axios from '../../config/axios'
// import 'mdbreact/dist/css/mdb.css';
// import  { MDBIcon }  from "mdbreact"
import { Link } from 'react-router-dom'
class StoryList extends React.Component {
    constructor(){
        super()
        this.state={
            stories:[],
            limit:5
        }
    }
    handleClick =()=>{
        this.setState((prevState)=>({
            limit: prevState.limit + 5
        }))
    }
    componentDidMount(){
        console.log(this.props.id)
        if(this.props.id!==undefined){
            axios.get(`/story/topic/${this.props.id}`)
            .then(res=> {
                console.log(res.data)
                this.setState(()=>({ 
                    stories:res.data
                 })) })
            .catch(err=> console.log(err))
        }else{
            axios.get("/story")
            .then(res=> this.setState(()=>({ stories:res.data })))
            .catch(err=> console.log(err))
        }
        
    }
    render(){
        return (
                <div className="container text-center">
                    {    this.state.stories.length === 0 ? (
                            <p> No stories found. Add your first Story</p>
                        ) : 
                        (
                            <div className="m-1">
                                    {   
                                        this.state.stories.slice(0,this.state.limit).map(story => {
                                        return (
                                            <div className="card mb-3" key={story._id}>
                                                <div className="row no-gutters">
                                                    <div className="col-md-4">
                                                    <img src={`http://localhost:3025/${story.previewImageUrl}`} className="card-img" alt="..." />
                                                    </div>
                                                    <div className="col-md-8">
                                                    <div className="card-body">
                                                        <h5 className="card-title"><Link to={`/story/${story._id}`}>{story.title}</Link></h5>
                                                        <p className="card-text"><small className="text-muted">{story.publishedDate}</small></p>
                                                    </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                <button className="btn btn-block btn-outline-secondary" onClick={this.handleClick} >Load More
                                </button>
                                </div>
                        )
                    }
                </div>
          )
    }
}
  export default StoryList