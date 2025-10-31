import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { alpha, lighten, useTheme } from '@mui/material/styles';

const VisualGuides = ({ guides }) => {
    const theme = useTheme();
    const [activeGuide, setActiveGuide] = React.useState(null);

    const handleGuideOpen = React.useCallback((guide) => {
        setActiveGuide(guide);
    }, []);

    const handleGuideClose = React.useCallback(() => {
        setActiveGuide(null);
    }, []);

    if (!guides || guides.length === 0) {
        return null;
    }

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: 2,
                }}
            >
                {guides.map((guide) => {
                    const accent = guide.accent || theme.palette.primary.main;
                    return (
                        <Button
                            key={guide.id}
                            variant="contained"
                            startIcon={<PlayCircleOutlineIcon />}
                            onClick={() => handleGuideOpen(guide)}
                            aria-label={`Open ${guide.subtitle}`}
                            sx={{
                                borderRadius: 999,
                                px: 3,
                                py: 1.25,
                                textTransform: 'none',
                                fontWeight: 600,
                                boxShadow: '0 12px 28px rgba(0,0,0,0.14)',
                                bgcolor: accent,
                                color: theme.palette.getContrastText(accent),
                                '&:hover': {
                                    bgcolor: lighten(accent, 0.08),
                                },
                                '&:focus-visible': {
                                    outline: `3px solid ${alpha(accent, 0.45)}`,
                                    outlineOffset: 2,
                                },
                            }}
                        >
                            {guide.subtitle}
                        </Button>
                    );
                })}
            </Box>
            <Dialog
                open={Boolean(activeGuide)}
                onClose={handleGuideClose}
                fullWidth
                maxWidth="md"
                aria-labelledby="visual-guide-dialog-title"
            >
                {activeGuide && (
                    <>
                        <DialogTitle id="visual-guide-dialog-title">
                            {activeGuide.subtitle}
                        </DialogTitle>
                        <DialogContent dividers>
                            <Box
                                component="video"
                                key={activeGuide.id}
                                src={activeGuide.videoSrc}
                                controls
                                autoPlay
                                playsInline
                                sx={{
                                    width: '100%',
                                    borderRadius: 2,
                                    backgroundColor: '#000000',
                                    outline: 'none',
                                }}
                            />
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                                {activeGuide.description}
                            </Typography>
                        </DialogContent>
                        <DialogActions sx={{ flexWrap: 'wrap', gap: 1.5, px: 3, pb: 3 }}>
                            <Button onClick={handleGuideClose}>
                                Close
                            </Button>
                            <Button
                                component="a"
                                href={activeGuide.videoSrc}
                                download
                                rel="noopener noreferrer"
                            >
                                Download Video
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </>
    );
};

VisualGuides.propTypes = {
    guides: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            subtitle: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            videoSrc: PropTypes.string.isRequired,
            accent: PropTypes.string,
            hash: PropTypes.string,
        }),
    ),
};

export default React.memo(VisualGuides);
