import React from 'react';

import IndivPost from './IndivPost';

class Posts extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            posts: this.props.userPosts,
            title: this.props.title,
            friends: this.props.friends
        }

        this.sortPosts = this.sortPosts.bind(this)
        // this.editPost = this.editPost.bind(this)
    }

    sortPosts(){
        // after getting all the posts that will be shown in the feed, sort it using timestamp
        // function that converts our timestamp to unreadable timestmap
        const toTimestamp = (strDate) => {
            const dt = Date.parse(strDate);
            //console.log(strDate+' '+dt/1000);
            return dt/1000;
        }

        // sort the posts using timestamp
        this.state.posts.sort(function(x,y){
            return(toTimestamp(y.timestamp) - toTimestamp(x.timestamp));
        })

    }

    componentDidMount(){
        
        // POST: fetch the posts of each friend
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
                }
            )
            .then(response => response.json())
            .then(body => {
                if(body.success){
                    // new values of the array here
                    const newStateArray = this.state.posts.slice();
                    // for each post in the array, append it
                    body.posts.forEach(post => {
                        newStateArray.push(post);
                    });
                    // after appending to newStateArray all the posts, set it to the posts state
                    this.setState({posts: newStateArray})
                } else {
                    console.log("An error occured.")
                }
            })

        });

    }

    // editPost(index){
    //     var toEdit = document.getElementById(index+'content')
    //     var textInput = document.getElementById(index+'textInput')

    //     toEdit.style.display = "none";
    //     textInput.style.display = "block";
    // }

    render(){
        
        this.sortPosts()
        return(
            <div>
                {
                    this.state.posts.map((post, index) => {
                        return(
                            <div key={index}>
                                

                                {/* Individual post component */}
                                <IndivPost postAuthor={post.postAuthor} timestamp={post.timestamp} content={post.content} />
                            </div>
                        );
                    })
                }
            </div>
        )
    }
}

export default Posts