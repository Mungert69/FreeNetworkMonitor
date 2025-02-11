import { useState } from "react";
import { IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const HistoryList = ({ histories, onSelectSession, onDeleteSession, llmType, currentSessionId }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!histories || !Array.isArray(histories) || histories.length === 0) {
        return null; // Return null if histories is invalid or empty
    }

    const filteredHistories = histories.filter(history => history.llmType === llmType);

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

    const groupedHistories = groupHistoriesByDate(filteredHistories);

    return (
        <div>
            <p style={{ display: "flex", alignItems: "center" }}>
                User Histories
                <IconButton onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
            </p>

            {isExpanded && (
                <div>
                    {Object.entries(groupedHistories).map(([date, histories]) => (
                        <div key={date}>
                            <h3>{date}</h3>
                            <ul>
                                {histories.map((history, index) => {
                                    const sessionId = history?.sessionId || "No Session ID";
                                    const name = history?.name || "Unnamed History";
                                    const userId = history?.userId || "No User ID";
                                    const llmType = history?.llmType || "No LLM Type";
                                    const fullSessionId = `${sessionId}_${userId}_${llmType}`; // Construct full sessionId
                                    const isCurrentSession = sessionId && currentSessionId && sessionId === currentSessionId;
                                    return (
                                        <li key={index}>
                                            <strong>{name}</strong> 
                                            <button onClick={() => onSelectSession(sessionId)}>Select</button>
                                              {!isCurrentSession && (
                                                <button onClick={() => onDeleteSession(fullSessionId)}>Delete</button>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoryList;