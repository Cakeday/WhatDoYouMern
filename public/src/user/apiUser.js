export const read = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
    .then(res => {
        return res.json()
    })
    .catch(err => console.log(err))
}

export const update = (userId, token, user) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: user
    })
    .then(res => {return res.json()})
    .catch(err => console.log(err))
}

export const remove = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
    .then(res => {return res.json()})
    .catch(err => console.log(err))
}

export const list = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/users`, {
        method: "GET",
    })
    .then(res => {return res.json()})
    .catch(err => console.log(err))

}

export const updateUser = (user, next) => {
    if (typeof window !== undefined) {
        if (localStorage.getItem('jwt')) {
            let auth = JSON.parse(localStorage.getItem('jwt'))
            auth.user = user.user
            localStorage.setItem('jwt', JSON.stringify(auth))
            next()
        }
    }
}

export const follow = (userId, token, followId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/follow`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",

        },
        body: JSON.stringify({userId, followId})
    })
    .then(res => {return res.json()})
    .catch(err => console.log(err))
}

export const unfollow = (userId, token, unfollowId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/unfollow`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",

        },
        body: JSON.stringify({userId, unfollowId})
    })
    .then(res => {return res.json()})
    .catch(err => console.log(err))
}

export const findPeople = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/findpeople/${userId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",

        },
    })
    .then(res => {return res.json()})
    .catch(err => console.log(err))
}