import React, { Component } from 'react'
import './css/home.css'
import CardFriendList from './CardFriendList'
import Menu from './menu'
import FriendListSearch from './friendListSearch'
import './css/animation-wait.css'
function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
const API_URL = process.env.REACT_APP_API_URL
export default class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            result: [],
            open: false,
            isFetch: false
        }
    }
    getFriend = (e) => {
        var id = window.localStorage.getItem("id")
        var text = e.target.value.trim()
        var data = {
            id: id,
            data: text
        }
        var url_api = API_URL + "/search-friend"
        fetch(url_api, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.empty) {
                    this.setState({
                        result: []
                    });
                } else {
                    this.setState({
                        result: data.result
                    })
                }
            })

    }
    checkUser = () => {
        var data = this.state.allUser
        if (isEmpty(data)) {
            return (<div>Wait for admin add some user or some user register</div>)
        } else {
            return data.map((element, i) => { return (<CardFriendList id={i} data={element} />) })
        }
    }
    searchFriend = () => {
        var { result } = this.state
        if (result == null) {
        } else {
            return (result.map((data, i) => {
                return (
                    <FriendListSearch data={data} />
                )
            }))
        }

    }
    componentWillMount = () => {
        var URL = API_URL + "/users"
        var id_user = window.localStorage.getItem("id")
        fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "id_user": id_user })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.setState({
                    allUser: data.result,
                    isFetch: true
                });
            });
    }
    render() {
        var id = window.localStorage.getItem("id")
        let { isFetch, allUser } = this.state
        console.log(allUser)
        var isLogin = localStorage.getItem('token')
        if (isLogin == "") {
            window.location.href = "/"
        } else {
            if (isFetch) {
                return (
                    <div>
                        <Menu id={id} />
                        <div className="container-home">
                            <input onChange={this.getFriend} className="input input-getFriend"
                                type="text" placeholder="Search users by username, Email, Mobile etc."></input>
                            <div className="container-result-search">
                                {this.searchFriend()}

                            </div>
                            <div className="text-friend-list">Chic Chat Members</div>
                            <div className="container-friend-list">
                                {this.checkUser()}
                            </div>
                        </div>
                    </div>

                )

            } else {
                return (<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                )
            }
        }
    }
}
