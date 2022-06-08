import React from 'react';

import styles from './feed.module.css'

class Suggested extends React.Component{

    constructor(props){
        super(props);

        this.state={
            friends: this.props.friends,
            userID: this.props.userID,
            userEmail: this.props.userEmail,
            suggestedFriends: []
        }

        this.suggestedUsersReference = [];

        this.sendFriendRequest = this.sendFriendRequest.bind(this)
    }

    componentDidMount(){
        // get all the users thats not friends with user
        var info = {
            friends: this.state.friends,
            userID: this.state.userID,
            userEmail: this.state.userEmail
        }

        fetch(
            "http://localhost:3001/get-suggested-users",
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(info)
            }
        )
        .then(response => response.json())
        .then(body => {
            if(body.success){
                this.setState({suggestedFriends: body.user})
            } else {
                console.log("Error occured.")
            }
        })

    }

    sendFriendRequest(index){
        var info = {
            userEmail: this.state.userEmail,
            receiverID: this.state.suggestedFriends[index]._id
        }

        fetch(
            "http://localhost:3001/send-friend-request",
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(info)
            }
        )
        .then(response => response.json())
        .then(body => {
            if(body.success){
                alert("Friend request sent!")
                var newSuggestedFriends = this.state.suggestedFriends.splice(index, 1)
                this.setState({ suggestedFriends: newSuggestedFriends})
            } else {
                alert("Sending friend request failed.")
            }
        })

        window.location.reload()
    }

    render(){
        return(
            <div>
                <h3 className={styles.title}>Suggested Users</h3>
                {
                    this.state.suggestedFriends.map((user, index) => {
                        return(
                            <div key={index} ref={ref => (this.suggestedUsersReference[index] = ref)}>
                                <br/>
                                <h3 className={styles.label}>{user.firstName + ' ' + user.lastName}</h3>
                                <button className={styles.button} onClick={() => {this.sendFriendRequest(index)}}>Send Friend Request</button>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default Suggested