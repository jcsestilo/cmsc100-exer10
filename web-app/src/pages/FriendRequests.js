import React from 'react';
import styles from './feed.module.css';

class FriendRequests extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            userFriendRequestsEmail: this.props.friendReqs,
            userID: this.props.userID,
            userEmail: this.props.userEmail,
            friendRequests: []
        }

        this.friendRequestsReference = [];

        this.acceptFriendRequest = this.acceptFriendRequest.bind(this)
        this.rejectFriendRequest = this.rejectFriendRequest.bind(this)
    }

    componentDidMount(){
        // fetch the user infos of each email in friend requests
        this.state.userFriendRequestsEmail.forEach(element => {
            var email = {
                email: element
            }

            fetch(
                "http://localhost:3001/find-by-email-post",
                {
                    method: "POST",
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(email)
                }
            )
            .then(response => response.json())
            .then(body => {
                if(body.success){
                    var newStateArray = this.state.friendRequests.slice();
                    newStateArray.push({
                        id: body.id,
                        firstName: body.firstName,
                        lastName: body.lastName
                    });
                    this.setState({ friendRequests: newStateArray });
                }else{
                    console.log("Error occured");
                }
            })

        });
    }

    acceptFriendRequest(index){

        var info = {
            userID: this.state.userID,
            userEmail: this.state.userEmail,
            requesteeID: this.state.friendRequests[index].id,
            requesteeEmail: this.state.userFriendRequestsEmail[index]
        }

        fetch(
            "http://localhost:3001/accept-friend-request",
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
                alert("Accepting the friend request was successful")
            } else {
                alert("Accepting the friend request failed!")
            }
        })

        window.location.reload();
    }

    rejectFriendRequest(index){
        var info = {
            userID: this.state.userID,
            userEmail: this.state.userEmail,
            requesteeEmail: this.state.userFriendRequestsEmail[index]
        }

        fetch(
            "http://localhost:3001/reject-friend-request",
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
                alert("Rejecting the friend request was successful")
            } else {
                alert("Rejecting the friend request failed!")
            }
        })

        window.location.reload();
    }

    render(){
        return(
            <div>
                {
                    this.state.friendRequests.map((request, index) => {
                        return(
                            <div key={index} ref={ref => (this.friendRequestsReference[index] = ref)}>
                                <h3 className={styles.label}>{request.firstName + ' ' + request.lastName}</h3>
                                <br/>
                                <button className={styles.button} onClick={() => {this.acceptFriendRequest(index)}}>Accept</button>&nbsp;&nbsp;&nbsp;
                                <button className={styles.button} onClick={() => {this.rejectFriendRequest(index)}}>Reject</button>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default FriendRequests