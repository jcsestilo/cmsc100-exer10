import React from 'react';
import styles from './feed.module.css';

class Posts extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            posts: this.props.userPosts,
            title: this.props.title,
            friends: this.props.friends,
            userID: this.props.userID, // will be used for editing post
            userName: this.props.userName,
            editedPost: '',
            postIDToEdit: ''
        }

        
        this.postsReference = [];
        
        this.sortPosts = this.sortPosts.bind(this)
        this.editPost = this.editPost.bind(this)
        this.submitEditedPost = this.submitEditedPost.bind(this)
        this.cancelEditing = this.cancelEditing.bind(this)
        this.handleEditChange = this.handleEditChange.bind(this)
        this.deletePost = this.deletePost.bind(this)
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
                    // new values of the posts array here
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

    handleEditChange(e){
        this.setState({ editedPost: e.target.value })
    }

    deletePost(index){
        
        var info = {
            userID: this.state.userID,
            postID: this.state.posts[index]._id,
        }

        fetch(
            "http://localhost:3001/delete-post",
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
                alert("Delete post successful.")
            } else {
                alert("Delete post failed!")
            }
        })

        window.location.reload();
    }

    editPost(index){
        var children = this.postsReference[index].childNodes;
        
        var postID = this.state.posts[index]._id; // get the id of that post
        this.setState({postIDToEdit: postID})
        var textBox = children[6];
        var submitBtn = children[8];
        var cancelBtn = children[9];
        // show the textarea, submit button, and the cancel button
        textBox.removeAttribute('hidden')
        submitBtn.removeAttribute('hidden')
        cancelBtn.removeAttribute('hidden')

        // add click event listeners to the submit and cancel button
        submitBtn.addEventListener('click', this.submitEditedPost);
        //cancelBtn.addEventListener('click', this.cancelEditing);
    }

    submitEditedPost(){
        var info={
            userID: this.state.userID,
            editedPost: this.state.editedPost,
            postID: this.state.postIDToEdit // will be used as identifier of posts
        }

        fetch(
            "http://localhost:3001/edit-post",
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
                alert("Edit post successful!")
            } else {
                alert("Edit post failed!")
            }
        })

        window.location.reload();
    }

    cancelEditing(index){
        var children = this.postsReference[index].childNodes;
        
        var textBox = children[6];
        var submitBtn = children[8];
        var cancelBtn = children[9];

        textBox.setAttribute('hidden', 'true')
        submitBtn.setAttribute('hidden', 'true')
        cancelBtn.setAttribute('hidden', 'true')
    }

    render(){
        
        this.sortPosts()
        return(
            <div>
                {
                    this.state.posts.map((post, index) => {

                        if(post.postAuthor===this.state.userName){
                            return(
                                <div key={index} ref={ref => (this.postsReference[index] = ref)}>
                                    <label className={styles.label}> {post.postAuthor} </label>
                                    <br/>
                                    <label className={styles.timestamp}> {post.timestamp} </label>
                                    <br/>
                                    <p id="post-content" className={styles.label}> {post.content} </p>

                                    <br/>

                                    <textarea className={styles.input} id='toEditBox' type="text" hidden={true} onChange={this.handleEditChange} defaultValue={post.content}></textarea>
                                    <br/>
                                    <button className={styles.button} hidden={true}> Submit </button>
                                    <button className={styles.button} hidden={true} onClick={() => this.cancelEditing(index)}> Cancel </button> 
                                    <br/>
                                    <button className={styles.button} onClick={() => this.editPost(index)}> Edit </button>&nbsp;
                                    <button className={styles.button} onClick={() => this.deletePost(index)}>Delete</button>
                                    <hr/>
    
                                </div>
                            );
                        }
                        else{
                            return(
                                <div key={index} ref={ref => (this.postsReference[index] = ref)}>
                                    <label className={styles.label}> {post.postAuthor} </label>
                                    <br/>
                                    <label className={styles.timestamp}> {post.timestamp} </label>
                                    <br/>
                                    <p id="post-content" className={styles.label}> {post.content} </p>

                                    <br/>
                                    <hr/>
    
                                </div>
                            );
                        }
                    })
                }
            </div>
        )
    }
}

export default Posts