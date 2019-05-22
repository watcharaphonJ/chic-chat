import React, { Component } from 'react'
import './css/reg.css'

import swal from 'sweetalert';
const api_url = process.env.REACT_APP_API_URL;

export default class reg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: "",
            isUpload: false,
            imagePreviewUrl: ""
        };
    }
    checkReg = (e) => {
        e.preventDefault()
        var password = e.target.password.value
        var cpassword = e.target.confirmPassword.value
        var mobile = e.target.mobile.value
        var citizen = e.target.citizen.value

        if (cpassword == password) {
            document.getElementById("error-password").innerHTML = ""
            URL = api_url + "/register"
            let formData = new FormData(e.target);
            if (mobile.length > 10) {
                document.getElementById("error-mobile").innerHTML = "Mobile must have 10 digit number"
            }
            else if (citizen.length > 13) {
                document.getElementById("error-citizen").innerHTML = "Citizen ID must have 13 digit number"

            } else {
                fetch(URL, {
                    method: "POST",
                    body: formData
                })
                    .then(response => { return response.json() })
                    .then(data => {
                        console.log(data)
                        if (data.error) {
                            document.getElementById("error-user").innerHTML = "User is already"
                        } else {
                            swal({
                                title: "Register Success!",
                                text: "Let's login to talk to your friend :)",
                                icon: "success",
                                button: "Success",
                            }).then(() => {
                                document.getElementById("error-user").innerHTML = ""
                                window.location.href = '/'
                            })
                        }
                    });
            }


        } else {
            document.getElementById("error-password").innerHTML = "Password and confirm password does not match"
        }
    }
    fileChangedHandler = (event) => {
        event.preventDefault()
        let tagImg = document.getElementById("preview-image")
        const file = event.target.files
        tagImg.src = URL.createObjectURL(file[0])
    }
    render() {
        let { imagePreviewUrl } = this.state
        console.log(imagePreviewUrl)
        return (
            <div className="padding-reg">
                <div className="container-reg">
                    <div className="text-register ">
                        Register
                    </div>
                    <form className="form-reg" method="post" enctype="multipart/form-data" onSubmit={this.checkReg}>
                        <div className="container-input-reg ">
                            <div className="style-inline">
                                Username :
                            </div>
                            <input className="input-reg input" placeholder="USERNAME" type="text" name="user" required /><br />
                            <div id="error-user" className="errorPassword"></div>
                        </div>
                        <div className="container-input-reg ">
                            <div className="style-inline">
                                Password :
                            </div>
                            <input className="input-reg input" placeholder="PASSWORD" type="password" name="password" required /><br />
                        </div>
                        <div className="container-input-reg ">
                            <div className="style-inline">
                                Confirm password :
                            </div>
                            <input className="input-reg input" placeholder="CONFIRM PASSWORD" type="password" name="confirmPassword" required /><br />
                            <div className="errorPassword" id="error-password">

                            </div>
                        </div>
                        <div className="container-input-reg ">
                            <div className="style-inline">
                                Firstname :
                            </div>
                            <input className="input-reg input" placeholder="FIRSTNAME" type="text" name="firstname" required /><br />

                        </div>
                        <div className="container-input-reg ">
                            <div className="style-inline">
                                Lastname :
                            </div>
                            <input className="input-reg input" placeholder="LASTNAME" type="text" name="lastname" required /><br />
                        </div>
                        <div className="container-input-reg ">
                            <div className="style-inline">
                                Email :
                            </div>
                            <input className="input-reg input" placeholder="EMAIL" type="text" name="email" required /><br />
                        </div>
                        <div className="container-input-reg ">
                            <div className="style-inline">
                                Mobile :
                            </div>
                            <input className="input-reg input" placeholder="MOBILE" type="text" name="mobile" required /><br />
                            <div id="error-mobile" className="errorPassword"></div>
                        </div>
                        <div className="container-input-reg ">
                            <div className="style-inline">
                                Citizen :
                            </div>
                            <input className="input-reg input" placeholder="CITIZEN" type="text" name="citizen" required /><br />
                            <div id="error-citizen" className="errorPassword"></div>
                        </div>
                        <div className="container-input-reg ">
                            <div className="style-inline">
                                Profile Image :
                            </div>
                            <img className="preview-img-reg" id="preview-image" src="" />
                            <input type="file" name="file" onChange={this.fileChangedHandler} required /><br />
                            <div id="error-info" className="errorPassword">

                            </div>
                        </div>
                        <div className="container-button-ref">
                            <input className="input-submit-reg" type="submit" value="Submit" />

                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
