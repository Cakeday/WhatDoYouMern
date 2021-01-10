import React, { Component } from 'react';
import { singlePost, remove } from './apiPost'
import { Link, Redirect } from 'react-router-dom'
import DefaultPostPicture from '../images/defaultPostPicture.jpg';
import { isAuthenticated } from '../auth'


class SinglePost extends Component {

    constructor(props) {
        super(props);
        this.state = {
            post: "",
            redirectToHome: false,
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

    componentDidMount = () => {
        const postId = this.props.match.params.postId
        singlePost(postId).then(data => {
            this.setState({post: data})
        })
    }

    getPotentialPhoto = (post) => {
        const image = post.photo ? (
            <img 
                src={`${process.env.REACT_APP_API_URL}/${post.photo.data}?${new Date().getTime()}`} 
                alt={post.title}
                style={{height: '50vh', width: '100%', objectFit: 'cover'}}
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
        return (
            <div className="card-body">
                {this.getPotentialPhoto(post)}
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">{post.body}</p>
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
        const { post } = this.state;

        if (this.state.redirectToHome) {
            return <Redirect to={'/'} />
        }
        return (
            <div className="container">
                <h2 className="display-2 my-5">{post.title}</h2>
                {!post ? <div className="jumbotron text-center">
                    <h2>Loading...</h2>
                </div> : (this.renderPost(post))}
            </div>
        )
    }
}

export default SinglePost;
