import React from 'react'
import styled from 'styled-components';
import Menu from '../components/Menu'
import Navbar from '../components/Navbar'

const Container=styled.div`
display:flex;
`;
export default function SharedLayout() {
  return (
    <Container>
      <Menu/>
      <Navbar/>
    </Container>
  )
}

