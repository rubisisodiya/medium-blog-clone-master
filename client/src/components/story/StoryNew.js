import React from 'react'
import axios from'../../config/axios'
import StoryForm from "./StoryForm"
class NewStory extends React.Component{
    handleSubmit = (formData) =>{
        axios.post('/story', formData)
            .then(() => this.props.history.push('/story'))
            .catch(err => console.log(err))
    }
    render(){
        console.log("story new render")
        return (
            <div className="container">
                <StoryForm handleSubmit={this.handleSubmit} />
            </div>
        )
    }
}
export default NewStory