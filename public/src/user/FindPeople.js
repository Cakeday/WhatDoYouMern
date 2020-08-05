import React, { Component } from 'react';
import { findPeople, follow } from './apiUser';
import { Link } from 'react-router-dom';
import DefaultProfile from '../images/defaultProfile.jpg';
import { isAuthenticated } from '../auth'

class FindPeople extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            error: "",
            open: false,
            followMessage: ""
        };
    }

    componentDidMount() {
        const auth = isAuthenticated()
        const userId = auth.user._id
        const token = auth.token
        findPeople(userId, token).then(data => {
            if (data.error) {
                console.log(data.error)
            }
            else {
                this.setState({users: data})
            }
        })
    }

    clickFollow = (user, i) => {
        const auth = isAuthenticated()
        const userId = auth.user._id
        const token = auth.token

        follow(userId, token, user._id)
        .then(data => {
            if (data.error) {
                this.setState({error: data.error})
            } else {
                let toFollow = this.state.users
                toFollow.splice(i, 1)
                this.setState({
                    users: toFollow,
                    open: true,
                    followMessage: `Following ${user.name}`
                })
            }
        })
    }

    renderUsers = (users) => (
        <div className="row">
            {users.map((user, i) => {
                const photoUrl = user.photo ? `${process.env.REACT_APP_API_URL}/${user.photo.data}?${new Date().getTime()}` : `${DefaultProfile}`
                return (
                    <div key={i} className="card col-md-4">
                        <img 
                            style={{height: '200px', width: 'auto'}}
                            src={photoUrl} 
                            alt={user.name}
                            className="img-thumbnail"
                        />
                        <div className="card-body">
                            <h5 className="card-title">{user.name}</h5>
                            <p className="card-text">{user.email}</p>
                            <Link to={`/user/${user._id}`} className="btn btn-primary btn-raised btn-sm">view profile</Link>
                            <button onClick={() => this.clickFollow(user, i)} className="btn btn-raised btn-info float-right">Follow</button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
    
    
    render() {
        const { users, open, followMessage } = this.state
        return (
            <div className="container">
                <h2 className="my-5">Users</h2>

                { open && (<p className="alert alert-success">{followMessage}</p>)}

                {this.renderUsers(users)}
            </div>
        );
    }
}

export default FindPeople;
