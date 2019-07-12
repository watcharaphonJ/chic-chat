import React, { Component } from 'react'
import './css/chat.css'
import socketIOClient from 'socket.io-client'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
const URL_API = process.env.REACT_APP_API_URL
export default class chat extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user_info: {},
            input: '',
            message: [],
            chat_id: 0,
            endpoint: "http://localhost:8888"
        }
    }
    componentDidMount = () => {
        this.response()
    }
    send = () => {

        var id = window.localStorage.getItem("id")
        const { endpoint, input, chat_id } = this.state
        var data = {
            message: input,
            user_id: id,
            chat_id: chat_id
        }
        console.log(data)
        // fetch(URL_API + "/save_message", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(data)

        // })
        //     .then((response) => response.json())
        //     .then((data) => {
        //         console.log(data)
        //     })
        const socket = socketIOClient(endpoint)
        socket.emit('sent-message', data)
        this.setState({ input: '' })
    }
    componentWillMount = () => {
        var str = this.props.location.search
        var id = str.split("=")
        var data = {
            id: id[1]
        }
        var url = URL_API + "/get_info"

        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())

            .then((data) => {
                console.log(data)
                this.setState({
                    user_info: data.result
                })

            })
            .then(
                () => {

                    var id_user = window.localStorage.getItem("id")
                    var friend_id = id[1]
                    var data_create = {
                        id_user: id_user,
                        friend_id: friend_id
                    }
                    console.log(data_create)
                    fetch(URL_API + "/create_chat", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(data_create)
                    }).then((response) => response.json())
                        .then((data) => {
                            this.setState({
                                chat_id: data.id_chat

                            })
                            var dataGetHistory = {
                                chat_id: data.id_chat,
                                user_id: id_user
                            }
                            fetch(URL_API + "/get_history", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(dataGetHistory)

                            })
                                .then((response) => response.json())
                                .then((data) => {
                                    let { message } = this.state
                                    data.map(el => {
                                        message.push(el)
                                    })

                                })
                        })
                }


            )
    }
    changeInput = (e) => {
        this.setState({ input: e.target.value })
    }
    // รอรับข้อมูลเมื่อ server มีการ update
    response = () => {
        const { endpoint, message } = this.state
        const temp = message
        const socket = socketIOClient(endpoint)
        socket.on('new-message', (messageNew) => {
            console.log(messageNew)
            temp.push(messageNew)
            this.setState({ message: temp })
        })
    }
    render() {
        var user_id = window.localStorage.getItem("item")
        var { user_info, input, message } = this.state
        return (
            <div>
                <div className="container-menu-chat">
                    <Link className="arrow-left" to="/home">
                        <i className="decor fas fa-arrow-left">

                        </i>
                    </Link>
                    <div className="container-info">

                        <img src={"http://localhost:8888/uploads/" + user_info.img} className="img-menu-chat" />
                        <div className="text-name-chat">{user_info.firstname} {user_info.lastname} </div>
                    </div>
                </div>

                <div className="container-chat">

                    {
                        message.map((data, i) => {
                            console.log(data)
                            if (data.user_id != user_id) {
                                return (
                                    <div key={i} >
                                        {i + 1} : {data.message}
                                    </div>

                                )
                            }
                            else {

                                return (
                                    <div>test</div >
                                )
                            }
                        })
                    }

                    <div className="container-input-chat" >
                        <input className="input input-chat" value={input} onChange={this.changeInput} />
                        <a onClick={() => this.send()} class="button is-link button-send">Send</a>
                    </div>
                </div>

            </div>
        )
    }
}
