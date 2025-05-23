// import React from 'react';
// import { Camera, Gamepad, User, Users, Sword, Shield, Heart, Zap, Target } from 'lucide-react';
// import { TEAM_BLUE, TEAM_RED } from '../pages/GameSimulation/GameClass';

// // Stats component for a team
// export const TeamStats = ({ game, team }) => {
//   if (!game) return null;
  
//   const teamHeroes = game.heroes.filter(h => h.team === team);
//   const teamStructures = game.structures.filter(s => s.team === team);
  
//   const aliveStructures = teamStructures.filter(s => s.alive);
//   const aliveHeroes = teamHeroes.filter(h => h.alive);
  
//   const teamKills = teamHeroes.reduce((sum, hero) => sum + hero.kills, 0);
  
//   return (
//     <div className={`p-2 rounded-lg ${team === TEAM_BLUE ? 'bg-blue-900' : 'bg-red-900'}`}>
//       <h3 className="text-lg font-bold text-white">
//         {team === TEAM_BLUE ? 'Blue Team' : 'Red Team'}
//       </h3>
//       <div className="flex items-center justify-between">
//         <span className="text-white">Heroes: {aliveHeroes.length}/5</span>
//         <span className="text-white">Structures: {aliveStructures.length}/{teamStructures.length}</span>
//         <span className="text-white">Kills: {teamKills}</span>
//       </div>
//     </div>
//   );
// };

// // Hero card component
// export const HeroCard = ({ hero, selectedHero, handleSelectHero }) => {
//   if (!hero) return null;
  
//   return (
//     <div 
//       className={`p-2 rounded-lg mb-2 cursor-pointer ${
//         hero.team === TEAM_BLUE ? 'bg-blue-800' : 'bg-red-800'
//       } ${selectedHero === hero.id ? 'ring-2 ring-yellow-400' : ''}`}
//       onClick={() => handleSelectHero(hero.id)}
//     >
//       <div className="flex justify-between items-center">
//         <span className="font-bold text-white">{hero.name}</span>
//         <span className="text-white">Lvl {hero.level}</span>
//       </div>
      
//       <div className="text-sm text-white">{hero.type}</div>
      
//       {!hero.alive ? (
//         <div className="text-gray-300">
//           Respawning in {Math.ceil(hero.respawnTime)}s
//         </div>
//       ) : (
//         <>
//           <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
//             <div 
//               className="bg-green-500 h-2 rounded-full" 
//               style={{ width: `${(hero.health / hero.getMaxHealth()) * 100}%` }}
//             ></div>
//           </div>
          
//           <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
//             <div 
//               className="bg-blue-500 h-2 rounded-full" 
//               style={{ width: `${(hero.mana / hero.getMaxMana()) * 100}%` }}
//             ></div>
//           </div>
          
//           <div className="text-xs text-gray-300 mt-1">
//             {hero.kills}/{hero.deaths}/{hero.assists} - {Math.round(hero.attackDamage)} AD / {Math.round(hero.abilityPower)} AP
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// // Selected hero control panel
// export const HeroControls = ({ game, selectedHero, handleUseAbility }) => {
//   if (!game || !selectedHero) return null;
  
//   const hero = game.heroes.find(h => h.id === selectedHero);
//   if (!hero) return null;
  
//   // Generate ability name based on hero type
//   const getAbilityName = (abilityNumber, heroType) => {
//     const abilityNames = {
//       Tank: ['Taunt', 'Shield Wall', 'Ground Slam', 'Unstoppable'],
//       Fighter: ['Strike', 'Whirlwind', 'Execute', 'Rampage'],
//       Mage: ['Fireball', 'Frost Nova', 'Lightning Strike', 'Meteor Shower'],
//       Marksman: ['Snipe', 'Rapid Fire', 'Explosive Shot', 'Rain of Arrows'],
//       Support: ['Heal', 'Shield', 'Area Heal', 'Team Shield']
//     };
    
//     return abilityNames[heroType][abilityNumber - 1];
//   };
  
//   return (
//     <div className="bg-gray-800 p-3 rounded-lg">
//       <h3 className="text-lg font-bold text-white mb-2">
//         {hero.name} Controls
//       </h3>
      
//       <div className="grid grid-cols-2 gap-2">
//         <button
//           className={`p-2 rounded ${
//             hero.cooldowns.ability1 > 0 ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'
//           } text-white flex items-center justify-center`}
//           onClick={() => handleUseAbility(hero.id, 'ability1')}
//           disabled={hero.cooldowns.ability1 > 0 || !hero.alive}
//         >
//           <Sword className="w-4 h-4 mr-1" />
//           {hero.cooldowns.ability1 > 0 
//             ? `${Math.ceil(hero.cooldowns.ability1)}s` 
//             : getAbilityName(1, hero.type)}
//         </button>
        
