import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

import Header from './Header.js';

class Feed extends React.Component{
    constructor(props){
        super(props);

        this.state={
            checkifLoggedIn: false,
            isLoggedIn: null,
            firstName: localStorage.getItem("firstName"),
            email: localStorage.getItem("email")
            
        }

        this.logout = this.logout.bind(this);
    }

    componentDidMount(){
        // send POST request to check if the user is logged in
        fetch(
            "http://localhost:3001/checkifloggedin",
            {
                method: "POST",
                credentials: "include"
            })
            .then(response => response.json())
            .then(body => {
                if(body.isLoggedIn){
                    this.setState({
                        checkifLoggedIn: true,
                        isLoggedIn: true,
                        firstName: localStorage.getItem("firstName")
                    });
                } else {
                    this.setState({
                        checkifLoggedIn: true, 
                        isLoggedIn:false
                    });
                    alert("Please log in first!")
                }
            });
        
            Promise.all([

                fetch("http://localhost:3001/checkifloggedin",
                {
                    method: "POST",
                    credentials: "include"
                }).then(response1 => response1.json()),

                fetch("http://localhost:3001/find-by-email-post", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: this.state.email })
                }).then(response2 => response2.json())
            
            ]).then(([body1, body2]) => {
                if(body1.isLoggedIn){
                    this.setState({
                        checkifLoggedIn: true,
                        isLoggedIn: true,
                        firstName: localStorage.getItem("firstName"),
                        email: localStorage.getItem("email")
                    });

                    console.log(body2);
                } else {
                    this.setState({
                        checkifLoggedIn: true, 
                        isLoggedIn:false
                    });
                    alert("Please log in first!")
                }
            })
    }

    logout(e){
        e.preventDefault();

        // Delete cookie with authToken
        const cookies = new Cookies();
        cookies.remove("authToken");

        // Delete firstName in local storage
        localStorage.removeItem("firstName");

        this.setState({isLoggedIn: false});
    }

    render(){
        if(!this.state.checkifLoggedIn){
            // delay redirect/render
            return(<div></div>)
        }

        else {
            if(this.state.isLoggedIn){
                // render the page
                return(
                    <div>
                        <Header firstName={this.state.firstName}/>

                        <br/>
                        <button id="logout" onClick={this.logout}>Log Out</button>
                    </div>
                )
            }

            else {
                // redirect
                return(
                    <Navigate to="/" />
                )
            }
        }
    }
}

export default Feed