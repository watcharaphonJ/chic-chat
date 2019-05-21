import React, { Component } from 'react'

import swal from 'sweetalert';
import Modal from 'react-responsive-modal';
import './css/friendListSearch.css'
const API_URL = process.env.REACT_APP_API_URL
export default class friendListSearch extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false

        }
    }
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
                console.log(data)
                if (data.complete) {
                    swal({
                        title: "Add Friend Success!",
                        text: "let's talk to your friend :)",
                        icon: "success",
                        button: "Success",
                    }).then(() => {
                        window.location.href = "/"
                    })
                }
            })
    }
    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

    render() {
        var result = this.props.data
        var { open } = this.state
        return (
            <div onClick={this.onOpenModal} className="card-result-search">
                <img src={"http://localhost:8888/uploads/" + result.img} className="img-result-search" />
                <div className="detail-result-search"> {result.firstname}  {result.lastname}</div>
                <Modal open={open} onClose={this.onCloseModal} center>
                    <div className="container-modal" >
                        <div className="header-modal">
                            <img src={"http://localhost:8888/uploads/" + result.img} className="img-modal-search" />
                            <div className="text-name-modal"> {result.firstname}  {result.lastname}</div>
                        </div>
                        <i onClick={this.onCloseModal} className="cross-modal fas fa-times"></i>
                        <div className="container-detail-modal">

                            <div className="text-user-modal">Username : {result.user}</div>
                            <div>Email : {result.email}</div>

                        </div>
                        <div className="container-button-add-modal">
                            <a class="button is-primary is-outlined btChat" onClick={this.addFriend}>ADD FRIEND</a></div>
                    </div>

                </Modal>
            </div>
        )

    }
}
