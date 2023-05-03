import React, { useEffect } from 'react'
import { useStateContext } from '../contexts/ContextProvider';

const Dashboard = () => {
  const { setPageTitle } = useStateContext();

  useEffect(()=>{
    setPageTitle('Dashboard')
  },[])

 

  return (
    <div>Dashboard</div>
  )
}

export default Dashboard