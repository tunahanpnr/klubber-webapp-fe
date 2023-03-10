import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Link, useParams} from "react-router-dom"
import {Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper, TextField} from "@material-ui/core";
import AuthService from "../../../service/auth/AuthService";
import axios from "axios";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import SubClubListAdmin from "./ClubPage/SubClubListAdmin";
import SubClubListMember from "./ClubPage/SubClubListMember";
import AdminButton from "./ClubPage/AdminButton";
import MemberButon from "./ClubPage/MemberButon";
import Button from "@material-ui/core/Button";
import ClubList from "./Clubs/ClubList";
import PostCard from "../../Post/PostCard";
import CommentCard from "./CommentCard";
import Container from "@material-ui/core/Container";


const useStyles = makeStyles((theme) => ({
    Club: {
        backgroundColor: "#eeead1",
        position: "fixed",
        height: "100%",
        width: "100%",
        zIndex: "1",
        top: "4.6em",
        left: "7.2em",
        paddingTop: "10px",
        flexGrow: 1,

    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    subclub: {
        display: "grid",
        gridRowGap: "25px",

    },
    button: {
        display: 'grid',
        textAlign: "start",
        gridRowGap: "10px"

    },
    head: {
        display: 'grid',
        textAlign: "center",
        gridTemplateColumns: "1fr 1fr",
    },
    root: {
        display: "flex",
        width: '95%',
    },
    container: {
        height: "600px",
        maxHeight: 600,
        // width: "300px"
    },
    margin: {
        margin: theme.spacing(1),
        color: "white",
        backgroundColor: '#59fa4d',
        borderColor: 'white',
    },
    paper2: {
        height: "100%",
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,

    }, container2: {
        height: "600px",
        maxHeight: 600,
        overflow: "scroll"
    },

}));

const columns = [
    {id: 'name', label: 'Name', minWidth: 170},
    {id: 'delete', label: 'Delete', minWidth: 100},
];

export default function Club() {
    const classes = useStyles();
    let {name} = useParams();

    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);

    const [subClub, setSubClub] = useState([]);
    const [subClubUser, setSubClubUser] = useState([]);
    const [isReceived, setIsReceived] = useState(false);
    const [openComment, setOpenComment] = useState(false);
    const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
    const [deleted, setDeleted] = useState(false);


    const handleClickOpenComment = () => {
        setOpenComment(true);
    };

    const handleClickCloseComment = () => {
        setOpenComment(false);
    };

    const handleChangeComment = (cont) => {
        setComment(cont.target.value);
    };

    const handleRequest = () => {
        const newComment = {
            comment: comment,
            username: currentUser.username,
            club: name
        }
        axios.post("/sendComment", newComment).then((response) => {
            console.log(response.data)
            setComments([...comments, newComment])
        })

        setComment("")
        setOpenComment(false);
    }

    useEffect(() => {
        console.log("Club")
        console.log(name)
        axios.get("/listsubclub/" + name)
            .then(response => {
                console.log(response.data);
                setSubClub(response.data);
                setIsReceived(true)
            })
    }, [name])

    useEffect(() => {
        console.log("Club")
        console.log(name)
        axios.get("/getclubusers/" + name)
            .then(response => {
                console.log(response.data);
                setSubClubUser(response.data);
            })
    }, [deleted, name])

    useEffect(() => {
        axios.get("/getComments/" + name)
            .then(response => {
                console.log(response.data);
                setComments(response.data);
            })
    }, [])

    function SubClubUserList() {
        return (
            <React.Fragment>
                <Paper className={classes.root}>
                    <TableContainer>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        USER
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {subClubUser.map((row) => (
                                    <TableCell key={row.name}>
                                        <TableRow key={row.username}>
                                            <Link>
                                                {row.username}
                                            </Link>
                                        </TableRow>
                                    </TableCell>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </React.Fragment>
        );
    }

    const commentList = () => {
        return (comments.map((c) => {
                return (
                    <CommentCard comment={c}/>
                )
            }
        ))
    }

    function showComments() {
        return (
            <React.Fragment>
                <Paper elevation={3} className={classes.paper2}>
                    <h4>Comments</h4>
                    <Container className={classes.container2}>
                        {commentList()}
                    </Container>
                </Paper>
            </React.Fragment>
        );
    }

    function FormRow() {
        return (
            <React.Fragment>
                <Grid item xs={12}>
                    <SubClubUserList/>
                </Grid>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClickOpenComment}
                >
                    Comment
                </Button>
                <Grid item xs={12}>
                    {showComments()}
                </Grid>
            </React.Fragment>
        );
    }

    function FormRowClub() {
        return (
            <React.Fragment>
                <Grid item xs={12}>
                    <h1> CLUB: {name}</h1>
                </Grid>
                <Grid item xs={12}>
                    {(currentUser.role === "ADMIN") ?
                        <SubClubListAdmin subClub={subClub} setDeleted={setDeleted} deleted={deleted}/> :
                        <SubClubListMember subClub={subClub}/>
                    }
                </Grid>
            </React.Fragment>
        );
    }

    return (
        <div className={classes.Club}>
            <Grid container spacing={3}>

                <Grid item xs={9}>
                    <FormRowClub/>
                </Grid>

                <Grid item xs={2}>
                    <div className={classes.button}>
                        {(currentUser.role === "ADMIN") ?
                            <AdminButton name={name}/> :
                            <MemberButon name={name}/>
                        }
                        <FormRow/>

                    </div>
                </Grid>

                <Grid container item xs={2} spacing={3}>
                </Grid>
                <Dialog open={openComment} onClose={handleClickCloseComment} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">{"Comment"}</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="comment"
                            label="Comment"
                            fullWidth
                            value={comment}
                            onChange={handleChangeComment}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleRequest} color="primary">
                            send
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        </div>

    )
}