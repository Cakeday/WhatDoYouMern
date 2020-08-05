export const create = (userId, token, post) => {
    console.log(post)
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