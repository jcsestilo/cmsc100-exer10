import React from 'react';

class LogIn extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            email: "",
            password: ""
        }

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePassChange = this.handlePassChange.bind(this);
    }

    handleEmailChange(e){
        this.setState( { email: e.target.value } ) 
    }

    handlePassChange(e){
        this.setState( {password: e.target.value} )
    }

    render() {
        return(
            <div>
                <h1>Log In Form</h1>
                <form>
                <label for="emailtxt">Email: </label>
                <input type="email" id="emailtxt" name="emailtxt" required value={this.state.email} onChange={this.handleEmailChange}/><br/><br/>
                
                <label for="passwordtxt">Password: </label>
                <input type="password" id="passwordtxt" name="passwordtxt" data-isValid="false" required
                value={this.state.password} 
                onChange={this.handlePassChange}/>
                </form>
            </div>
        );
    }
}

export default LogIn