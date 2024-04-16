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
            height : 150,
            width: 150,
        },
        link:{
            margin: '1rem',
            textDecoration: 'none',
            color:  theme.palette.primary.dark,
            color: "#6239AB",
                "&:hover": {
                    color: "#607466",
                    textDecoration: "none"
                }
            
        },
        linkCompact:{
            textDecoration: 'none',
            color:  theme.palette.primary.dark,
            color: "#6239AB",
                "&:hover": {
                    color: "#607466",
                    textDecoration: "none"
                }
            
        },
        chatContainer: {
            // Style the container (adjust as needed)
          },
      
          chatToggle: {
            zIndex: '2'
          },
      
          chatOpen: {
            maxHeight: '300px', // Adjust as needed
            overflow: 'auto',
            transition: 'max-height 0.3s ease-out',
          },
      
          chatClosed: {
            maxHeight: '0',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease-in',
        },
        chatAndTableContainer: {
            display: 'flex',
            position: 'relative',
          },
      
          chatContainer: {
            position: 'absolute',
            right: 0,
            top: 0,
            width: '300px',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          },
    }
}

export default styleObject;