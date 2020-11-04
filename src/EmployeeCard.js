import React, { useState } from 'react';
import { useSelector } from "react-redux";
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
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Collapse, Typography } from '@material-ui/core';

export default function EmployeeCard(props) {
    const [expanded, setExpanded] = useState(false);
    const [showWorkingModel, setShowWorkingModel] = useState(false);
    const uiState = useSelector((state) => UiStateSlice.selectUiState(state));
    const classes = useStyles();


    function toggleWorkingModelForm() {
        setShowWorkingModel(!showWorkingModel);
    }

    /**
     * 
     */
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    function getWorkingModels(workingModels) {
        let el = [];
        for (let index = 0; index < workingModels.length; index++) {

            if (index === workingModels.length - 1)
                el.push(
                    <Grid item key={shortid.generate()}>
                        <WorkingModelCard removable workingModel={workingModels[index]} />
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
                    <Grid container direction="column" justify="center">
                        {getWorkingModels(props.employee.workingModels)}
                    </Grid>
                    <IconButton>
                        <AddCircleIcon fontSize="large" onClick={() => toggleWorkingModelForm()} />
                    </IconButton>
                    {showWorkingModel && <WorkingModelForm fetchEmployeeData={props.fetchEmployeeData} username={props.employee.username} />}

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
