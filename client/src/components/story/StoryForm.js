import React from 'react'
import {Card, CardBody} from 'reactstrap'
import Draft from './Draft'
import axios from '../../config/axios'
import CreatableSelect from 'react-select/lib/Creatable'

export default class Form extends React.Component {
    constructor(props){
        super(props)
        this.state={
            title:'',
            body:{},
            tags:[],
            isPublished:false,
            topic:'',
            previewImageUrl:'',
            options:[],
            selectedOptions:[]
        }
    }
    componentDidMount(){
        axios.get('/tags')
            .then(res=>{
                    this.setState(()=>({ 
                        options:res.data
                    }))
            })
            .catch(err=>console.log(err))
    }
    handleTagsChange = (newValue) => {

        this.setState({ selectedOptions:newValue })
        console.log(newValue)
    }
    handleCreate = (inputValue) => {
            const data={
                label:inputValue,
                value:inputValue
            }
                axios.post('/tags',data)
                .then(res=>{
                    this.setState((prevState)=>({ 
                        options: [...prevState.options,res.data],
                        selectedOptions:[...prevState.selectedOptions,res.data]
                    }))
                })
                .catch(err=>console.log(err))
      }
    handleChecked = (e) =>{
        const isChecked=e.target.checked 
        isChecked?this.setState(()=>({ isPublished:"true" })):this.setState(()=>({ isPublished:"false" })) 
    }
    handleChange =(e)=>{
        e.persist()
        this.setState(()=>({
            [e.target.name]:e.target.value
        }))
    }
    onChange = (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('myimage',file)
        const config = { headers: { 'Content-Type': 'multipart/form-data' } }
        axios.post("/upload",formData,config)
            .then((res) => {
                const path=res.data.path
                console.log(path)
                this.setState(()=>({ previewImageUrl:path }))
                console.log(res.data.msg)
            }).catch((err) => {
                console.log(err.response.data.msg)
        })
    }
    handleSubmit = (e) => {
        e.preventDefault()
        const body=localStorage.getItem('content')
        this.setState(()=>({ body }))
        const topic=this.props.match.params.id
        
        const data ={
            title:this.state.title,
            isPublished:this.state.isPublished,
            body,
            previewImageUrl:this.state.previewImageUrl,
            topic
        }
            axios.post("/story",data)
            .then(res=>{
                this.state.selectedOptions.forEach(item=>{
                    setTimeout(()=>{
                        const id=item._id
                        axios.get(`/tags/${id}/${res.data._id}` )
                        .then(res=>console.log(res.data))
                        .catch(err=>{console.log(err)})
                        axios.get(`/story/${res.data._id}/${id}`)
                        .then(res=>console.log(res.data))
                        .catch(err=>{console.log(err)})
                    },500)
                })
            })
            .then(() => this.props.history.push('/'))
            .catch((err) => {
                console.log(err)
        })
    }
    render(){
        // this.state.topics.forEach(ele=> this.state.options.push(createOption(ele.name)))
        return (
                <div>
                    <Card>
                        <form  className="form" onSubmit={this.handleSubmit}>
                            <CardBody>
                                <h2 className="m-3 text-center">Add a Story</h2>
                                <div className="form-group ml-5 mr-5">
                                    <label >Title:</label>
                                    <input className="form-control" type="text" value={this.state.title} onChange={this.handleChange} placeholder="Title" name="title" />
                                </div>

                                <div className="form-group ml-5 mr-5">
                                    <label >Body:</label>
                                    {/*<textarea className="form-control" wrap="off" cols="30" rows="5" placeholder="Story goes here..." value={this.state.body} onChange={this.handleChange} name="body" />*/}
                                    <Draft className="form-control" />
                                </div>


                                <div className="form-group ml-5 mr-5">
                                    <label >Tags:</label>
                                    <CreatableSelect
                                        isMulti
                                        // isDisabled={this.state.isLoading}
                                        // isLoading={this.state.isLoading}
                                        onChange={this.handleTagsChange}
                                        onCreateOption={this.handleCreate}
                                        options={this.state.options}
                                        value={this.state.selectedOptions}
                                    />
                                </div>

                                <div className="form-group check ml-5 mr-5">
                                    <label className="check">
                                        <input type="checkbox" onChange={this.handleChecked} className="checkbox m-2" /> Is Published
                                    </label>
                                </div>

                                <div className="form-group ml-5 mr-5">
                                    <label>Upload Image here:</label><br/>
                                    <input  type="file" className="form-control-file border" onChange= {this.onChange} />
                                </div>

                                <input type="submit" className="btn btn-primary ml-5"/>
                            </CardBody>
                        </form>
                    </Card>
                </div>
          )
    }
}