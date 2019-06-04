import React, { Component } from 'react'
import './css/login.css'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
const RECAPTCHA_KEY = process.env.REACT_APP_RECAPTCHA_KEY;
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
var lat, lng

var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};
export default class login extends Component {

    constructor(props) {
        super(props)
        const counterTry = localStorage.getItem("try") || 0;
        this.state = { showCapcha: counterTry < 3, haveToken: false };
    }


    checkLogin = (e) => {
        e.preventDefault()
        var user = e.target.user.value
        var password = e.target.password.value
        var capcha = e.target["g-recaptcha-response"].value
        const { lat, lng } = this.state
        var { showCapcha } = this.state
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
            + today.getHours() + '-' + (today.getMinutes() + 1) + '-' + today.getSeconds();

        URL = api_url + "/login"
        var data = {
            user: user,
            password: password,
            capcha: capcha,
            lat: lat,
            lng, lng
        }
        console.log(data)
        if (!showCapcha && !capcha) {
            alert('reCAPTCHA is required');
        }
        else {
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
                        localStorage.removeItem("try");
                        window.location.href = "/home"
                    } else {
                        let counterTry = parseInt(localStorage.getItem("try") ? localStorage.getItem("try") : 0) + 1;
                        console.log(counterTry)
                        localStorage.setItem("try", counterTry);

                        var message = data.message
                        document.getElementById("error-login").innerHTML = message
                        if (counterTry < 3) {
                            this.setState({ showCapcha: true });
                            window.grecaptcha.reset();
                        } else {
                            console.log(showCapcha)
                            this.setState({ showCapcha: false });

                        }

                    }
                });
        }

    }
    goRegister = () => {
        window.location.href = "/reg"
    }

    success = (pos) => {
        var crd = pos.coords;

        this.setState({

            lat: crd.latitude
            ,
            lng: crd.longitude

        })
        console.log('More or less ${crd.accuracy} meters');
        console.log('More or less ${crd.accuracy} meters');
        console.log('More or less ${crd.accuracy} meters');
    }

    error = (err) => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    componentWillMount = () => {
        navigator.geolocation.getCurrentPosition(this.success, this.error, options);
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
                    console.log(data)
                    this.setState({
                        haveToken: true
                    })
                }))
        }
    }
    onChange = (value) => {
        console.log("Captcha value:", value);
    }
    forgetPassword = () => {
        console.log("test")
    }
    componentDidMount() {
        const script = document.createElement('script')
        script.src = 'https://www.google.com/recaptcha/api.js';
        document.body.appendChild(script);
    }
    render() {
        var { haveToken, showCapcha } = this.state
        console.log(showCapcha)
        if (haveToken) {
            return this.props.history.push("/home")
        } else {
            return (<div className="padding-center">

                <div className="container-login">
                    <div className="text-chic-chat">
                        Chic Chat</div>
                    <form className="form-login" onSubmit={this.checkLogin}>
                        <input className="inputLogin input" placeholder="USERNAME" type="text" name="user" /><br />
                        <input className="inputLogin inputLoginPassword input" placeholder="PASSWORD" type="password" name="password" /><br />

                        <div className="errorLogin" id="error-login"></div>


                        <div className="container-submit">
                            <input id="loginBT" className="buttonLogin button is-primary" type="submit" value="Login"></input>
                        </div>
                        <div className="text-register-forget">

                            <div className="buttonRegister" onClick={this.goRegister}>Register</div>
                            <Link to={"/forgetPassword"} className="buttonRegister text-forgetpassword" onClick={this.forgetPassword}>Forget Password</Link>
                        </div>
                        <div
                            hidden={showCapcha}
                            class="g-recaptcha"
                            data-sitekey={RECAPTCHA_KEY}>
                        </div>

                    </form>
                </div>
            </div>)
        }

    }
}
