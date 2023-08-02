import React from 'react';
import { useRecoilState } from 'recoil';
import { userAtom } from '../../state';
import { Box, Typography } from '@mui/material';
import Emoji from '../Emoji/Emoji';

const Greeting = () => {
  const [user, setUser] = useRecoilState(userAtom);

  return (
    <Box sx={{ mt: 3, ml: 1 }}>
      <Typography variant="h6">
        Hello, {user?.email}!
        <Emoji label="grinning-face" symbol="👋" size="h5" />
      </Typography>
    </Box>
  );
};

export default Greeting;
