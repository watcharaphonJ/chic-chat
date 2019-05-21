import React, { Component } from 'react'
import './css/CardFriendList.css'
import swal from 'sweetalert';
const API_URL = process.env.REACT_APP_API_URL

export default class cardFriend extends Component {

    addFriend = () => {
        swal({
            title: "This function is coming soon!",
            text: "",
            button: "Success",
        }).then(() => {
        })
    }
    unFriend = () => {
        var id = window.localStorage.getItem("id")
        var token = window.localStorage.getItem("token")
        var friend_id = this.props.data.id_user
        var URL = API_URL + '/unfriend'
        var data = {
            id_user: id,
            friend_id: friend_id
        }
        fetch(URL, {
            method: "POST",
            headers: {
                "token": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.complete) {
                    swal({
                        title: "Delete Friend Success",
                        text: "let's find some other guys that belong to you :'(",
                        icon: "success",
                        button: "Success",
                    }).then(() => {
                        document.location.reload(true)
                    })
                }
            })

    }
    render() {
        console.log(this.props.data)
        var name = this.props.data.firstname + " " + this.props.data.lastname
        var img = this.props.data.img
        return (
            <div className="container-card-friend-list">
                <div className="img-left-card">
                    <img src={"http://localhost:8888/uploads/" + img} className="img-friend-list" />
                    <div className="text-name-friend-list">
                        {name}</div>
                </div>
                <div className="button-right">
                    <a class="button is-primary is-outlined btChat" onClick={this.addFriend}>CHAT</a>
                    <a class="button is-danger is-outlined btUnFriend" onClick={this.unFriend}>UNFRIEND</a>
                </div>
            </div>
        )
    }
}
