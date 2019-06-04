import React, { Component } from 'react'
import './css/forgetPassword.css'
import swal from 'sweetalert';

const API = process.env.REACT_APP_API_URL
export default class forgetPassword extends Component {
    sendToEmail = () => {
        var email = document.getElementById("email").value

        var API_URL = API + "/reset"
        var data = { email: email }
        console.log(data)
        fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(response => response.json()
            .then(data => {
                console.log(data)
                if (data.complete) {

                    swal({
                        title: "Success !!",
                        text: "link reset password is sent to your email",
                        icon: "success",
                        button: "OK",
                    }).then(() => {
                        document.getElementById("email-error").innerHTML = ""
                        window.location.href = '/'
                    })

                } else {
                    document.getElementById("email-error").innerHTML = data.message


                }
            }))
    }
    render() {
        return (
            <div className="container-forget-password-page">
                <div className="text-forget-password">
                    Forget your password ?

                </div>
                <div className="text-email-forget">

                    Please enter your email account that you registered.
                    <br />
                    We will send a reset password link to your email.
                </div>

                <input id="email" class="input" type="email" placeholder="Example@hotmail.com" required></input>
                <div id="email-error"></div>
                <a onClick={this.sendToEmail} class="buttonSubmitForgetPassword button is-primary">Confirm</a>

            </div >
        )
    }
}
