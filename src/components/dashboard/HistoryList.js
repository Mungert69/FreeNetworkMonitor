import { useState } from "react";
import { IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const HistoryList = ({ histories, onSelectSession }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!histories || !Array.isArray(histories) || histories.length === 0) {
        return null; // Return null if histories is invalid or empty
    }

    return (
        <div>
            <h2 style={{ display: "flex", alignItems: "center" }}>
                User Histories
                <IconButton onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
            </h2>

            {isExpanded && (
                <ul>
                    {histories.map((history, index) => {
                        const sessionId = history?.sessionId || "No Session ID";
                        const name = history?.name || "Unnamed History";

                        return (
                            <li key={index}>
                                <strong>Session:</strong> {sessionId} <br />
                                <strong>Name:</strong> {name}
                                <button onClick={() => onSelectSession(sessionId)}>Select</button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default HistoryList;
