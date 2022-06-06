import React from 'react';
import Cookies from "universal-cookie";
import styles from './form.module.css';

class LogIn extends React.Component{

    constructor(props){
        
        super(props);
        
        this.state = {
            email: "",
            password: ""
        }

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePassChange = this.handlePassChange.bind(this);
        this.logIn = this.logIn.bind(this)
        this.backToHomepage = this.backToHomepage.bind(this)

        this.redirect = this.redirect.bind(this)
    }

    handleEmailChange(e){
        this.setState( { email: e.target.value } ) 
    }

    handlePassChange(e){
        this.setState( {password: e.target.value} )
    }

    logIn(e){
        e.preventDefault();

        const credentials = {
            email: this.state.email,
            password: this.state.password
        }

        // send a POST request
        fetch(
            "http://localhost:3001/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(credentials)
            })
            .then(response => response.json())
            .then(body => {
                if(!body.success) { alert("Failed to log in.") }
                else {
                    // successful log in, store the token as a cookie

                    const cookies = new Cookies();
                    cookies.set(
                        "authToken",
                        body.token,
                        {
                            path: "localhost:3001/",
                            age: 60*60,
                            sameSite: "lax"
                        });
                        
                        localStorage.setItem("firstName", body.firstName);
                        localStorage.setItem("email", body.email);
                        alert("Successfully logged in");
                        this.redirect()
                }
            })
    }

    redirect(){
        window.location.href ="http://localhost:3000/feed"
    }

    backToHomepage(){
        window.location.href = "/";
    }

    render() {
        return(
            <div>
                <button onClick={this.backToHomepage} className={styles.button}>Back to homepage</button>
                <h1 className={styles.title}>Log In Form</h1>
                <form className={styles.form}>
                <label for="emailtxt" className={styles.label}>Email: </label>
                <input className={styles.input} type="email" id="emailtxt" name="emailtxt" required value={this.state.email} onChange={this.handleEmailChange}/><br/><br/>
                
                <label for="passwordtxt" className={styles.label}>Password: </label>
                <input className={styles.input} type="password" id="passwordtxt" name="passwordtxt" data-isValid="false" required
                value={this.state.password} 
                onChange={this.handlePassChange}/>
                <button id="login" type="submit" onClick={this.logIn} className={styles.button}>Log In</button>
                </form>
            </div>
        );
    }
}

export default LogIn