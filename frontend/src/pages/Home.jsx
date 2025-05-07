import React from 'react'
import InsertToken from '../components/InsertToken'
import TeamList from '../components/TeamList'

const Home = () => {
  return (
    <div>
      <InsertToken />
      <div className="flex justify-center items-center">

          <TeamList />

      </div>
    </div>
  )
}

export default Home