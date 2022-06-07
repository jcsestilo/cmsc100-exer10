import React from 'react';

class Posts extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            posts: this.props.userPosts,
            title: this.props.title,
            friends: this.props.friends
        }

        this.sortPosts = this.sortPosts.bind(this)
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
                    // if successful, append to the posts array each post object
                    // for each post in the array, append it
                    body.posts.forEach(post => {
                        var newStateArray = this.state.posts.slice();
                        newStateArray.push(post);
                        this.setState({posts: newStateArray});
                    });
                } else {
                    console.log("An error occured.")
                }
            })
        });

        

        //console.log(this.state.posts);
    }

    render(){
        
        this.sortPosts()
        return(
            <div>
                {
                    this.state.posts.map((post, index) => {
                        return(
                            <div key={index}>
                                <label>{post.postAuthor}</label>
                                <br/>
                                <label>{post.timestamp}</label>
                                <br/>
                                <p>{post.content}</p>
                                <hr/>
                            </div>
                        );
                    })
                }
            </div>
        )
    }
}

export default Posts