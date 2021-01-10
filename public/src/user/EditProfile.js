import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { read, update, updateUser } from './apiUser'
import { Redirect } from 'react-router-dom';
import DefaultProfile from '../images/defaultProfile.jpg';


class EditProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: "",
            name: "",
            email: "",
            password: "",
            about: "",
            fileSize: 0,
            photoUrl: "",
            redirectToProfile: false,
            error: "",
            loading: false
        };
    }


    init = (userId) => {
        const token = isAuthenticated().token
        read(userId, token)
        .then(data => {
            if (data.error) {
                this.setState({redirectToSignin: true})
            } else {
                if (data.photo) {
                    this.setState({photoUrl: data.photo.data})
                }
                this.setState({id: data._id, name: data.name, email: data.email, about: data.about, error: ""})
            }
        })
    }

    componentDidMount() {
        this.userData = new FormData()
        this.init(this.props.match.params.userId)
    }

    isValid = () => {
        const { name, email, password, fileSize } = this.state

        if (fileSize > 100000) {
            this.setState({error: "Filesize should be less than 1mb", loading: false})
            return false
        }
        if (name.length === 0) {
            this.setState({error: "Name is required", loading: false})
            return false
        }
        if (!/^\w+([.-]?\w+)*@\w+([.-]?w+)*(\.\w{2,3})+$/.test(email)) {
            this.setState({error: "A valid email is required", loading: false})
            return false
        }
        if (password.length >= 1 && password.length < 6) {
            this.setState({error: "Password must be at least 6 characters long", loading: false})
            return false
        }
        return true
    }

    handleChange = (name) => e => {
        this.setState({error: ""})
        const value = name === "image" ? e.target.files[0] : e.target.value
        const fileSize = name === "image" ? e.target.files[0].size : 0
        this.userData.set(name, value)
        this.setState({[name]: value, fileSize})
    }

    clickSubmit = e => {
        e.preventDefault()
        this.setState({loading: true})

        const { name, email, password } = this.state

        this.userData.set("name", name)
        this.userData.set("email", email)
        this.userData.set("password", password)
        
        if (this.isValid()) {
            const userId = this.props.match.params.userId
            const token = isAuthenticated().token
    
            update(userId, token, this.userData)
            .then(data => {
                if (data.error) this.setState({error: data.error})
                else {
                    updateUser(data, () => {
                        this.setState({redirectToProfile: true})
                    })
                }
            })
        }


    }


    editForm = (name, email, password, about) => (
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
                <label className="text-muted">Name</label>
                <input 
                    onChange={this.handleChange("name")} 
                    type="text" 
                    className="form-control"
                    value={name} 
                />
            </div>
            <div className="form-group">
                <label className="text-muted">About</label>
                <textarea 
                    onChange={this.handleChange("about")} 
                    type="text" 
                    className="form-control"
                    value={about} 
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input 
                    onChange={this.handleChange("email")} 
                    type="email" 
                    className="form-control"
                    value={email} 
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input 
                    onChange={this.handleChange("password")} 
                    type="password" 
                    className="form-control"
                    value={password} 
                    placeholder="Leave this empty if you don't want to change your password"
                />
            </div>
            <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Update</button>
        </form>
    )






    render() {
        const { id, name, email, password, about, photoUrl, redirectToProfile, error, loading } = this.state

        if (redirectToProfile) {
            return <Redirect to={`/user/${id}`} />
        }

        const finalPhotoUrl = id ? `${process.env.REACT_APP_API_URL}/${photoUrl}?${new Date().getTime()}` : DefaultProfile

        return (
            <div className="container">
            
                <h2 className="my-5">Edit Profile</h2>
                
                {loading ? <div className="jumbotron text-center">
                    <h2>Loading...</h2>
                </div> : ""}

                <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                    {error}
                </div>

                { photoUrl !== '' && <img 
                    style={{height: '200px', width: 'auto'}}
                    src={finalPhotoUrl} 
                    alt={name}
                    className="img-thumbnail"
                />}

                {this.editForm(name, email, password, about)}
            </div>
        );
    }
}

export default EditProfile;
