import React, { Component } from 'react';
import { isAuthenticated, signout } from '../auth';
import { remove } from './apiUser'
import { Redirect } from 'react-router-dom';

class DeleteUser extends Component {

    state = {
        redirect: false
    }

    deleteAccount = () => {
        const token = isAuthenticated().token
        const userId = this.props.userId
        remove(userId, token)
        .then(data => {
            if (data.error) {
                console.log(data.error)
            }
            else {
                // signout user and redirect
                signout(() => {console.log("User is deleted")})
                this.setState({redirect: true})
            }
        })
    }

    deleteConfirmation = () => {
        let answer = window.confirm("Are you sure you want to delete your account?")
        if (answer) {
            this.deleteAccount()
        }
    }
    render() {
        if (this.state.redirect) {
            return <Redirect to="/" />
        }
        return (
            <button onClick={this.deleteConfirmation} className="btn btn-raised btn-danger">Delete profile</button>
        );
    }
}

export default DeleteUser;
