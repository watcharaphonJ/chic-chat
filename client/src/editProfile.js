import React, { Component } from 'react'
import Menu from './menu'
import './css/edit-profile.css'
import swal from 'sweetalert';
import './css/animation-wait.css'
const API_URL = process.env.REACT_APP_API_URL

export default class editProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user_info: {},
            user: "",
            firstname: "",
            lastname: "",
            email: "",
            mobile: "",
            citizen: "",
            isFetch: false
        }
    }
    edit_profile = (e) => {
        e.preventDefault()
        var password = e.target.password.value
        var cpassword = e.target.confirmPassword.value
        console.log(password, cpassword)
        if (cpassword == password) {
            URL = API_URL + "/edit-profile"
            var id = window.localStorage.getItem("id")
            let formData = new FormData(e.target);
            formData.append("id", id);
            console.log(e.target.firstname.value)
            fetch(URL, {
                method: "POST",
                body: formData,
            })
                .then(response => { return response.json() })
                .then(data => {
                    console.log(data)
                    if (data.success) {
                        swal({
                            title: "Edit Success ! ",
                            text: "let's talk to your friend :)",
                            icon: "success",
                            button: "Success",
                        }).then(() => {
                            window.location.href = "/"
                        })
                    }
                });

        } else {
            document.getElementById("error-password").innerHTML = "Password and confirm password does not match"
        }
    }
    componentWillMount = () => {
        var URL = API_URL + '/get-user'
        var id = window.localStorage.getItem("id")
        var data = {
            id_user: id
        }
        console.log(data)
        fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                this.setState({
                    user_info: data.result[0],
                    user: data.result[0].user,
                    firstname: data.result[0].firstname,
                    lastname: data.result[0].lastname,
                    email: data.result[0].email,
                    mobile: data.result[0].mobile,
                    citizen: data.result[0].citizen,
                    isFetch: true
                })
            })

    }
    fileChangedHandler = (event) => {
        event.preventDefault()
        let tagImg = document.getElementById("preview-image")
        const file = event.target.files
        console.log(file)
        tagImg.src = URL.createObjectURL(file[0])
    }
    render() {
        console.log(this.state.user_info)
        const { user_info, isFetch } = this.state
        console.log(user_info)
        var user = user_info.user
        var firstname = user_info.firstname
        var lastname = user_info.lastname
        var email = user_info.email
        var mobile = user_info.mobile
        var citizen = user_info.citizen
        var img = user_info.img
        console.log(user)
        if (isFetch) {
            var id = window.localStorage.getItem("id")
            return (
                <div>
                    <Menu id={id} />
                    <div className="padding-reg">
                        <div className="container-reg">
                            <div className="text-register ">
                                Edit Profile
                            </div>
                            <form className="form-reg" method="post" enctype="multipart/form-data" onSubmit={this.edit_profile}>
                                <div className="container-input-reg ">
                                    <div className="style-inline">
                                        Username :
                            </div>
                                    <input className="input-reg input" defaultValue={user} placeholder={user} type="text" name="user" /><br />
                                </div>
                                <div className="container-input-reg ">
                                    <div className="style-inline">
                                        Password :
                            </div>
                                    <input className="input-reg input" placeholder="new password" type="password" name="password" /><br />
                                </div>
                                <div className="container-input-reg ">
                                    <div className="style-inline">
                                        Confirm password :
                            </div>
                                    <input className="input-reg input" placeholder="Confirm new password" type="password" name="confirmPassword" /><br />
                                    <div className="errorPassword" id="error-password">

                                    </div>
                                </div>
                                <div className="container-input-reg ">
                                    <div className="style-inline">
                                        Firstname :
                            </div>
                                    <input className="input-reg input" defaultValue={firstname} placeholder={firstname} type="text" name="firstname" /><br />
                                </div>
                                <div className="container-input-reg ">
                                    <div className="style-inline">
                                        Lastname :
                            </div>
                                    <input className="input-reg input" defaultValue={lastname} type="text" name="lastname" /><br />
                                </div>
                                <div className="container-input-reg ">
                                    <div className="style-inline">
                                        Email :
                            </div>
                                    <input className="input-reg input" defaultValue={email} type="text" name="email" /><br />
                                </div>
                                <div className="container-input-reg ">
                                    <div className="style-inline">
                                        Mobile :
                            </div>
                                    <input className="input-reg input" defaultValue={mobile} type="text" name="mobile" /><br />
                                </div>
                                <div className="container-input-reg ">
                                    <div className="style-inline">
                                        Citizen :
                            </div>
                                    <input className="input-reg input" defaultValue={citizen} type="text" name="citizen" /><br />
                                </div>
                                <div className="container-input-reg ">
                                    <div className="style-inline">
                                        Profile Image :
                                    </div>
                                    <img id="preview-image" className="preview-image" src={"http://localhost:8888/uploads/" + img} />

                                    <input type="file" name="file" onChange={this.fileChangedHandler} /><br />
                                    <div id="error-info" className="errorPassword">

                                    </div>
                                </div>
                                <div className="container-button-ref">
                                    <input className="input-submit-reg" type="submit" value="Submit" />

                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            )

        } else {
            return (
                <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            )
        }
    }
}
