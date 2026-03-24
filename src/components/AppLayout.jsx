import { Box } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function AppLayout() {
  return (
    <Box minH="100dvh" bg="orange.50">
      <Navbar />
      <Outlet />
    </Box>
  )
}
