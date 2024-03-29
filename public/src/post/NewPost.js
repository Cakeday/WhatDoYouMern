import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { create } from './apiPost'
import { Redirect } from 'react-router-dom';


class NewPost extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            body: "",
            photo: "",
            error: "",
            user: {},
            fileSize: 0,
            loading: false,
            redirectToProfile: false
        };
    }

    componentDidMount() {
        this.postData = new FormData()
        this.setState({user: isAuthenticated().user})
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
            const userId = isAuthenticated().user._id
            const token = isAuthenticated().token

            create(userId, token, this.postData)
            .then(data => {
                if (data.error) this.setState({error: data.error})
                else {
                    this.setState({
                        loading: false, 
                        title: "",
                        body: "",
                        photo: "",
                        redirectToProfile: true
                    })
                }
            })
        }


    }


    newPostForm = (title, body) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Profile Photo</label>
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
            <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Create Post</button>
        </form>
    )






    render() {
        const { title, body, user, error, loading, redirectToProfile } = this.state

        if (redirectToProfile) {
            return <Redirect to={`/user/${user._id}`} />
        }


        return (
            <div className="container">
            
                {loading ? <div className="jumbotron text-center">
                    <h2>Loading...</h2>
                </div> : ""}

                <h2 className="my-5">Create a new post</h2>
                <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                    {error}
                </div>

                {this.newPostForm(title, body)}
            </div>
        );
    }
}

export default NewPost;
