export const signup = user => {
    console.log("made it here")
    console.log(process.env)
    return fetch(`${process.env.REACT_APP_API_URL}/signup`, {
       method: "POST",
       headers: {
           Accept: "application/json",
           "Content-Type": "application/json"
       },
       body: JSON.stringify(user)
   })
   .then(res => {
       console.log("inside of the first .then " + res)
       return res.json()
   })
   .catch(err => console.log(err))
}

export const signin = user => {
    return fetch(`${process.env.REACT_APP_API_URL}/signin`, {
       method: "POST",
       headers: {
           Accept: "application/json",
           "Content-Type": "application/json"
       },
       body: JSON.stringify(user)
   })
   .then(res => {
       return res.json()
   })
   .catch(err => console.log("here is the error: " + err))
}

export const authenticate = (jwt, next) => {
    if (typeof window !== undefined) {
        localStorage.setItem("jwt", JSON.stringify(jwt))
        next()
    }
}

export const signout = (next) => {
    if (typeof window !== undefined) localStorage.removeItem("jwt")
    next()
    return fetch(`${process.env.REACT_APP_API_URL}/signout`, {
        method: "GET"
    })
    .then(res => {
        console.log("signout", res)
        return res.json()
    })
    .catch(err => console.log(err))
}

export const isAuthenticated = () => {
    if (typeof window == undefined) {
        return false
    }
    const token = localStorage.getItem("jwt")
    if (token) {
        return JSON.parse(token)
    } else {
        return false
    }
}