import React from 'react'
import axios from '../../config/axios'
class Logout extends React.Component{
    
    componentDidMount(props){
        console.log("logout",this.props)
        axios.delete("/users/logout")
            .then(()=>{
                this.props.history.push('/')
                this.props.handleIsAuthenticated(false)
                localStorage.clear()
            })
            .catch(err=>console.log(err))        
    }
    render(){
        return(
            <div>
            </div>
        )
    }
  }
  export default Logout