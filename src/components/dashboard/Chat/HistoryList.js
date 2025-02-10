import { useState } from "react";
import { IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const HistoryList = ({ histories, onSelectSession }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!histories || !Array.isArray(histories) || histories.length === 0) {
        return null; // Return null if histories is invalid or empty
    }

    // Function to group histories by date
    const groupHistoriesByDate = (histories) => {
        return histories.reduce((acc, history) => {
            const date = new Date(history.StartUnixTime * 1000).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(history);
            return acc;
        }, {});
    };

    const groupedHistories = groupHistoriesByDate(histories);

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
                                    const sessionId = history?.SessionId || "No Session ID";
                                    const name = history?.Name || "Unnamed History";
                                    return (
                                        <li key={index}>
                                            <strong>Name:</strong> {name}
                                            <button onClick={() => onSelectSession(sessionId)}>Select</button>
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