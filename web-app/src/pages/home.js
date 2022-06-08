import React from "react";
import styles from './feed.module.css';

class Home extends React.Component{
    
    render() {
        return(
            <div>
                <h2 className={styles.title}>Welcome to the homepage!</h2>
                <button className={styles.button}><a href="/signup">Sign Up</a></button>
                &nbsp;&nbsp;&nbsp;
                <button className={styles.button}><a href="/login">Log In</a></button>
            </div>
        )
    }
}

export default Home