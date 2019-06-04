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
            endpoint: "http://localhost:8888"
        }
    }
    componentDidMount = () => {
        this.response()
    }
    send = (message) => {
        console.log(message)
        const { endpoint, input } = this.state
        const socket = socketIOClient(endpoint)
        socket.emit('sent-message', input)
        this.setState({ input: '' })
    }
    componentWillMount = () => {
        var str = this.props.location.search
        console.log(this.props)
        var id = str.split("=")
        var data = {
            id: id[1]
        }
        console.log(data)
        var url = URL_API + "/get_info"
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
    changeInput = (e) => {
        this.setState({ input: e.target.value })
    }
    // รอรับข้อมูลเมื่อ server มีการ update
    response = () => {
        const { endpoint, message } = this.state
        const temp = message
        const socket = socketIOClient(endpoint)
        socket.on('new-message', (messageNew) => {
            temp.push(messageNew)
            this.setState({ message: temp })
        })
    }
    render() {
        console.log(this.props)
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
                        message.map((data, i) =>
                            <div key={i} >
                                {i + 1} : {data}
                            </div>
                        )
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
