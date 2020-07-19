import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { read, update } from './apiUser'
import { Redirect } from 'react-router-dom';


class EditProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: "",
            name: "",
            email: "",
            password: "",
            redirectToProfile: false,
            error: ""
        };
    }


    init = (userId) => {
        const token = isAuthenticated().token
        read(userId, token)
        .then(data => {
            if (data.error) {
                this.setState({redirectToSignin: true})
            } else {
                this.setState({id: data._id, name: data.name, email: data.email, error: ""})
            }
        })
    }

    componentDidMount() {
        this.init(this.props.match.params.userId)
    }

    isValid = () => {
        const {name, email, password} = this.state

        if (name.length === 0) {
            this.setState({error: "Name is required"})
            return false
        }
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?w+)*(\.\w{2,3})+$/.test(email)) {
            this.setState({error: "A valid email is required"})
            return false
        }
        if (password.length >= 1 && password.length < 6) {
            this.setState({error: "Password must be at least 6 characters long"})
            return false
        }
        return true
    }

    handleChange = (name) => e => {
        this.setState({[name]: e.target.value})
    }

    clickSubmit = e => {
        e.preventDefault()

        if (this.isValid()) {
            let { name, email, password } = this.state
    
            const user = {name, email, password}
            
            // console.log(user)
            const userId = this.props.match.params.userId
            const token = isAuthenticated().token
    
            update(userId, token, user)
            .then(data => {
                console.log(data)
                if (data.error) this.setState({error: data.error})
                else this.setState({
                    redirectToProfile: true
                })
            })
        }


    }


    signupForm = (name, email, password) => (
        <form>
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
        const { id, name, email, password, redirectToProfile, error } = this.state

        if (redirectToProfile) {
            return <Redirect to={`/user/${id}`} />
        }


        return (
            <div className="container">
                <h2 className="my-5">Edit Profile</h2>
                <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                    {error}
                </div>

                {this.signupForm(name, email, password)}
            </div>
        );
    }
}

export default EditProfile;
