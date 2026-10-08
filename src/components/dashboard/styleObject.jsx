import { alpha } from '@mui/material/styles';
const drawerWidth = 200;
const styleObject = (theme, imageUrl) => {
    return {
        root: {
            display: 'flex',
            backgroundColor: theme.palette.background.default,
            backgroundImage: `linear-gradient(${alpha(theme.palette.background.default, theme.palette.mode === 'dark' ? .92 : .35)}, ${alpha(theme.palette.background.default, theme.palette.mode === 'dark' ? .92 : .35)}), url(${imageUrl})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        },
        toolbar: {
            minHeight: 56,
            paddingRight: 24, // keep right padding when drawer closed
            '& > .MuiIconButton-root:not([aria-label="Toggle assistant"])': {
                width: 40,
                height: 40,
                padding: 8,
                flexShrink: 0,
            },
            '& > .MuiIconButton-root:not([aria-label="Toggle assistant"]) .MuiSvgIcon-root': { fontSize: 22 },
            [theme.breakpoints.up('sm')]: { minHeight: 56 },
            [theme.breakpoints.down('sm')]: {
                minHeight: 52,
                paddingLeft: 8,
                paddingRight: 8,
                columnGap: 0,
            },
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
            [theme.breakpoints.down('sm')]: { marginRight: 0 },
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
        appBarSpacer: {
            minHeight: 52,
            [theme.breakpoints.up('sm')]: { minHeight: 56 },
        },
        content: {
            flexGrow: 1,
            minWidth: 0,
            height: '100vh',
            overflow: 'auto',
        },
        container: {
            maxWidth: '1440px',
            padding: '24px',
            [theme.breakpoints.down('md')]: { padding: '16px' },
            [theme.breakpoints.down('sm')]: { padding: '12px 8px' }
        },
        paper: {
            width: '100%',
            minWidth: 0,
            opacity: 0.97,
            padding: theme.spacing(3),
            paddingTop: theme.spacing(4),
            paddingBottom: theme.spacing(4),
            display: 'flex',
            overflow: 'auto',
            flexDirection: 'column',
            borderRadius: 8,
            // More natural, subtle shadow
            boxShadow: '0 4px 16px 0 rgba(98,57,171,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.10)',
            background: alpha(theme.palette.background.paper, .98),
            [theme.breakpoints.down('sm')]: {
                paddingLeft: theme.spacing(1),
                paddingRight: theme.spacing(1),
                paddingTop: theme.spacing(2),
                paddingBottom: theme.spacing(2),
            },
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
            color: theme.palette.secondary.main,
            "&:hover": {
                color: theme.palette.primary.main,
                textDecoration: "none"
            }

        },
        linkCompact: {
            textDecoration: 'none',
            color: theme.palette.secondary.main,
            "&:hover": {
                color: theme.palette.primary.main,
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


        chatToggle: {
            position: 'fixed', // Fix position relative to the viewport
            right: 10, // 20px from the right edge of the viewport
            bottom: 70, // 20px from the bottom edge of the viewport
            zIndex: 1100, // Ensure it's above most other items
            backgroundColor: theme.palette.primary.light, // A lighter background color for visibility
            color: theme.palette.primary.contrastText,
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

        card: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '400px', // Set minimum height for all cards
        },
        scrollableContent: {
            overflowY: 'auto',
            maxHeight: '200px', // Adjust based on your needs
            paddingRight: theme.spacing(1),
            // Custom scrollbar (optional)
            '&::-webkit-scrollbar': {
                width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: theme.palette.grey[400],
                borderRadius: '3px',
            },
        }
    }
}

export default styleObject;
