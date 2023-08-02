import { Box, CircularProgress } from '@mui/material';
import React from 'react';

interface ILoaderProps {
  containerHeight?: string;
}

const Loader = ({ containerHeight = '95vh' }: ILoaderProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: containerHeight,
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loader;
