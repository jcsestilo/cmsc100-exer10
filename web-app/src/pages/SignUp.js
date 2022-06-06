import React from "react";
import styles from './form.module.css';

class SignUp extends React.Component {
    
    constructor(props){
        super(props);
        
        this.state = {
            fname: "",
            lname: "",
            email: "",
            age: 0,
            password: "",
            repeatPass: ""
        }
        
        this.handleFnameChange = this.handleFnameChange.bind(this)
        this.handleLnameChange = this.handleLnameChange.bind(this)
        this.handleEmailChange = this.handleEmailChange.bind(this)
        this.handleAgeChange = this.handleAgeChange.bind(this)
        this.handlePassChange = this.handlePassChange.bind(this)
        this.validatePassword = this.validatePassword.bind(this)
        this.handleRepeatPassChange = this.handleRepeatPassChange.bind(this)
        this.validateRepPassword = this.validateRepPassword.bind(this)
        this.checkValid = this.checkValid.bind(this)
        this.backToHomepage = this.backToHomepage.bind(this)
        
        this.saveUser = this.saveUser.bind(this)
    }

    handleFnameChange(e){
        this.setState( {fname: e.target.value} )
    }

    handleLnameChange(e){
        this.setState( {lname: e.target.value} )
    }

    handleEmailChange(e){
        this.setState( {email: e.target.value} )
    }

    handleAgeChange(e){
        this.setState({age: e.target.value})
    }

    handlePassChange(e) {
        this.setState({ password: e.target.value})

    }
    
    validatePassword(e){
        var passField = document.getElementById('passwordtxt');
        var errorField = document.getElementById('errorname');
        var repeatPassField = document.getElementById('repeatpass');
    
        var regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        var test = regex.test(e.target.value);
    
        if(test) {
            errorField.innerText = "Password valid!";
            repeatPassField.removeAttribute("disabled");
            passField.setAttribute("data-isValid", true);
        } else {
            errorField.innerText = "Password invalid!";
            repeatPassField.disabled=true;
            passField.setAttribute("data-isValid", false);
        }

    }

    handleRepeatPassChange(e){
        this.setState({ repeatPass: e.target.value })
        
    }

    validateRepPassword(e){
        var repeatpasserror = document.getElementById('repeatpasserror');
        var repeatPassField = document.getElementById('repeatpass');
        
        // get the values of the two passwords
        var password = this.state.password;
        var repeatedPassword = e.target.value;
        
        if (password === repeatedPassword){
            repeatpasserror.innerText = "The two passwords match.";
            repeatPassField.setAttribute('data-isValid', true);
        } else {
            repeatpasserror.innerText = "The two passwords do not match.";
            repeatPassField.setAttribute('data-isValid', false);
        }
    }

    saveUser(){

        const user = {
            "firstName": this.state.fname,
            "lastName": this.state.lname,
            "email": this.state.email,
            "age": this.state.age,
            "password": this.state.password
        }

        fetch(
            'http://localhost:3001/signup',
            {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(response => response.json())
        .then(body => {
            if (body.success) {alert("Successfully saved your account."); }
            else { alert("Failed to save your account."); }
        });
    }

    checkValid(e){
        e.preventDefault()

        var repeatPassField = document.getElementById('repeatpass');
        var passField = document.getElementById('passwordtxt');

        if(passField.getAttribute('data-isValid')===repeatPassField.getAttribute('data-isValid')){
            this.saveUser();
            //alert("Sign Up successful.")
        } else {
            alert("Please enter valid inputs.");
        }
    }

    backToHomepage(){
        window.location.href = "/";
    }

    render(){
        return(

            // Sign Up Form
            <div>
                <button onClick={this.backToHomepage} className={styles.button}>Back to homepage</button>
                <h1 className={styles.title}>Sign Up Form</h1>
                <form id="sign-up-form" className={styles.form}>
                <label for="fname" className={styles.label}>First name: </label>
                <input type="text" id="fname" name="fname" className={styles.input} required value={this.state.fname} onChange={this.handleFnameChange}/><br/><br/>
                <label for="lname" className={styles.label}>Last name: </label>
                <input type="text" id="lname" name="lname" className={styles.input} required value={this.state.lname} onChange={this.handleLnameChange}/><br/><br/>

                <label for="emailtxt" className={styles.label}>Email: </label>
                <input type="email" id="emailtxt" name="emailtxt" className={styles.input} required value={this.state.email} onChange={this.handleEmailChange}/><br/><br/>

                <label for="age" className={styles.label}>Age: </label>
                <input type="number" id="age" name="age" className={styles.input} required value={this.state.age} onChange={this.handleAgeChange}/><br/><br/>

                <label for="passwordtxt" className={styles.label}>Password: </label>
                <input type="password" id="passwordtxt" name="passwordtxt" className={styles.input} data-isValid="false" required
                value={this.state.password} 
                onChange={this.handlePassChange}
                onInput={this.validatePassword}/>
                <label id="errorname" className={styles.label}></label>

                <br/><br/>
                
                <label for="repeatpass" className={styles.label}>Repeat Password: </label>
                <input type="password" id="repeatpass" name="repeatpass" className={styles.input} data-isValid="false" disabled required
                value={this.state.repeatPass}
                onChange={this.handleRepeatPassChange}
                onInput={this.validateRepPassword}/>
                <label id="repeatpasserror" className={styles.label}></label>

                <br/><br/>
                <button id="submit-btn" type="submit" className={styles.button} onClick={this.checkValid}>Sign Up</button>
                </form>
            </div>
        )
    }
}

export default SignUp