import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { signout, isAuthenticated } from '../auth';

const isActive = (history, path) => {
    if (history.location.pathname === path) return {color: "#ff9900"}
}



const Menu = ({history}) => {
    
    const isAuth = isAuthenticated()

    return (
        <div>
            <ul className="nav nav-tabs bg-primary">
                <li className="nav-item">
                    <Link className="nav-link" style={isActive(history, "/")} to="/">Home</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" style={isActive(history, "/users")} to="/users">Users</Link>
                </li>

                {!isAuth && (
                    <>
                        <li className="nav-item">
                            <Link className="nav-link" style={isActive(history, "/signin")} to="/signin">Sign in</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" style={isActive(history, "/signup")} to="/signup">Sign up</Link>
                        </li>
                    </>
                )}

                {isAuth && (
                    <>
                        <li className="nav-item">
                            <Link className="nav-link" onClick={() => history.push(`/user/${isAuth.user._id}`)} to={'/findpeople'} style={isActive(history, "/findpeople")}>Find People</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" onClick={() => history.push(`/create/post`)} to={'/create/post'} style={isActive(history, "/create/post")}>Create Post</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" onClick={() => history.push(`/user/${isAuth.user._id}`)} to={`/user/${isAuth.user._id}`} style={isActive(history, `/user/${isAuthenticated().user._id}`)}>{`${isAuthenticated().user.name}'s profile`}</Link>
                        </li>
                        <li className="nav-item">
                            {/* eslint-disable-next-line */}
                            <a className="nav-link" onClick={() => signout(() => history.push('/'))} style={isActive(history, "/signout"), {cursor: "pointer", color: "#ffffff"}}>Sign out</a>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
}

export default withRouter(Menu);
