export const create = (userId, token, post) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/new/${userId}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: post
    })
    .then(res => {return res.json()})
    .catch(err => console.log(err))
}

export const list = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/posts`, {
        method: "GET",
    })
    .then(res => {return res.json()})
    .catch(err => console.log(err))
}

export const singlePost = (postId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
        method: "GET",
    })
    .then(res => {
        return res.json()
    })
    .catch(err => console.log(err))
}

export const listByUser = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/posts/by/${userId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(res => {return res.json()})
    .catch(err => console.log(err))
}

export const remove = (postId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
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

export const update = (postId, token, post) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: post
    })
    .then(res => {return res.json()})
    .catch(err => console.log(err))
}

export const like = (userId, token, postId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/like`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({userId, postId})
    })
    .then(res => {return res.json()})
    .catch(err => console.log(err))
}

export const unlike = (userId, token, postId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/unlike`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({userId, postId})
    })
    .then(res => {return res.json()})
    .catch(err => console.log(err))
}

export const comment = (userId, token, postId, comment) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/comment`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({userId, postId, comment})
    })
    .then(res => {return res.json()})
    .catch(err => console.log(err))
}

export const uncomment = (userId, token, postId, comment) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/uncomment`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({userId, postId, comment})
    })
    .then(res => {return res.json()})
    .catch(err => console.log(err))
}