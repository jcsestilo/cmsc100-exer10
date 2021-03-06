import React from 'react';
import styles from './feed.module.css';

class Form extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            postAuthor: this.props.postAuthor,
            id: this.props.id,
            postContent: ''
        }

        this.submitPost = this.submitPost.bind(this)
        this.handlePostContentChange = this.handlePostContentChange.bind(this)
    }

    submitPost(e){
        e.preventDefault();

        // creating a timestamp
        var today = new Date(); // date object
        var date = today.toLocaleString('default', {month: 'long'}) + ' ' + today.getDate() + ', ' + today.getFullYear(); // get the date today
        var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds(); // get the current time in hours minutes and seconds
        var timestamp = date + ' ' + time;

        // create new post object
        const newPostAndID = {
            postAuthor: this.state.postAuthor,
            timestamp: timestamp,
            content: this.state.postContent,
            id: this.state.id
        }

        // fetch for find and update
        fetch(
            "http://localhost:3001/add-post",
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPostAndID)
            }
        )
        .then(response => response.json())
        .then(body => {
            if(body.success){
                alert("Adding your post was successful!")
            }
            else {
                alert("Adding your post failed!")
            }
        })

        // after adding the post to the database, reload the page
        window.location.reload();
    }

    handlePostContentChange(e){
        this.setState({ postContent: e.target.value })
    }

    render(){
        return(
            <div>
                <h3 className={styles.title}>Create a New Post</h3>
                <form className={styles.form}>
                    <label htmlFor="post-content" className={styles.label}>Post Content:</label>
                    <br/>
                    <textarea rows="5" cols="90" name="post-content" id="post-content" onChange={this.handlePostContentChange} className={styles.input}/>

                    <br/>
                    <button type="submit" onClick={this.submitPost} className={styles.button}>Submit</button>&nbsp;
                    <button type="reset" className={styles.button}>Reset</button>

                </form>
            </div>
        )
    }
}

export default Form