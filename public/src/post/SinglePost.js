import React, { Component } from 'react';
import { singlePost } from './apiPost'
import { Link } from 'react-router-dom'
import DefaultPostPicture from '../images/defaultPostPicture.jpg';


class SinglePost extends Component {

    constructor(props) {
        super(props);
        this.state = {
            post: ""
        }
    }
    

    componentDidMount = () => {
        const postId = this.props.match.params.postId
        singlePost(postId).then(data => {
            console.log(data)
            this.setState({post: data})
        })
    }

    getPotentialPhoto = (post) => {
        console.log(post)
        const image = post.photo ? (
            <img 
                src={`${process.env.REACT_APP_API_URL}/${post.photo.data}?${new Date().getTime()}`} 
                alt={post.title}
                style={{height: '50vh', width: 'auto', objectFit: 'cover'}}
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
                <Link to={'/'} className="btn btn-primary btn-raised btn-sm">Back to posts</Link>
            </div>
        )
    }

    render() {
        const { post } = this.state;
        return (
            <div className="container">
                <h2 className="display-2 my-5">{post.title}</h2>
                {this.renderPost(post)}
            </div>
        )
    }
}

export default SinglePost;
