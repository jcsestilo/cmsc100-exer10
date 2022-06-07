import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

import Header from './Header.js';
import Friends from './Friends.js';
import Form from './Form.js';
import Posts from './Posts.js';

class Feed extends React.Component{
    constructor(props){
        super(props);

        this.state={
            checkifLoggedIn: false,
            isLoggedIn: null,
            firstName: localStorage.getItem("firstName"),
            user: {}
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
                        firstName: localStorage.getItem("firstName"),
                        user: body.user
                    });
                    //console.log(body.user.posts);
                } else {
                    this.setState({
                        checkifLoggedIn: true, 
                        isLoggedIn:false
                    });
                    alert("Please log in first!")
                }
            });
        
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
                        <button id="logout" onClick={this.logout}>Log Out</button>
                        <Header firstName={this.state.firstName}/>
                        
                        <div>
                            <Friends data={this.state.user.friends} title={"Friends"}/>
                        </div>

                        <Form postAuthor={this.state.user.firstName+' '+this.state.user.lastName} id={this.state.user._id}/>

                        <Posts userPosts={this.state.user.posts} title="Posts" friends={this.state.user.friends} />
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