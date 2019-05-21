import React, { Component } from 'react'
import './css/menu.css'
import img from './img/test.jpg'
const api_url = process.env.REACT_APP_API_URL
export default class menu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user_info: {}
        }

    }
    signout = () => {
        var token = window.localStorage.getItem("token")
        var URL = api_url + "/signout"
        fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "token": token })
        })
            .then(response => response.json())
            .then(data => {
                window.localStorage.removeItem("token")
                window.localStorage.removeItem("id")
                window.location.href = "/"
            })
    }
    componentWillMount = () => {
        var id = this.props.id
        var data = {
            id: id
        }
        var url = api_url + "/get_info"
        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }).then((response) => response.json())
            .then((data) => {
                console.log(data)
                this.setState({
                    user_info: data.result
                })
            })
    }
    render() {
        var { user_info } = this.state
        var img = user_info.img
        return (

            <div className="container-menu">
                <div id="sub-menu" className="element-in-menu">

                    <img src={"http://localhost:8888/uploads/" + img} className="img-menu" />
                    <div className="text-edit" onClick={() => {
                        window.location.href = "/home"
                    }}>Home</div>
                    <div className="text-edit" onClick={() => {

                        window.location.href = "/FriendList"
                    }}>Friend List</div>

                    <div className="text-edit" onClick={() => {
                        window.location.href = "/edit"
                    }}>Edit profile</div>

                    <div className="text-edit text-logout" onClick={this.signout}>Sign out<i class="fas fa-sign-out-alt icon-exit"></i></div>
                </div>
            </div>
        )
    }
}
