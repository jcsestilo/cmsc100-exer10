import React from 'react';
import queryString from 'query-string';
import styles from './feed.module.css';

class Profile extends React.Component{

    constructor(props){
        super(props);

        this.state={
            firstNameQuery: queryString.parse(window.location.search).firstName,
            lastNameQuery: queryString.parse(window.location.search).lastName,
            firstName: '',
            lastName: '',
            email: ''
        }

    }

    componentDidMount(){
        var info={
            firstName: this.state.firstNameQuery,
            lastName: this.state.lastNameQuery
        }

        // get the profile with that name (first name or last name)
        fetch(
            "http://localhost:3001/find-profile",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(info)
            }
        )
        .then(response => response.json())
        .then(body => {
            if(body.success){
                this.setState({
                    profileID: body.id,
                    firstName: body.firstName,
                    lastName: body.lastName,
                    email: body.email,
                    age: body.age
                })
            } else{
                if(body.noInput){
                    alert("Please make sure you have an input first!");
                    window.history.back();
                }
            }
        })
    }
    render(){
    
        return(
            <div>
                <button className={styles.button} onClick={() => {window.history.back();}}>Back to Feed</button>
                <h2>{this.state.firstName + ' ' + this.state.lastName}</h2>
                <label className={styles.label}>{'Email: ' + this.state.email}</label>
                <br/>
                <label className={styles.label}>{'Age: ' + this.state.age}</label>
                <br/>
            </div>
        )
    }
}

export default Profile