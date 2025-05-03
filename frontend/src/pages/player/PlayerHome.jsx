// pages/Homepage.tsx (or app/page.tsx depending on setup)
import React from 'react';
import NextMatch from '../../components/NextMatch';
import DailyTask from '../../components/DailyTask';

const PlayerHome = () => {
  return (
    <div className="text-white">
      {/* Content Layer */}
      <div className="relative z-10">

        {/*Left Main Content*/}
        <div className="flex flex-row px-6 py-6 gap-6">
          <div className="w-3/4 space-y-8">
            {/* Next Match */}
            <NextMatch />

        </div>

        {/* Right Section */}
        {/* <DailyTask /> */}
          </div>
        </div>
      </div>
  );
};

export default PlayerHome;
