import { Typography } from '@mui/material';
import React from 'react';

interface EmojiProps {
  label: string;
  symbol: string;
  size: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2';
}

const Emoji = ({ label, symbol, size }: EmojiProps) => {
  return (
    <Typography
      display={'inline'}
      variant={size}
      className="emoji"
      role="img"
      aria-label={label}
    >
      {symbol}
    </Typography>
  );
};

export default Emoji;
