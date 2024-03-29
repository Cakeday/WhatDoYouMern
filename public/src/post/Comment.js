import React, { Component } from 'react';
import { comment, uncomment } from './apiPost'
import { isAuthenticated } from '../auth'
import { Link } from 'react-router-dom'

import DefaultProfile from '../images/defaultProfile.jpg'

class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            error: ""
        }
    }
    
    handleChange = (event) => {
        this.setState({error: ""})
        this.setState({text: event.target.value})
    }

    isValid = () => {
        const { text } = this.state
        if (text.length === 0 || text.length > 150) {
            this.setState({error: "Comment can't be empty OR over 150 characters"})
            return false
        }
        return true
    }

    addComment = event => {
        event.preventDefault()

        if (!isAuthenticated()) {
            this.setState({error: "Please sign in to leave a comment"})
            return
        }

        if (this.isValid()) {
            const userId = isAuthenticated().user._id
            const token = isAuthenticated().token
            const { postId } = this.props
            const commentText = {text: this.state.text}
    
            comment(userId, token, postId, commentText)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    this.setState({text: ""})
                    console.log('is this working')
                    this.props.updateComments(data.comments)
                }
            })
        }
    }

    deleteComment = (comment) => {
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        const { postId } = this.props

        uncomment(userId, token, postId, comment)
        .then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                this.props.updateComments(data.comments)
            }
        })
    }

    deleteConfirmation = (comment) => {
        let answer = window.confirm("Are you sure you want to delete your comment?")
        if (answer) {
            this.deleteComment(comment)
        }
    }

    render() {
        const { comments } = this.props
        const { error } = this.state

        return (
            <div>
                <h2 className="my-5">Leave a Comment</h2>
                <form className="mb-5" onSubmit={this.addComment}>
                    <div className="form-group">
                        <input type="text" className="form-control" placeholder="Type here to respond!" onChange={this.handleChange} value={this.state.text} />
                        <button className="btn btn-raised btn-success mt-2">Post Comment</button>
                    </div>
                </form>

                <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                    {error}
                </div>

                <div className="col-md-12">
                    <h3 className="text-primary">{comments.length} Comments</h3>
                    <hr />
                    {comments.map((comment, i) => {
                        const finalPhotoUrl = comment.postedBy.photo ? `${process.env.REACT_APP_API_URL}/${comment.postedBy.photo.data}?${new Date().getTime()}` : DefaultProfile
                        return (
                            <div key={comment._id}>
                                <Link to={`/user/${comment.postedBy._id}`}>
                                    <img 
                                        style={{borderRadius: "50%", border: "1px solid black"}}
                                        className="float-left mr-2" 
                                        height="30px" 
                                        width="30px" 
                                        src={`${finalPhotoUrl}?${new Date().getTime()}`} 
                                        alt={comment.postedBy.name}>
                                    </img>
                                </Link>
                                <p className="lead">{comment.text}</p>
                                <p className="font-italic mark">
                                    Posted by <Link to={`/user/${comment.postedBy._id}`}>{comment.postedBy.name}</Link> on {new Date(comment.created).toDateString()}


                                    <span>
                                        {isAuthenticated().user && 
                                            isAuthenticated().user._id === comment.postedBy._id &&
                                                <button onClick={() => this.deleteConfirmation(comment)} className="btn btn-danger float-right mr-1">Delete Comment</button>
                                        }
                                    </span>
                                </p>
                                <br />
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
}

export default Comment;
