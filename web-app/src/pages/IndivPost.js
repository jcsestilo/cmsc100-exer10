import React from 'react';

class IndivPost extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            postAuthor: this.props.postAuthor,
            timestamp: this.props.timestamp,
            content: this.props.content
        }

        // Create a reference to our edit form
        this.textArea = React.createRef();
        this.submitBtn = React.createRef();
        this.cancelBtn = React.createRef();

        this.editPost = this.editPost.bind(this)
        this.cancelEditing = this.cancelEditing.bind(this)
        this.submitEditedPost = this.submitEditedPost.bind(this)
    }

    editPost(){
        
        var textBox = this.textArea;
        var submitBtn = this.submitBtn;
        var cancelBtn = this.cancelBtn;

        // show the textarea and the submit button
        textBox.removeAttribute('hidden');
        submitBtn.removeAttribute('hidden');
        cancelBtn.removeAttribute('hidden');

        // when cancelbtn is clicked, hide the elements again
        cancelBtn.addEventListener("click", this.cancelEditing)

        // when submitbtn is clicked, submit the edited post to the database
        submitBtn.addEventListener("click", this.submitEditedPost)
    }

    // hide the edit form
    cancelEditing(){
        var textBox = this.textArea;
        var submitBtn = this.submitBtn;
        var cancelBtn = this.cancelBtn;

        textBox.setAttribute('hidden', 'true');
        submitBtn.setAttribute('hidden', 'true');
        cancelBtn.setAttribute('hidden', 'true');
    }

    // submit edited post
    submitEditedPost(){
        
    }

    render(){

        return(
            <div>
                <label> {this.state.postAuthor} </label>
                <br/>
                <label> {this.state.timestamp} </label>
                <br/>
                <p id="post-content" > {this.state.content} </p>

                <br/>

                <textarea id='toEditBox' type="text" hidden="true" ref={ref => this.textArea = ref}>{this.state.content}</textarea>
                <br/>
                <button hidden="true"ref={ref => this.submitBtn = ref}> Submit </button>
                <button hidden="true"ref={ref => this.cancelBtn = ref}> Cancel </button> 
                <br/>
                <button onClick={this.editPost} > Edit </button>&nbsp;
                <button>Delete</button>
                <hr/>
            
            </div>
        )
    }
}

export default IndivPost