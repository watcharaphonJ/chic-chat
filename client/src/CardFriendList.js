import React, { Component } from 'react'
import './css/CardFriendList.css'
import swal from 'sweetalert';
const API_URL = process.env.REACT_APP_API_URL

export default class CardFriendList extends Component {

    addFriend = () => {
        var friend_id = this.props.data.id_user
        var id = window.localStorage.getItem("id")
        var url = API_URL + '/add-friend'
        var data = {
            id_user: id,
            friend_id: friend_id
        }
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.complete) {
                    swal({
                        title: "Add Friend Success!",
                        text: "let's talk to your friend :)",
                        icon: "success",
                        button: "Success",
                    }).then(() => {
                        document.location.reload(true)
                    })
                }
            })
    }
    render() {
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
                    <a class="button is-primary is-outlined btChat" onClick={this.addFriend}>ADD FRIEND</a>
                </div>
            </div>
        )
    }
}
