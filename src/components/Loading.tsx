import React from 'react'


import { CircularProgress, styled } from '@mui/material'

interface LoadingProps {
  size?: string
  color?: string
}

export const Loading: React.FC<LoadingProps> = () => {


  return (
    <SpinnerContainer>
       <CircularProgress />
    </SpinnerContainer>
  )
}

const SpinnerContainer = styled("div")`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
