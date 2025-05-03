import React from 'react'
import Button from './ui/Button'

const DailyTask = () => {
  return (
    <div className="w-1/4 space-y-6 ">
    <section>
      <h2 className="text-3xl font-semibold mb-4">Daily Tasks</h2>
      <ul className="space-y-4">
        {['Check-in', 'Watch a match', 'Vote for MVP'].map((task, i) => (
          <li
            key={i}
            className=" text-xl outline-1 outline-white/20 rounded-xl p-4 flex justify-between items-center backdrop-blur-2xl shadow-2xl"
          >
            <span>{task}</span>
            <Button>Complete</Button>
          </li>
        ))}
      </ul>
    </section>
  </div>
  )
}

export default DailyTask