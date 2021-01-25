import React, { Component } from "react";
import GoogleLogin from "react-google-login";
import { Redirect } from 'react-router-dom'
import { fetchGoogleLogin, authenticate } from '../auth'
 
class GoogleOAuthLogin extends Component {
    constructor() {
        super();
        this.state = {
            redirectToReferrer: false
        };
    }

    responseFromGoogle = response => {
        const { googleId, name, email, imageUrl } = response.profileObj;
        const user = {
            password: googleId,
            name: name,
            email: email,
            imageUrl: imageUrl
        };
        fetchGoogleLogin(user).then(data => {
            if (data.error) {
                console.log("Error Login. Please try again..");
            } else {
                authenticate(data, () => {
                    this.setState({ redirectToReferrer: true });
                });
            }
        });
    };
 
    render() {

        const { redirectToReferrer } = this.state;

        if (redirectToReferrer) {
            return <Redirect to="/" />;
        }

        return (
            <div className="container">
                <GoogleLogin
                    clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}
                    buttonText="Login with Google"
                    onSuccess={this.responseFromGoogle}
                    onFailure={this.responseFromGoogle}
                />
            </div>
        );
    }
}
 
export default GoogleOAuthLogin;