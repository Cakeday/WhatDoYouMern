import React, { Component } from 'react';
import { singlePost, update } from './apiPost'
import { isAuthenticated } from "../auth";
import { Redirect } from 'react-router-dom';
import DefaultPostPicture from '../images/defaultPostPicture.jpg'


class EditPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            title: '',
            body: '',
            error: '',
            photoUrl: '',
            redirectToProfile: false,
            loading: false
        }
    }

    init = (postId) => {
        singlePost(postId)
        .then(data => {
            if (data.error) {
                this.setState({redirectToProfile: true})
            } else {
                if (data.photo) {
                    this.setState({photoUrl: data.photo.data})
                }
                this.setState({
                    id: data._id,
                    title: data.title,
                    body: data.body,
                    error: ""
                })
            }
        })
    }

    componentDidMount() {
        this.postData = new FormData()
        this.init(this.props.match.params.postId)
    }

    isValid = () => {
        const { title, body, fileSize } = this.state

        if (fileSize > 100000) {
            this.setState({error: "Filesize should be less than 1mb", loading: false})
            return false
        }
        if (title.length === 0 || body.length === 0) {
            this.setState({error: "All fields are required", loading: false})
            return false
        }
        return true
    }

    handleChange = (name) => e => {
        this.setState({error: ""})
        const value = name === "image" ? e.target.files[0] : e.target.value
        const fileSize = name === "image" ? e.target.files[0].size : 0
        this.postData.set(name, value)
        this.setState({[name]: value, fileSize})
    }

    clickSubmit = e => {
        e.preventDefault()
        this.setState({loading: true})

        const { title, body } = this.state

        this.postData.set("title", title)
        this.postData.set("body", body)

        if (this.isValid()) {
            const postId = this.state.id
            const token = isAuthenticated().token

            update(postId, token, this.postData)
            .then(data => {
                if (data.error) this.setState({error: data.error})
                else {
                    this.setState({
                        loading: false, 
                        title: "",
                        body: "",
                        redirectToProfile: true
                    })
                }
            })
        }


    }

    editPostForm = (title, body) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Post Photo</label>
                <input 
                    onChange={this.handleChange("image")} 
                    type="file" 
                    accept="image/*"
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Title</label>
                <input 
                    onChange={this.handleChange("title")} 
                    type="text" 
                    className="form-control"
                    value={title} 
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Body</label>
                <textarea 
                    onChange={this.handleChange("body")} 
                    type="text" 
                    className="form-control"
                    value={body} 
                />
            </div>
            <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Update Post</button>
        </form>
    )
    
    render() {

        const { id, title, body, redirectToProfile, photoUrl, loading, error } = this.state


        const finalPhotoUrl = id ? `${process.env.REACT_APP_API_URL}/${photoUrl}?${new Date().getTime()}` : DefaultPostPicture


        if (redirectToProfile) {
            return <Redirect to={`/user/${isAuthenticated().user._id}`} />
        }

        return (
            <div className='container'>
                <h2 className='my-5'>{ title }</h2>

                {loading ? <div className="jumbotron text-center">
                    <h2>Loading...</h2>
                </div> : ""}

                <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                    {error}
                </div>

                { photoUrl !== '' && <img 
                    style={{height: '200px', width: 'auto'}}
                    src={finalPhotoUrl} 
                    alt={title}
                    className="img-thumbnail"
                />}
                {this.editPostForm(title, body)}
            </div>
        );
    }
}

export default EditPost;
