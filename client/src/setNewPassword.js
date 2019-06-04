import React, { Component } from 'react'
import './css/setNewPassword.css'
import swal from 'sweetalert';
const api_url = process.env.REACT_APP_API_URL

export default class setNewPassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isFetch: false
        }
    }
    setPassword = (e) => {
        e.preventDefault()
        var token = new URLSearchParams(this.props.location.search).get("token")
        var password = e.target.password.value
        var cpassword = e.target.cpassword.value
        if (password != cpassword) {
            document.getElementById("set-password-error").innerHTML = "Password and Confirm Password doesn't match"
        } else {

            console.log(password)
            console.log(token)
            var api = api_url + "/setNewPassword"
            var data = {
                password: password,
                token: token
            }
            fetch(api, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ data }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        swal({
                            title: "Success !!",
                            text: "Let's login to talk someone :')",
                            icon: "success",
                            button: "OK",
                        }).then(() => {
                            window.location.href = '/'
                        })

                    } else {
                        document.getElementById("set-password-error").innerHTML = data.message

                    }
                })
        }
    }

    render() {
        return (
            <div className="container-forget-password-page">
                <form onSubmit={this.setPassword}>
                    <div className="text-forget-password">
                        Reset Password

                </div>
                    <div className="text-email-forget">

                        New Password
                </div>
                    <input id="password" class="input" type="password" placeholder="New Password" required></input>
                    <div className="text-email-forget text-confirm-new-password">

                        Confirm New Password
                </div>
                    <input id="cpassword" class="input" type="password" placeholder="Confirm New Password" required></input>
                    <div id="set-password-error"></div>
                    <button type="submit" class="buttonSubmitForgetPassword button is-primary">Primary</button>

                </form>

            </div>
        )
    }
}
