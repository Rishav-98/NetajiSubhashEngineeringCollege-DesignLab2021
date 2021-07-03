import Axios from 'axios'
import React, { Component } from 'react'
import { FacebookSelector, FacebookCounter } from '@charkour/react-reactions';
import { CommentSection } from 'react-comments-section'
import 'react-comments-section/dist/index.css'
import './SinglePost.css'
import avtar from '../../../assets/avtar.jpg'
import { Link } from 'react-router-dom'
import moment from "moment";
import Spinner from '../../../Containers/Spinner/Spinner'
import Modal from '../../../Containers/Modal/Modal'

export class SinglePost extends Component {
    constructor(props) {
        super(props)

        this.state = {
            singlePost: {
                comments: [],
                reactions: [],
            },
            user: {
                _id: 0,
                username: 'guest',
                imagePath: '"https://ui-avatars.com/api/name=Felicity&background=random"'
            },
            error: {
                message: '',
                code: ''
            },
            isloading: false,
            show: false
        }

    }

    showModal = () => {
        this.setState({ show: true });
    };

    hideModal = () => {
        this.setState({ show: false });
    };

    componentDidMount() {

        this.setState(pre => ({
            isloading: true
        }))
        let id = this.props.match.params.id
        Axios.get('/posts/' + id).then(res => {
            this.setState({ ...this.state.singlePost, singlePost: res.data, isloading: false });
            return Axios.get("/profile/bycreator/" + res.data.creator)
        }).then(data => {
            this.setState({ ...this.state.singlePost, user: data.data.profile, isloading: false });
        }).catch(e => {
            this.setState({
                isloading: false,
                error: {
                    ...this.state.error, message: e.response.data.message,
                    code: e.response.status
                }
            });
        })

    }

    handleComment = (value) => {
        let id = this.props.match.params.id
        const payload = { comments: value };
        Axios.put("/posts/" + id + '/comment', payload).then(data => {
            this.setState(pre => ({
                isloading: false
            }))
        })
            .catch(e => {
                this.setState({
                    isloading: false,
                    error: {
                        ...this.state.error, message: e.response.data.message,
                        code: e.response.status
                    }
                });
            })
        this.setState({ singlePost: { ...this.state.singlePost, comments: value } })
    }

    handleReact = (emoji) => {
        const loggedInUser = JSON.parse(localStorage.getItem('profileData'));
        const name = loggedInUser?.username || 'Guest';
        //const existingReactions = this.state.singlePost.reactions;
        const newReaction = [
            {
                emoji,
                by: name,
            },
            ...this.state.singlePost.reactions];

        let id = this.props.match.params.id
        const payload = { reactions: newReaction };
        Axios.put("/posts/" + id + '/reactions', payload).then(data => {
            this.setState(pre => ({
                isloading: false
            }))
        })
            .catch(e => {
                this.setState({
                    isloading: false,
                    error: {
                        ...this.state.error, message: e.response.data.message,
                        code: e.response.status
                    }
                });
            })
        //existingReactions.push(newReaction)
        this.setState({ singlePost: { ...this.state.singlePost, reactions: newReaction } })
    }


    deletePost = (id) => {
        this.setState(pre => ({
            isloading: true
        }))
        Axios.delete("/posts/" + id).then(data => {
            this.setState(pre => ({
                isloading: false
            }))
            this.props.history.push('/mypost')
        })
            .catch(e => {
                this.setState({
                    isloading: false,
                    error: {
                        ...this.state.error, message: e.response.data.message,
                        code: e.response.status
                    }
                });
            })
    }

    render() {
        let isLoading
        let iserror

        if (this.state.isloading) {
            isLoading = (
                <>
                    <div className="container loading">
                        <div className="mar-20">
                            <Spinner />
                        </div>
                    </div>
                </>
            )
        }

        if (this.state.error.code) {
            iserror = (
                <>
                    <div className="container error container-short">
                        <div className="mar-20">
                            <h5>Error Code - {this.state.error.code}</h5>
                            <h4>Error Message - {this.state.error.message}</h4>
                        </div>
                    </div>
                </>
            )
        }

        let post
        let post1 = this.state.singlePost
        let user = this.state.user

        const loggedInUser = JSON.parse(localStorage.getItem('profileData'));
        const userId = loggedInUser?._id || 1;
        const avatarUrl = loggedInUser?.imagePath || "https://ui-avatars.com/api/name=Guest&background=random";
        const name = loggedInUser?.username || 'guest';

        const signinUrl = "/auth"
        const signupUrl = "/auth"

        if (this.state.singlePost) {

            post = (<>
                <h6>{post1.category}</h6>
                <h2>{post1.title}</h2>
                <div className="SingleBlog_avatar">
                    <Link to={"/public/" + user?.username} rel="noopener noreferrer" >
                        <img src={user?.imagePath ? user.imagePath : avtar} alt="img" width="75" height="75" />
                    </Link>

                    <Link to={"/public/" + user?.username} rel="noopener noreferrer" >
                        <p>{user?.username}</p>
                    </Link>
                    <p>{moment(post1.postDate).format("MMM DD, YYYY hh:mm")}</p>
                </div>
                <div className="singlePost_content pt-3">
                    <img src={post1.imagePath} className="img-fluid" alt="prof" />
                    <div className="text pt-3">
                        <p>{post1.content}</p>
                    </div>
                </div>
                <br />
                <FacebookCounter
                    counters={this.state.singlePost.reactions} />
                <br />
                <FacebookSelector
                    iconSize={28}
                    onSelect={this.handleReact}
                />
                <br />
                <CommentSection currentUser={userId && { userId: userId, avatarUrl: avatarUrl, name: name }} commentsArray={this.state.singlePost.comments}
                    setComment={this.handleComment} signinUrl={signinUrl} signupUrl={signupUrl} />
            </>
            )
        }
        return (<>
            {isLoading}
            {iserror}
            <div className="container py-4 SingleBlog ">
                <div className="row">
                    {this.props.match.path === "/mypost/:id" &&
                        <div className="col-md-3 col-xs-12 ">
                            <div className="list-group">
                                <Link to={"/edit/" + post1._id} className="list-group-item list-group-item-action">Edit</Link>
                                <button type="button" onClick={this.showModal} className="list-group-item list-group-item-action">Delete</button>
                            </div>
                        </div>}
                    <div className="col-md-9 col-xs-12 main">
                        <Modal show={this.state.show} handleClose={this.hideModal}>
                            <div className="modal-header">
                                <h2>{post1.title}</h2>
                                <button type="button" className="close" data-dismiss="modal" onClick={this.hideModal}>&times;</button>

                            </div>
                            <div className="modal-body">
                                Confirm delete
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" onClick={() => this.deletePost(post1._id)}>Delete </button>
                                <button type="button" className="btn btn-outline-dark" onClick={this.hideModal} data-dismiss="modal">Close</button>
                            </div>
                        </Modal>
                        {post}
                    </div>
                </div>
            </div>
        </>
        )
    }
}

export default SinglePost
