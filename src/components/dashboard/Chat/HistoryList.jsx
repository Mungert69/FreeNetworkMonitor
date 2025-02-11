import { List, ListItem, ListItemText, Typography, Paper, Divider, Box, IconButton } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline"; // Select icon
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"; // Delete icon
import { useTheme } from '@mui/material/styles';

const HistoryList = ({ histories, onSelectSession, onDeleteSession, llmType, currentSessionId }) => {
    const theme = useTheme();

    if (!histories || !Array.isArray(histories) || histories.length === 0) {
        return (
            <Paper elevation={3} sx={{ p: 2, backgroundColor: theme.palette.background.paper }}>
                <Typography variant="body1" color="textSecondary">
                    No chat histories available.
                </Typography>
            </Paper>
        );
    }

    const filteredHistories = histories.filter(history => history.llmType === llmType);

    // Separate the current session from the rest
    const currentSession = filteredHistories.find(history => history.sessionId === currentSessionId);
    const otherHistories = filteredHistories.filter(history => history.sessionId !== currentSessionId);

    // Function to group histories by date
    const groupHistoriesByDate = (histories) => {
        return histories.reduce((acc, history) => {
            const date = new Date(history.startUnixTime * 1000).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(history);
            return acc;
        }, {});
    };

    const groupedHistories = groupHistoriesByDate(otherHistories);

    return (
        <Paper elevation={3} sx={{ p: 2, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="h6" sx={{ color: theme.palette.primary.main, mb: 2 }}>
                Chat Histories for {llmType}
            </Typography>

            {/* Render the current session at the top */}
            {currentSession && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ color: theme.palette.secondary.main, mb: 1 }}>
                        Current Session
                    </Typography>
                    <List>
                        <ListItem sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                            <IconButton
                                onClick={() => onSelectSession(currentSession.sessionId)}
                                sx={{ mr: 1, color: theme.palette.primary.main }}
                            >
                                <PlayCircleOutlineIcon />
                            </IconButton>
                            <ListItemText
                                primary={currentSession.name || "Unnamed History"}
                                sx={{ color: theme.palette.text.primary, flexGrow: 1 }}
                            />
                        </ListItem>
                    </List>
                    <Divider sx={{ my: 2 }} />
                </Box>
            )}

            {/* Render the rest of the histories grouped by date */}
            {Object.entries(groupedHistories).map(([date, histories]) => (
                <Box key={date} sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ color: theme.palette.secondary.main, mb: 1 }}>
                        {date}
                    </Typography>
                    <List>
                        {histories.map((history, index) => {
                            const sessionId = history?.sessionId || "No Session ID";
                            const name = history?.name || "Unnamed History";
                            const userId = history?.userId || "No User ID";
                            const llmType = history?.llmType || "No LLM Type";
                            const fullSessionId = `${sessionId}_${userId}_${llmType}`; // Construct full sessionId
                            return (
                                <ListItem key={index} sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                                    {/* Select Icon */}
                                    <IconButton
                                        onClick={() => onSelectSession(sessionId)}
                                        sx={{ mr: 1, color: theme.palette.primary.main }}
                                    >
                                        <PlayCircleOutlineIcon />
                                    </IconButton>

                                    {/* Name Text */}
                                    <ListItemText
                                        primary={name}
                                        sx={{ color: theme.palette.text.primary, flexGrow: 1 }}
                                    />

                                    {/* Delete Icon (right-justified) */}
                                    <IconButton
                                        onClick={() => onDeleteSession(fullSessionId)}
                                        sx={{ color: theme.palette.error.main }}
                                    >
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                </ListItem>
                            );
                        })}
                    </List>
                    <Divider sx={{ my: 2 }} />
                </Box>
            ))}
        </Paper>
    );
};

export default HistoryList;