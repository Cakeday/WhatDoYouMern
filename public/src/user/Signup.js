import React, { Component } from 'react'
import { signup } from '../auth';
import { Link } from 'react-router-dom';


class Signup extends Component {

    constructor() {
        super()
        this.state = {
            name: "",
            email: "",
            password: "",
            error: "",
            open: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange = (name) => e => {
        this.setState({error: ""})
        this.setState({[name]: e.target.value})
    }

    clickSubmit = e => {
        e.preventDefault()
        const { name, email, password } = this.state
        const user = {name, email, password}

        signup(user)
        .then(data => {
            if (data.error) this.setState({error: data.error})
            else this.setState({
                name: "",
                email: "",
                password: "",
                error: "",
                open: true
            })
        })

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
                />
            </div>
            <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Submit</button>
        </form>
    )

    



    render() {
        let { name, email, password, error, open } = this.state
        return (
            <div className="container">

                <h2 className="mt-5 mb-5">Signup</h2>

                <div className="alert alert-danger" style={{ display: error ? "" : "none"}}>
                    {error}
                </div>
                <div className="alert alert-info" style={{ display: open ? "" : "none"}}>
                    New account successfully created, please <Link to="/signin">sign in</Link> :)
                </div>

                {this.signupForm(name, email, password)}
            </div>
        )
    }
}

export default Signup