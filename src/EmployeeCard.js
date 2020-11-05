import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import clsx from 'clsx';
import shortid from "shortid";
import * as UiStateSlice from "./redux/UiStateSlice";
import WorkingModelCard from "./WorkingModelCard";
import WorkingModelForm from "./WorkingModelForm";
//Material UI
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Collapse, Typography } from '@material-ui/core';

export default function EmployeeCard(props) {
    const [expanded, setExpanded] = useState(false);
    const [showWorkingModel, setShowWorkingModel] = useState(false);
    const [workingModels, setWorkingModels] = useState([]);
    const uiState = useSelector((state) => UiStateSlice.selectUiState(state));
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const classes = useStyles();
    let history = useHistory();
    const loc = useLocation();

    /**
     * 
     */
    function showError(msg) {
        setError(msg);
        setTimeout(() => setError(""), 5000);
    }


    /**
     * 
     */
    function showSuccess(msg) {
        setSuccess(msg);
        setTimeout(() => setSuccess(""), 5000);
    }


    /**
     * 
     */
    function toggleWorkingModelForm() {
        setShowWorkingModel(!showWorkingModel);
    }

    /**
     * 
     */
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };


    function deleteWorkingModel(id) {
        const errorMsg = "Das Arbeitsmodell konnte nicht gelöscht werden.";
        fetch(`${process.env.REACT_APP_API_URL}/workingModel/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                'auth-token': localStorage.getItem('jwt')
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    showSuccess("Das Arbeitsmodell wurde erfolgreich entfernt.");
                }
                else if (data.errorCode === 4007 || data.errorCode === 4008 || data.errorCode === 4009) {
                    console.error(errorMsg, data)
                    if (loc.pathname !== '/Login')
                        history.push('/Login');
                }
                else {
                    console.error(errorMsg + " Unerwarteter Fehler.", data)
                    showError(errorMsg + " Unerwarteter Fehler.");
                }
            })
            .then(() => 
            {
                console.log('fetch after delete')
                fetchWorkingModels()
            }
            )
            .catch((err) => {
                console.error(errorMsg + " Der Server antwortet nicht.", err);
                showError(errorMsg + " Der Server antwortet nicht.");
            });
    }


    /**
     * 
     */
    const fetchWorkingModels = useCallback(() => {
        const errorMsg = "Das Arbeitsmodell konnte nicht abgerufen werden.";
        fetch(`${process.env.REACT_APP_API_URL}/workingModel/${props.employee.username}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'auth-token': localStorage.getItem('jwt')
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    console.log(data.success.workingModels);
                    setWorkingModels(data.success.workingModels)

                }
                else if (data.errorCode === 4007 || data.errorCode === 4008 || data.errorCode === 4009) {
                    console.error(errorMsg, data)
                    if (loc.pathname !== '/Login')
                        history.push('/Login');
                }
                else {
                    console.error(errorMsg + " Unerwarteter Fehler.", data)
                    showError(errorMsg + " Unerwarteter Fehler.");
                }
            })
            .catch((err) => {
                console.error(errorMsg + " Der Server antwortet nicht.", err);
                showError(errorMsg + " Der Server antwortet nicht.");
            });
    }, [history, loc.pathname, props.employee.username])


    useEffect(() => {
        console.log(workingModels)
        fetchWorkingModels();
    }, [fetchWorkingModels])


    /**
     * 
     */
    function getWorkingModels() {
        let el = [];
        for (let index = 0; index < workingModels.length; index++) {
            if (index === workingModels.length - 1)
                el.push(
                    <Grid item key={shortid.generate()}>
                        <WorkingModelCard removable deleteWorkingModel={deleteWorkingModel} fetchWorkingModels={fetchWorkingModels} workingModel={workingModels[index]} />
                    </Grid>
                )
            else
                el.push(
                    <Grid item key={shortid.generate()}>
                        <WorkingModelCard workingModel={workingModels[index]} />
                    </Grid>
                )
        }
        return el;
    }


    /**
     * 
     */
    return (
        <Card key={shortid.generate()} className={classes.card}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        {props.employee.name[0]}
                    </Avatar>
                }
                action={
                    uiState.profile.username !== props.employee.username &&
                    <IconButton aria-label="settings" onClick={props.handleOpen}>
                        <DeleteIcon />
                    </IconButton>
                }
                title={props.employee.name}
                subheader={props.employee.username}
            />
            <CardActions disableSpacing>
                <Grid container justify="flex-end">
                    <Typography variant="body2" style={{ textDecoration: 'underline' }}>Arbeitsmodell</Typography>
                </Grid>
                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Box display="flex" justifyContent="center">
                        <Typography style={{ color: "red", textAlign: "center" }}>
                            {error}
                        </Typography>
                        <Typography style={{ color: "green", textAlign: "center" }}>
                            {success}
                        </Typography>
                    </Box>
                    <Grid container direction="column" justify="center">
                        {getWorkingModels()}
                    </Grid>
                    <IconButton>
                        <AddCircleIcon fontSize="large" onClick={() => toggleWorkingModelForm()} />
                    </IconButton>
                    {showWorkingModel && <WorkingModelForm fetchWorkingModels={fetchWorkingModels} username={props.employee.username} />}

                </CardContent>
            </Collapse>
        </Card>
    );
}


const useStyles = makeStyles((theme) => ({
    card: {
        width: "100%",
        marginTop: "0.5em",
    },
    avatar: {
        backgroundColor: "blueviolet",
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
}));
