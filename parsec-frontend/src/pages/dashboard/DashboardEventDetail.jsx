import React from 'react';
import { useParams } from 'react-router-dom';

function DashboardEventDetail() {
  const { id } = useParams();
  return <div><h1>Dashboard Event Detail - ID: {id}</h1></div>;
}

export default DashboardEventDetail;