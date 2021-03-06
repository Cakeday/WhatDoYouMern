import React, { Component } from 'react';
import { singlePost, remove, like, unlike } from './apiPost'
import { Link, Redirect } from 'react-router-dom'
import DefaultPostPicture from '../images/defaultPostPicture.jpg';
import { isAuthenticated } from '../auth'
import Comment from './Comment'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'


class SinglePost extends Component {

    constructor(props) {
        super(props);
        this.state = {
            post: "",
            redirectToHome: false,
            redirectToLogin: false,
            like: false,
            likes: 0,
            comments: []
        }
    }
    
    deletePost = () => {
        const postId = this.props.match.params.postId
        const token = isAuthenticated().token
        remove(postId, token).then(data => {
            if (data.error) console.log(data.error)
            else this.setState({redirectToHome: true})
        })
    }

    checkLikes = (likes) => {
        const userId = isAuthenticated() && isAuthenticated().user._id
        let match = likes.indexOf(userId) !== -1
        return match
    }

    componentDidMount = () => {
        const postId = this.props.match.params.postId
        singlePost(postId).then(data => {
            const alreadyLiked = this.checkLikes(data.likes)
            console.log(data)
            this.setState({post: data, likes: data.likes.length, like: alreadyLiked, comments: data.comments})
        })
    }

    updateComments = comments => {
        this.setState({ comments })
    }

    likeToggle = () => {
        if (!isAuthenticated()) {
            this.setState({redirectToLogin: true})
            return false
        }
        const token = isAuthenticated().token
        const userId = isAuthenticated().user._id
        const postId = this.state.post._id
        let callApi = this.state.like ? unlike : like
        callApi(userId, token, postId).then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                this.setState({
                    like: !this.state.like,
                    likes: data.likes.length
                })
            }
        })
    }

    getPotentialPhoto = (post) => {
        const image = post.photo ? (
            <img 
                src={`${process.env.REACT_APP_API_URL}/${post.photo.data}?${new Date().getTime()}`} 
                alt={post.title}
                style={{height: '50vh', width: '100%', objectFit: 'contain'}}
                className="img-thumbnail"
            />
        ) : (
            <img 
                src={`${DefaultPostPicture}`} 
                alt="Default"
                style={{height: '50vh', width: 'auto', objectFit: 'cover'}}
                className="img-thumbnail"
            />
        )
        return image
    }

    deleteConfirmation = () => {
        let answer = window.confirm("Are you sure you want to delete your post?")
        if (answer) {
            this.deletePost()
        }
    }

    renderPost = (post) => {
        const posterId = post.postedBy ? `/user/${post.postedBy._id}` : ""
        const posterName = post.postedBy ? post.postedBy.name : "Unknown author"

        const { like, likes } = this.state


        return (
            <div className="card-body">
                {this.getPotentialPhoto(post)}
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">{post.body}</p>
                {like ? (
                    <h3 onClick={this.likeToggle}><FontAwesomeIcon icon={faThumbsUp} className="mx-2 text-success" />
                    {likes} likes</h3>
                ) : (
                    <h3 onClick={this.likeToggle}><FontAwesomeIcon icon={faThumbsUp} className="mx-2" />
                    {likes} likes</h3>
                )}

                <br />
                <p className="font-italic mark">
                    Posted by <Link to={posterId}>{posterName}</Link> on {new Date(post.created).toDateString()}
                </p>
                <div className="d-inline-block">
                    <Link to={'/'} className="btn btn-primary btn-raised btn-sm">Back to posts</Link>
                    {isAuthenticated().user && 
                            isAuthenticated().user._id === post.postedBy._id &&
                                <>
                                    <Link to={`/post/edit/${post._id}`} className="btn btn-warning btn-raised btn-sm mx-3">Update Post</Link>
                                    <button onClick={this.deleteConfirmation} className="btn btn-raised btn-danger btn-sm">Delete Post</button>
                                </>
                    }
                </div>
            </div>
        )
    }

    render() {
        const { post, redirectToHome, redirectToLogin, comments } = this.state;
        console.log(comments)

        if (redirectToHome) return <Redirect to={'/'} />
        if (redirectToLogin) return <Redirect to={'/signin'} />

        return (
            <div className="container">
                <h2 className="display-2 my-5">{post.title}</h2>
                {!post ? <div className="jumbotron text-center">
                    <h2>Loading...</h2>
                </div> : (this.renderPost(post))}

                <Comment postId={post._id} comments={comments.reverse()} updateComments={this.updateComments} />

            </div>
        )
    }
}

export default SinglePost;
