import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Header from "./Header";
import Products from "./Products";
import './loggedin.scss'
import Administration from "./Administration";
import CreateProduct from "./CreateProduct";

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {/*{value}*/}
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

const Loggedin = () => {

    const classes = useStyles();
    const [value, setValue] = React.useState(parseInt(localStorage.getItem("tabPrincipal")));

    const handleChange = (event, newValue) => {
        setValue(newValue);
        localStorage.setItem("tabPrincipal", newValue);
    };

    if (localStorage.getItem("role") === "1") {
        return (
            <div className="loggedin">
                <Header/>
                <div className={classes.root}>
                    <AppBar position="static">
                        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                            <Tab
                                label={parseInt(localStorage.getItem("language")) === 0 ? "Products" : "Produse"} {...a11yProps(0)} />
                            <Tab
                                label={parseInt(localStorage.getItem("language")) === 0 ? "Create Product" : "Adauga Produs"} {...a11yProps(1)} />
                            <Tab
                                label={parseInt(localStorage.getItem("language")) === 0 ? "Administration" : "Administrare utilizatori"} {...a11yProps(2)} />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={value} index={0}>
                        <Products/>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <CreateProduct/>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <Administration/>
                    </TabPanel>
                </div>
            </div>
        );
    } else {
        if (localStorage.getItem("role") === "0") {
            return (
                <div className="loggedin">
                    <Header/>
                    <div className={classes.root}>
                        <AppBar position="static">
                            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                                <Tab
                                    label={parseInt(localStorage.getItem("language")) === 0 ? "Products" : "Produse"} {...a11yProps(0)} />
                                </Tabs>
                        </AppBar>
                        <TabPanel value={value} index={0}>
                            <Products/>
                        </TabPanel>
                    </div>
                </div>
            );

        }
    }

    return <div>
        {/*{typeof localStorage.getItem("role")}*/}
        {localStorage.getItem("role")}

        <p>You need to login first!</p>
    </div>
}

export default Loggedin
