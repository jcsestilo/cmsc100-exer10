import React from "react";

class Home extends React.Component{
    
    render() {
        return(
            <div>
                <h2>Welcome to the homepage!</h2>
                <button><a href="/signup">Sign Up</a></button>
                <button><a href="/login">Log In</a></button>
            </div>
        )
    }
}

export default Home