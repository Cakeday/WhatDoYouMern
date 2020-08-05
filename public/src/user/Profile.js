import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { Redirect, Link } from 'react-router-dom';
import { read } from './apiUser';
import DefaultProfile from '../images/defaultProfile.jpg';
import DeleteUser from './DeleteUser';
import FollowProfileButton from './FollowProfileButton';
import ProfileTabs from './ProfileTabs'




class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: { following: [], followers: [] },
            photoUrl: "",
            redirectToSignin: false,
            following: false,
            error: "",
        };
    }

    checkFollow = (user) => {
        const jwt = isAuthenticated()
        const match = user.followers.find(follower => {
            return follower._id === jwt.user._id
        })
        return match
    }

    clickFollowButton = (callApi) => {
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        callApi(userId, token, this.state.user._id)
        .then(data => {
            if (data.error) {
                this.setState({error: data.error})
            } else {
                this.setState({user: data, following: !this.state.following})
            }
        })
    }


    init = (userId) => {
        const token = isAuthenticated().token
        read(userId, token)
        .then(data => {
            if (data.error) {
                this.setState({redirectToSignin: true})
            } else {
                let following = this.checkFollow(data)
                if (data.photo) {
                    this.setState({photoUrl: data.photo.data})
                }
                this.setState({user: data, following})
            }
        })
    }

    componentDidMount() {
        this.init(this.props.match.params.userId)
    }

    componentWillReceiveProps(props) {
        this.init(props.match.params.userId)
    }
    
    
    render() {
        const { redirectToSignin, user, photoUrl } = this.state
        if (redirectToSignin) return <Redirect to="/signin" />

        const finalPhotoUrl = user.photo ? `${process.env.REACT_APP_API_URL}/${photoUrl}?${new Date().getTime()}` : DefaultProfile

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Profile</h2>

                <div className="row">
                    <div className="col-md-6">
                        <img 
                            style={{height: '200px', width: 'auto'}}
                            src={finalPhotoUrl} 
                            alt={user.name}
                            className="img-thumbnail"
                        /> 
                    </div>
                    <div className="col-md-6">
                        <div className="lead mt-2">
                            <p>Hello {user.name}</p>
                            <p>Email: {user.email}</p>
                            <p>{`Joined on ${new Date(user.created).toDateString()}`}</p>
                        </div>
                        {isAuthenticated().user && 
                            isAuthenticated().user._id === user._id ? (
                                <div className="d-inline-block">
                                    <Link to={`/user/edit/${user._id}`} className="btn btn-raised btn-success mr-5">Edit Profile</Link>
                                    <DeleteUser userId={user._id} />
                                </div>
                            ) : (
                                <FollowProfileButton following={this.state.following} onButtonClick={this.clickFollowButton} />
                            )}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 my-5">
                        <hr />
                        <p className="lead">{user.about}</p>
                        <hr />
                        <ProfileTabs followers={user.followers} following={user.following} photoUrl={finalPhotoUrl} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Profile;
