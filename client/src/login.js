import React, { Component } from 'react'
import './css/login.css'
const api_url = process.env.REACT_APP_API_URL

function press_enter() {
    // Get the input field
    var input = document.getElementById("password");
    // Execute a function when the user releases a key on the keyboard
    input.addEventListener("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            document.getElementById("button-submit").click();
        }
    });

}
export default class login extends Component {

    constructor(props) {
        super(props)
        this.state = { counter: 0, haveToken: false };
    }

    checkLogin = (e) => {
        e.preventDefault()
        var user = e.target.user.value
        var password = e.target.password.value
        if (!user == "" & password == "") {
            document.getElementById("error-login").innerHTML = "Please enter your password"
        }
        else if (user == "" & !password == "") {
            document.getElementById("error-login").innerHTML = "Please enter your user"
        }
        else if (user == "" & password == "") {
            document.getElementById("error-login").innerHTML = "Please enter your user and password"
        }
        else {
            URL = api_url + "/login"
            var data = {
                user: user,
                password: password
            }
            fetch(URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    if (!data.error) {
                        console.log(data)
                        localStorage.setItem('token', data.token.token);
                        localStorage.setItem('id', data.token.id_user);
                        window.location.href = "/home"
                    } else {
                        var message = data.message
                        console.log(message)
                        document.getElementById("error-login").innerHTML = message

                    }
                });
        }
    }
    goRegister = () => {
        window.location.href = "/reg"
    }
    componentWillMount = () => {
        var token = window.localStorage.getItem("token")
        var data = {
            token: token
        }
        if (token == null) {
        } else {
            fetch(api_url + "/check_token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }).then(response => response.json()
                .then(data => {
                    this.setState({
                        haveToken: true
                    })
                }))
        }
    }
    render() {
        // window.localStorage.removeItem("id")
        // window.localStorage.removeItem("token")
        var { haveToken } = this.state
        if (haveToken) {
            this.props.history.push("/home")
        } else {
            return (<div className="padding-center">
                <div className="container-login">
                    <div className="text-chic-chat">
                        Chic Chat</div>
                    <form className="form-login" onSubmit={this.checkLogin}>
                        <input className="inputLogin input" placeholder="USERNAME" type="text" name="user" /><br />
                        <input className="inputLogin input" placeholder="PASSWORD" type="password" name="password" /><br />
                        <div className="errorLogin" id="error-login"></div>
                        <div className="container-submit">
                            <div className="buttonRegister" onClick={this.goRegister}>Register</div>
                            <input className="button is-primary" type="submit" value="Login"></input>
                        </div>
                    </form>
                </div>
            </div>)
        }
        return (
            <div className="padding-center">
                <div className="container-login">
                    <div className="text-chic-chat">
                        Chic Chat</div>
                    <form className="form-login" onSubmit={this.checkLogin}>
                        <input id="password" className="inputLogin input" placeholder="USERNAME" type="text" name="user" /><br />
                        <input id="password" className="inputLogin input" placeholder="PASSWORD" type="password" name="password" /><br />
                        <div className="errorLogin" id="error-login"></div>
                        <div className="container-submit">
                            <div className="buttonRegister" onClick={this.goRegister}>Register</div>
                            <input id="button-submit" className="button is-primary" type="submit" value="Login"></input>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
