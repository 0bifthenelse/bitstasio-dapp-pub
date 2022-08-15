import React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

interface Props {
  text: string;
}

export default function InfoBubble(props: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <span
        className="info-bubble"
        style={{
          position: "relative",
          bottom: "2px",
          right: "2px"
        }}
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <QuestionMarkIcon sx={{ fontSize: 14 }} />
      </span>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1, fontSize: "12px" }}>{props.text}</Typography>
      </Popover>
    </>
  );
}