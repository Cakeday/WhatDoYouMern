import React, { Component } from 'react';
import { list } from './apiUser';
import { Link } from 'react-router-dom';
import DefaultProfile from '../images/defaultProfile.jpg';

class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        };
    }

    componentDidMount() {
        list().then(data => {
            if (data.error) {
                console.log(data.error)
            }
            else {
                this.setState({users: data})
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
                            style={{height: '200px', width: 'auto', objectFit: 'contain'}}
                            src={photoUrl} 
                            alt={user.name}
                            className="img-thumbnail"
                        />
                        <div className="card-body">
                            <h5 className="card-title">{user.name}</h5>
                            <p className="card-text">{user.email}</p>
                            <Link to={`/user/${user._id}`} className="btn btn-primary btn-raised btn-sm">view profile</Link>
                        </div>
                    </div>
                )
            })}
        </div>
    )
    
    
    render() {
        const { users } = this.state
        return (
            <div className="container">
                <h2 className="my-5">Users</h2>

                {this.renderUsers(users)}
            </div>
        );
    }
}

export default Users;
