import React, { useState } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import clsx from 'clsx';
import shortid from "shortid";
import FlextimeCorrection from "./FlextimeCorrection";
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
import Divider from "@material-ui/core/Divider";
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { Collapse, Typography } from '@material-ui/core';

export default function EmployeeCard(props) {
    const [expanded, setExpanded] = useState(false);
    const [showWorkingModel, setShowWorkingModel] = useState(false);
    const [workingModels, setWorkingModels] = useState([]);
    const [error, setError] = useState("");
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
    function toggleWorkingModelForm() {
        setShowWorkingModel(!showWorkingModel);
    }

    /**
     * 
     */
    const handleExpandClick = () => {
        setExpanded(!expanded);
        if (!expanded)
            fetchWorkingModels();
    };


    /**
     * 
     */
    function saveWorkingModel(workingModel) {
        const errorMsg = "Das Arbeitsmodell konnte nicht gespeichert werden.";
        fetch(`${process.env.REACT_APP_API_URL}/workingModel/${props.employee.username}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                'auth-token': localStorage.getItem('jwt')
            },
            body: JSON.stringify(workingModel),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success)
                    return;
                else if (data.errorCode === 4007 || data.errorCode === 4008 || data.errorCode === 4009) {
                    console.error(errorMsg, data)
                    if (loc.pathname !== '/Login')
                        history.push('/Login');
                }
                else if (data.errorCode === 4024) {
                    showError(errorMsg + " Das neue Arebitsmodell muss mindestens einen Tag Abstand zum letzten Arbeitsmodell haben.")
                }
                else {
                    console.error(errorMsg + " Unerwarteter Fehler.", data)
                    showError(errorMsg + " Unerwarteter Fehler.");
                }
            })
            .catch((err) => {
                console.error(errorMsg + " Der Server antwortet nicht.", err);
                showError(errorMsg + " Der Server antwortet nicht.");
            })
            .finally(() => {
                fetchWorkingModels();
            })
    }


    /**
     * 
     */
    function deleteWorkingModel(id) {
        const errorMsg = "Das Arbeitsmodell konnte nicht gelöscht werden.";
        fetch(`${process.env.REACT_APP_API_URL}/workingModel/${id}`, {
            method: "DELETE",
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
                'auth-token': localStorage.getItem('jwt')
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success)
                    return;
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
            })
            .finally(() => {
                fetchWorkingModels();
            })
    }


    /**
     * 
     */
    const fetchWorkingModels = () => {
        const errorMsg = "Das Arbeitsmodell konnte nicht abgerufen werden.";
        fetch(`${process.env.REACT_APP_API_URL}/workingModel/${props.employee.username}`, {
            method: "GET",
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
                'auth-token': localStorage.getItem('jwt'),
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success)
                    setWorkingModels(data.success.workingModels);
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
    }


    /**
     * 
     */
    function getWorkingModels() {

        let el = [];
        for (let index = 0; index < workingModels.length; index++) {
            if (index === workingModels.length - 1)
                el.push(
                    <Grid item key={shortid.generate()}>
                        <WorkingModelCard removable deleteWorkingModel={deleteWorkingModel} workingModel={workingModels[index]} />
                    </Grid>
                )
            else
                el.push(
                    <Grid item key={shortid.generate()}>
                        <WorkingModelCard locked workingModel={workingModels[index]} />
                    </Grid>
                )
        }
        return el;
    }


    /**
     * 
     */
    return (
        <Card className={classes.card}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        {props.employee.name[0]}
                    </Avatar>
                }
                action={
                    props.profile && props.profile.username !== props.employee.username &&
                    <IconButton aria-label="settings" onClick={props.handleOpen}>
                        <DeleteIcon />
                    </IconButton>
                }
                title={props.employee.name}
                subheader={props.employee.username}
            />
            <CardActions disableSpacing>
                <Grid container justify="flex-end">
                    <Typography variant="body2">Details</Typography>
                </Grid>
                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                    size="small"
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
                    </Box>
                   <FlextimeCorrection user={props.employee}/>
                    <Box style={{ marginTop: '2em', marginBottom: '2em' }}>
                        <Divider variant="middle"/>
                    </Box>
                    <Box display="flex" justifyContent="center" style={{ marginBottom: '1em' }}>
                        <Typography variant="h6" style={{ textDecoration: 'underline' }}>Arbeitsmodell</Typography>
                    </Box>
                    <Grid container direction="column" justify="center">
                        {getWorkingModels()}
                    </Grid>
                    <Grid container justify="center">
                        <IconButton>
                            {showWorkingModel ?
                                <ExpandLessIcon onClick={() => toggleWorkingModelForm()} />
                                :
                                <ExpandMoreIcon onClick={() => toggleWorkingModelForm()} />
                            }
                        </IconButton>
                    </Grid>
                    {showWorkingModel && <WorkingModelForm saveWorkingModel={saveWorkingModel} username={props.employee.username} />}
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
