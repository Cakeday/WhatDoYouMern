import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import DefaultProfile from '../images/defaultProfile.jpg';


class ProfileTabs extends Component {
    render() {
        const { following, followers } = this.props
        return (
            <div className="row">
                <div className="col-md-4">
                    <h3 className="text-primary">Followers</h3>
                    <hr />
                    {followers.map(person => {
                        const finalPhotoUrl = person.photo ? `${process.env.REACT_APP_API_URL}/${person.photo.data}?${new Date().getTime()}` : DefaultProfile
                        return (
                            <div key={person._id}>
                                <Link to={`/user/${person._id}`}>
                                    <img
                                        style={{borderRadius: "50%", border: "1px solid black"}}
                                        className="float-left mr-2" 
                                        height="30px" 
                                        width="30px" 
                                        src={`${finalPhotoUrl}?${new Date().getTime()}`} 
                                        alt={person.name}>
                                    </img>
                                </Link>
                                <p className="lead">{person.name}</p>
                            </div>
                        )
                    })}
                </div>
                <div className="col-md-4">
                    <h3 className="text-primary">Following</h3>
                    <hr />
                    {following.map(person => {
                        const finalPhotoUrl = person.photo ? `${process.env.REACT_APP_API_URL}/${person.photo.data}?${new Date().getTime()}` : DefaultProfile
                        return (
                            <div key={person._id}>
                                <Link to={`/user/${person._id}`}>
                                    <img 
                                        style={{borderRadius: "50%", border: "1px solid black"}}
                                        className="float-left mr-2" 
                                        height="30px" 
                                        width="30px" 
                                        src={`${finalPhotoUrl}?${new Date().getTime()}`} 
                                        alt={person.name}>
                                    </img>
                                </Link>
                                <p className="lead">{person.name}</p>
                            </div>
                        )
                    })}
                </div>
                <div className="col-md-4">
                    <h3 className="text-primary">Posts</h3>
                </div>
            </div>
        );
    }
}

export default ProfileTabs;
