import React, { Component } from 'react';
import { list } from './apiPost';
import { Link } from 'react-router-dom';
import DefaultPostPicture from '../images/defaultPostPicture.jpg';

class Posts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: []
        };
    }

    getPotentialPhoto = (post) => {
        const image = post.photo ? (
            <img 
                src={`${process.env.REACT_APP_API_URL}/${post.photo.data}?${new Date().getTime()}`} 
                alt={post.title}
                style={{height: '200px', width: 'auto'}}
                className="img-thumbnail"
            />
        ) : (
            <img 
                src={`${DefaultPostPicture}`} 
                alt="Default"
                style={{height: '200px', width: 'auto'}}
                className="img-thumbnail"
            />
        )
        return image
    }

    componentDidMount() {
        list().then(data => {
            this.setState({posts: data})
            console.log(data)
        })
    }

    renderPosts = (posts) => {
        return (
            <div className="row">
                    {/* const photoUrl = user.photo ? `${process.env.REACT_APP_API_URL}/${user.photo.data}?${new Date().getTime()}` : `${DefaultProfile}` */}
                {posts.map((post, i) => {
                    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : ""
                    const posterName = post.postedBy ? post.postedBy.name : "Unknown author"

                    return (
                        <div key={i} className="card col-md-4">
                            <div className="card-body">
                                {this.getPotentialPhoto(post)}
                                <h5 className="card-title">{post.title}</h5>
                                <p className="card-text">{post.body.substring(0, 100)}</p>
                                <br />
                                <p className="font-italic mark">
                                    Posted by <Link to={posterId}>{posterName}</Link> on {new Date(post.created).toDateString()}
                                </p>
                                <Link to={`/post/${post._id}`} className="btn btn-primary btn-raised btn-sm">Read more</Link>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
    
    
    render() {
        const { posts } = this.state
        return (
            <div className="container">
                <h2 className="my-5">Recent Posts</h2>

                {this.renderPosts(posts)}
            </div>
        );
    }
}

export default Posts;
