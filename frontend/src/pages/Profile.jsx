import React, { useEffect, useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      setTimeout(() => {
        setLoading(false);
      },500);
    };
    fetchUserData();
  }, []);

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="">
        <div>           
        </div>
    </div>
  )
}

export default Profile