import React, { Component } from 'react'
import Menu from './menu'
import CardFriend from './cardFriend'
const API_URL = process.env.REACT_APP_API_URL

export default class friendList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            result: [],
            open: false,
            isFetch: false
        }
    }
    componentWillMount = () => {
        var id = window.localStorage.getItem("id")
        console.log(id)
        var data = { id_user: id }
        var url = API_URL + '/get-all-friend'
        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)

        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                this.setState({
                    result: data.result
                })
            })
    }
    get_friendList = () => {
        var data = this.state.result
        console.log(data)

        if (data.length == 0) {
            return (<div>you look so lonely let's find some friend!</div>)
        } else {

            return data.map((element, i) => { return (<CardFriend id={i} data={element} />) })
        }
    }
    render() {
        let { result } = this.state
        console.log(result)
        var isLogin = localStorage.getItem('token')
        console.log(isLogin)
        if (isLogin == "") {
            window.location.href = "/"
        } else {

            var id = window.localStorage.getItem("id")
            return (
                <div>
                    <Menu id={id} />
                    <div className="container-home">
                        <div className="text-friend-list">Friend List</div>
                        <div className="container-friend-list">
                            {this.get_friendList()}

                        </div>
                    </div>
                </div>
            )
        }
    }
}
