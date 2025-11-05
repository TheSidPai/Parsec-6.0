import React from 'react';
import { useParams } from 'react-router-dom';

function EventDetail() {
  const { id } = useParams(); // Gets :id from URL
  return <div><h1>Event Detail (Public) - ID: {id}</h1></div>;
}

export default EventDetail;