//         <button
//           className={`p-2 rounded ${
//             hero.cooldowns.ability2 > 0 ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'
//           } text-white flex items-center justify-center`}
//           onClick={() => handleUseAbility(hero.id, 'ability2')}
//           disabled={hero.cooldowns.ability2 > 0 || !hero.alive}
//         >
//           <Shield className="w-4 h-4 mr-1" />
//           {hero.cooldowns.ability2 > 0 
//             ? `${Math.ceil(hero.cooldowns.ability2)}s` 
//             : getAbilityName(2, hero.type)}
//         </button>
        
//         <button
//           className={`p-2 rounded ${
//             hero.cooldowns.ability3 > 0 ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'
//           } text-white flex items-center justify-center`}
//           onClick={() => handleUseAbility(hero.id, 'ability3')}
//           disabled={hero.cooldowns.ability3 > 0 || !hero.alive}
//         >
//           <Zap className="w-4 h-4 mr-1" />
//           {hero.cooldowns.ability3 > 0 
//             ? `${Math.ceil(hero.cooldowns.ability3)}s` 
//             : getAbilityName(3, hero.type)}
//         </button>
        
//         <button
//           className={`p-2 rounded ${
//             hero.cooldowns.ultimate > 0 ? 'bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'
//           } text-white flex items-center justify-center`}
//           onClick={() => handleUseAbility(hero.id, 'ultimate')}
//           disabled={hero.cooldowns.ultimate > 0 || !hero.alive}
//         >
//           <Target className="w-4 h-4 mr-1" />
//           {hero.cooldowns.ultimate > 0 
//             ? `${Math.ceil(hero.cooldowns.ultimate)}s` 
//             : getAbilityName(4, hero.type)}
//         </button>
//       </div>
      
//       <div className="mt-2 text-sm text-gray-300">
//         Click on the map to move the selected hero
//       </div>
//     </div>
//   );
// };

// // Game controls
// export const GameControls = ({ isPaused, setIsPaused, gameSpeed, setGameSpeed, cameraView, setCameraView, resetGame }) => {
//   return (
//     <div className="bg-gray-800 p-3 rounded-lg">
//       <h3 className="text-lg font-bold text-white mb-2">
//         Game Controls
//       </h3>
      
//       <div className="flex space-x-2 mb-2">
//         <button
//           className={`p-2 rounded ${isPaused ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
//           onClick={() => setIsPaused(!isPaused)}
//         >
//           {isPaused ? 'Resume' : 'Pause'}
//         </button>
        
//         <button
//           className="p-2 rounded bg-yellow-600 hover:bg-yellow-700 text-white"
//           onClick={resetGame}
//         >
//           Restart
//         </button>
//       </div>
      
//       <div className="mb-2">
//         <label className="text-white block mb-1">Game Speed</label>
//         <input
//           type="range"
//           min="0.5"
//           max="3"
//           step="0.5"
//           value={gameSpeed}
//           onChange={(e) => setGameSpeed(parseFloat(e.target.value))}
//           className="w-full"
//         />
//         <div className="text-center text-white">{gameSpeed}x</div>
//       </div>
      
//       <div>
//         <label className="text-white block mb-1">Camera View</label>
//         <div className="grid grid-cols-4 gap-1">
//           <button
//             className={`p-1 rounded ${cameraView === 'top' ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-700'} text-white text-xs flex items-center justify-center`}
//             onClick={() => setCameraView('top')}
//           >
//             <Camera className="w-3 h-3 mr-1" />
//             Top
//           </button>
//           <button
//             className={`p-1 rounded ${cameraView === 'blue' ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-700'} text-white text-xs flex items-center justify-center`}
//             onClick={() => setCameraView('blue')}
//           >
//             <Camera className="w-3 h-3 mr-1" />
//             Blue
//           </button>
//           <button
//             className={`p-1 rounded ${cameraView === 'red' ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-700'} text-white text-xs flex items-center justify-center`}
//             onClick={() => setCameraView('red')}
//           >
//             <Camera className="w-3 h-3 mr-1" />
//             Red
//           </button>
//           <button
//             className={`p-1 rounded ${cameraView === 'side' ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-700'} text-white text-xs flex items-center justify-center`}
//             onClick={() => setCameraView('side')}
//           >
//             <Camera className="w-3 h-3 mr-1" />
//             Side
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Game over display
// export const GameOver = ({ game, resetGame }) => {
//   if (!game || game.gameState !== 'ended') return null;
  
//   return (
//     <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
//       <div className="bg-gray-900 p-6 rounded-lg text-center">
//         <h2 className="text-3xl font-bold mb-4 text-white">
//           Game Over
//         </h2>
//         <p className="text-xl text-white mb-6">
//           {game.winner === TEAM_BLUE ? 'Blue Team' : 'Red Team'} Wins!
//         </p>
//         <button
//           className="p-3 rounded bg-blue-600 hover:bg-blue-700 text-white"
//           onClick={resetGame}
//         >
//           Play Again
//         </button>
//       </div>
//     </div>
//   );
// };