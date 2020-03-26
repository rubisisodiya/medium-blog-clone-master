import React from 'react'
// import { Link } from 'react-router-dom'
import axios from '../../config/axios'
import 'mdbreact/dist/css/mdb.css'
import  { MDBIcon }  from "mdbreact"
import ResponseAdd from '../layout/ResponseAdd'
import ResponseList from '../layout/ResponseList'
import {Editor, EditorState,convertFromRaw} from 'draft-js'
import './Draft.css'
export default class StoryShow extends React.Component{
    constructor(props){
        super(props)
        this.state={
            story:{},
            isLoaded:false,
            response:[],
            isfollowing:false,
            storyByYou:false,
            user:{},
            isBookmarked:false,
            isLiked:false,
            isAuthenticated:false,
            editorState: EditorState.createEmpty()
        }
    }
    componentDidMount(){
        const id = this.props.match.params.id
        axios.get('users/account')
             .then(res=>{
                 this.setState(()=>({ user:res.data,isAuthenticated:true }))
             })
             .catch(err=>{
                 console.log(err)
                 this.setState({ isAuthenticated:false })
             })
        axios.get(`/story/${id}`)
            .then(res=>{
                this.setState(()=>({ 
                    story : res.data,
                    isLoaded:true
                }))
            })
             .then(()=>{
                const contentState = this.state.story.body
                this.setState(()=>({ 
                    editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(contentState))) 
                }))
             })
             .then(()=>{
                 if(this.state.user._id===this.state.story.user._id){
                     this.setState({
                        storyByYou:true
                     })
                 }
                 this.state.user.bookmarks.forEach(value=>{
                    if(value===this.state.story._id){
                       this.setState(()=>({ isBookmarked: true }))
                    }
                })
                this.state.user.clappedStories.forEach(value=>{
                    if(value===this.state.story._id){
                       this.setState(()=>({ isLiked: true }))
                    }
                })
                this.state.story.user.followers.forEach(value=>{
                    if(value===this.state.user._id){
                       this.setState(()=>({ isfollowing:true }))
                    }
                })
             })
            .catch(err=>console.log(err))
        
    }
    handleAddResponse = (data) =>{
        this.setState({ response:data })
    }
    handleResponse = (response) =>{
        this.setState(()=>({ response:response}))
    }
    handlebookmark = () =>{
        const id = this.props.match.params.id
        axios.get(`/users/bookmark/${id}`)
            .then(res=>{
                this.setState({ isBookmarked:true })
                console.log(res.data)
            })
            .catch(err=>console.log(err))
    }
    handleLike = () =>{
        const id = this.props.match.params.id
        axios.get(`/users/clapped/${id}`)
            .then(res=>{
                this.setState({ isLiked :true })
                console.log(res.data)
            })
            .catch(err=>console.log(err))
    }
    handleFollow = () =>{
        const id=this.state.story.user._id
        axios.get(`/users/follow/${id}`)
        .then(res=>{
            console.log(res.data)
            this.setState(()=>({ isfollowing :true }))
        })
        .catch(err=>console.log(err))
    }
    handleUnFollow = () => {
        const id=this.state.story.user._id
        axios.delete(`/users/unfollow/${id}`)
        .then(res=>{
            this.setState(()=>({ isfollowing :false }))
        })
        .catch(err=>console.log(err))
    }
    render(){ 
        return (
            <div className=" container text-dark">
                    { this.state.isLoaded ? (
                    <div className="m-2">
                        <div className="container mb-4">
                            <div>
                                <img className="img-fluid rounded mb-5" align="center" src={`http://localhost:3025/${this.state.story.previewImageUrl}`} alt={this.state.story.previewImageUrl} />
                                <div className="media mt-2 mb-2">
                                <MDBIcon className="ml-2" icon="user-circle" size="5x"/>
                                    <div className="media-body">
                                        <h5 className="mt-0 font-weight-bold">{this.state.story.user.name}
                                            {
                                                this.state.isAuthenticated?
                                                this.state.storyByYou ? <button className="btn btn-info btn-sm" disabled>Published By You</button>:
                                                this.state.isfollowing?
                                                <button className="btn btn-info btn-sm" onClick={this.handleUnFollow}>Unfollow</button>:
                                                <button className="btn btn-info btn-sm" onClick={this.handleFollow} >Follow</button>:
                                                <button className="btn btn-dark btn-sm" disabled >Follow</button>
                                            }
                                        </h5>
                                    </div>
                                </div>
                                <h3 className="text-center font-weight-bold">{this.state.story.title}</h3>
                                <Editor editorState={this.state.editorState} />   
                            </div>
                            <div>
                                {
                                    this.state.story.tags.map(item=>{
                                        return(
                                            <span key={item._id} className="m-2 badge badge-primary"><h5>{item.value}</h5></span>
                                        )
                                    })
                                }
                            </div>
                            <div className="container">
                                {this.state.story.publishedDate}
                                <button className="float-right mr-6" disabled={this.state.isBookmarked || !this.state.isAuthenticated} ><i className="far fa-bookmark" onClick={this.handlebookmark} ></i></button>
                                {
                                    this.state.isLiked?
                                    <button className="float-right mr-4" disabled={this.state.isliked} ><i className="fas fa-thumbs-up blue-text" ></i></button>:
                                    <button onClick={this.handleLike} className="float-right mr-4" disabled={ !this.state.isAuthenticated} ><i className="far fa-thumbs-up" ></i></button>
                                }
                            </div>
                            </div>
                        <div className="container my-3">
                            {this.state.isAuthenticated && <ResponseAdd handleAddResponse={this.handleAddResponse} id={this.props.match.params.id} />}
                            <ResponseList handleResponse={this.handleResponse} response={this.state.response} id={this.props.match.params.id} />
                        </div>
                    </div>
                  ):<h2 className="text-center">Loading...</h2>}
            </div>
        )
    }
}
