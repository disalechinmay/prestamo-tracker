import { Typography } from '@mui/material';
import React from 'react';

interface EmojiProps {
  label: string;
  symbol: string;
  size: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2';
  marginRight?: number;
}

const Emoji = ({ label, symbol, size, marginRight = 0 }: EmojiProps) => {
  return (
    <Typography
      display={'inline'}
      variant={size}
      className="emoji"
      role="img"
      aria-label={label}
      sx={{ mr: marginRight }}
    >
      {symbol}
    </Typography>
  );
};

export default Emoji;
