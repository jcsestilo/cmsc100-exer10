import React from 'react';

class Friends extends React.Component{

    constructor(props){
        super(props);
        
        // put to state the data that was passed from parent
        this.state={
            title: this.props.title,
            friends: this.props.data, // array of email of friends
            friendsInfo: [] // will be an array of objects for the friends
        }
    }

    // when component is mounted, get the firstName and lastName for each friend
    componentDidMount(){
        // POST: fetch the firstName and lastName of friend
        this.state.friends.forEach(element => {
            const email = {
                email: element
            }

            fetch(
                "http://localhost:3001/find-by-email-post",
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(email)
                })
                .then(response => response.json())
                .then(body => {
                    if(body.success){
                        var newStateArray = this.state.friendsInfo.slice();
                        newStateArray.push({
                            firstName: body.firstName,
                            lastName: body.lastName
                        });
                        this.setState({ friendsInfo: newStateArray });
                    } else {
                        console.log("Error occurred");
                    }
                })
            
        });
        
    }
    

    render(){

        return(
            <div>
                <h3>{this.state.title}</h3>

                {
                    this.state.friendsInfo.map((friend, index) => {
                        return(
                            <div key={index}>
                                <label>{friend.firstName} {friend.lastName}</label>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default Friends