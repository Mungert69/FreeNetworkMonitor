const drawerWidth = 240;
const styleObject = (theme, imageUrl) => {
    return {
        root: {
            display: 'flex',
            backgroundImage: `url(${imageUrl})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        },
        toolbar: {
            paddingRight: 24, // keep right padding when drawer closed

        },
        dataSetList: {
            padding: '0px',
        },
        toolbarIcon: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 8px',
            ...theme.mixins.toolbar,
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: 36,
        },
        menuButtonHidden: {
            display: 'none',
        },
        title: {
            flexGrow: 1,
        },
        drawerPaper: {
            opacity: 0.7,
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        drawerPaperClose: {
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            width: theme.spacing(12),
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(14),
            },
        },
        appBarSpacer: theme.mixins.toolbar,
        content: {
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
        },
        container: {
            paddingTop: theme.spacing(4),
            paddingBottom: theme.spacing(4),
        },
        paper: {
            opacity: 0.9,
            padding: theme.spacing(2),
            display: 'flex',
            overflow: 'auto',
            flexDirection: 'column',
        },
        fixedHeight: {
            height: 240,
        },
        fixedHeightTall: {
            height: 440,
        },
        monitorImage: {
            height: 150,
            width: 150,
        },
        link: {
            margin: '1rem',
            textDecoration: 'none',
             color: "#6239AB",
            "&:hover": {
                color: "#607466",
                textDecoration: "none"
            }

        },
        linkCompact: {
            textDecoration: 'none',
            color: "#6239AB",
            "&:hover": {
                color: "#607466",
                textDecoration: "none"
            }

        },



        listItem: {
            whiteSpace: 'normal',
            marginRight: theme.spacing(1),
        },
        list: {
            overflowX: 'auto',
            padding: 0,
        },
      
     
        chatOpen: {
            maxHeight: '350px', // Adjust as needed
            overflow: 'auto',
            transition: 'max-height 0.3s ease-out',
        },

     
        chatToggleShift: {
            transform: 'translateX(-300px)', // Adjust this value based on your layout
          },

        chatToggle: {
            position: 'fixed', // Fix position relative to the viewport
            right: 20, // 20px from the right edge of the viewport
            bottom: 20, // 20px from the bottom edge of the viewport
            zIndex: 1100, // Ensure it's above most other items
            backgroundColor: theme.palette.primary.light, // A lighter background color for visibility
            color: 'white', // White icon color
            '&:hover': {
                backgroundColor: theme.palette.primary.main, // Darker on hover
            },
            width: 56, // Width of the icon button
            height: 56, // Height of the icon button
            borderRadius: '50%', // Circular button
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)' // Soft shadow for better visibility
        },
        chatHidden: {
            display: 'none', // default to hidden
            // other styles for the chat container
        },




    }
}

export default styleObject;