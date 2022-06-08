import React from 'react';
import { Navigate} from 'react-router-dom';
import queryString from 'query-string';
import styles from './feed.module.css';

class Header extends React.Component{

    constructor(props){
        super(props);
        
        this.state = {
            firstNameUser: this.props.firstName,
            firstName: '',
            lastName: '',
            searching: false,
            url: ''
        }

        this.handleFirstNameChange=this.handleFirstNameChange.bind(this)
        this.handleLastNameChange=this.handleLastNameChange.bind(this)
        this.searchProfile=this.searchProfile.bind(this)

    }

    handleLastNameChange(e){
        this.setState({lastName: e.target.value})
    }

    handleFirstNameChange(e){
        this.setState({firstName: e.target.value})
    }

    searchProfile(e){
        e.preventDefault()
        var query = queryString.stringify({firstName: this.state.firstName, lastName: this.state.lastName })
        this.setState({
            searching: true,
            url: '/feed/profile?'+query
        })
        
    }

    
    render(){

        if(this.state.searching){
            return(
                <Navigate to={this.state.url}/>
            )
        }
        else{
            return(
                <div>
                    <label className={styles.title}>Welcome, {this.state.firstNameUser}!</label>
    
                    <form onSubmit={this.searchProfile}>
                        First Name &nbsp;
                        <input className={styles.input} value={this.state.firstName} onChange={this.handleFirstNameChange}/>
                        &nbsp;&nbsp;&nbsp;
                        Last Name &nbsp;
                        <input className={styles.input} value={this.state.lastName} onChange={this.handleLastNameChange}/>
                        <button className={styles.button} type="submit" >Search</button> 
                    </form>
    
                </div>
            );
            
        }

    }
}

export default Header;