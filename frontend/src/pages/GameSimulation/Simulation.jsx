import React, { useState, useEffect, useRef } from 'react';
import { GameRenderer } from './GameVisual';
import { TEAM_BLUE, TEAM_RED, HERO_TYPES, HERO_COLORS } from './GameClasses';
import { Game } from './GameClass';

// Main MOBA Simulation component
export default function Simulation() {
  const [game, setGame] = useState(null);
  const [selectedHero, setSelectedHero] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(10);
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastUpdateTimeRef = useRef(Date.now());
  
  // Initialize game
  useEffect(() => {
    const newGame = new Game();
    setGame(newGame);
  }, []);
  
  // Initialize renderer
  useEffect(() => {
    if (!game || !canvasRef.current) return;
    
    const renderer = new GameRenderer(game, canvasRef.current);
    rendererRef.current = renderer;
    
    // Handle window resize
    const handleResize = () => {
      if (rendererRef.current) {
        rendererRef.current.resizeCanvas();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [game]);
  
  // Game loop
  useEffect(() => {
    if (!game || !rendererRef.current) return;
    
    const gameLoop = () => {
      // Calculate delta time
      const now = Date.now();
      const deltaTime = (now - lastUpdateTimeRef.current) / 1000 * gameSpeed;
      lastUpdateTimeRef.current = now;
      
      // Update game if not paused
      if (!isPaused) {
        game.update(deltaTime);
        
        // Update selected hero flag
        if (selectedHero !== null) {
          game.heroes.forEach(hero => {
            hero.isSelected = hero.id === selectedHero;
          });
        }
      }
      
      // Render game
      rendererRef.current.render();
      
      // Request next frame
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };
    
    gameLoop();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [game, isPaused, gameSpeed, selectedHero]);
  
  // Handle canvas click to select hero or set target
  const handleCanvasClick = (e) => {
    if (!game || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Calculate click position in game coordinates
    const scaleX = 1000 / canvas.width;
    const scaleY = 1000 / canvas.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    // Check if we clicked on a hero
    const clickedHero = game.heroes.find(hero => {
      const dx = hero.x - x;
      const dy = hero.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance <= hero.radius && hero.alive;
    });
    
    if (clickedHero) {
      // Select hero
      setSelectedHero(clickedHero.id);
    } else if (selectedHero !== null) {
      // Move selected hero
      const hero = game.heroes.find(h => h.id === selectedHero);
      if (hero && hero.alive) {
        hero.setTarget(x, y);
      }
    }
  };
  
  // Handle ability use
  const handleUseAbility = (heroId, abilityName) => {
    if (!game) return;
    
    const hero = game.heroes.find(h => h.id === heroId);
    if (hero) {
      // Use ability on all heroes (targeting logic handled in useAbility method)
      hero.useAbility(abilityName, game.heroes);
    }
  };
  
  // Reset game
  const resetGame = () => {
    setSelectedHero(null);
    setIsPaused(false);
    setGame(new Game());
  };
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Get ability name based on hero type
  const getAbilityName = (abilityName, heroType) => {
    const abilityNames = {
      Tank: ['Taunt', 'Shield Wall', 'Ground Slam', 'Unstoppable'],
      Fighter: ['Strike', 'Whirlwind', 'Execute', 'Rampage'],
      Mage: ['Fireball', 'Frost Nova', 'Lightning Strike', 'Meteor Shower'],
      Marksman: ['Snipe', 'Rapid Fire', 'Explosive Shot', 'Rain of Arrows'],
      Support: ['Heal', 'Shield', 'Area Heal', 'Team Shield']
    };
    
    switch(abilityName) {
      case 'ability1': return abilityNames[heroType][0];
      case 'ability2': return abilityNames[heroType][1];
      case 'ability3': return abilityNames[heroType][2];
      case 'ultimate': return abilityNames[heroType][3];
      default: return 'Unknown';
    }
  };
  
  // Game over component
  const GameOver = () => {
    if (!game || game.gameState !== 'ended') return null;
    
    return (
      <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
        <div className="bg-gray-800 p-6 rounded text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Game Over
          </h2>
          <p className="text-xl text-white mb-6">
            {game.winner === TEAM_BLUE ? 'Blue Team' : 'Red Team'} Wins!
          </p>
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            onClick={resetGame}
          >
            Play Again
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-gray-900 text-white">
      <div className="p-2 border-b border-gray-700 flex justify-between items-center">
        <h1 className="text-xl font-bold">MOBA Simulation</h1>
        <div className="flex space-x-2 items-center">
          <button
            className={`px-3 py-1 rounded ${isPaused ? 'bg-green-600' : 'bg-red-600'}`}
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            className="px-3 py-1 rounded bg-yellow-600"
            onClick={resetGame}
          >
            Restart
          </button>
          {/* <div className="flex items-center space-x-2 ml-4">
            <span>Speed:</span>
            <select
              value={gameSpeed}
              onChange={(e) => setGameSpeed(Number(e.target.value))}
              className="bg-gray-700 text-white rounded px-2 py-1"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={3}>3x</option>
            </select>
          </div> */}
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Game canvas */}
        <div className="relative flex-1">
          <canvas 
            ref={canvasRef}
            className="w-full h-full" 
            onClick={handleCanvasClick}
          />
          
          {game && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-80 px-3 py-1 rounded">
              {formatTime(game.gameTime)}
            </div>
          )}
          
          <GameOver />
        </div>
        
        {/* Sidebar */}
        {/* <div className="w-64 bg-gray-800 p-3 overflow-y-auto scrollbar-hide flex flex-col space-y-3">
          {game && (
            <>
              <div className="space-y-2"> */}
                {/* Team stats */}
                {/* <div className="bg-blue-900 p-2 rounded">
                  <h3 className="text-lg font-bold">Blue Team</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Heroes: {game.getTeamHeroesAlive(TEAM_BLUE)}/5</div>
                    <div>Kills: {game.getTeamKills(TEAM_BLUE)}</div>
                    <div>Deaths: {game.getTeamDeaths(TEAM_BLUE)}</div>
                    <div>Structures: {game.getTeamStructuresAlive(TEAM_BLUE)}/7</div>
                  </div>
                </div>
                
                <div className="bg-red-900 p-2 rounded">
                  <h3 className="text-lg font-bold">Red Team</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Heroes: {game.getTeamHeroesAlive(TEAM_RED)}/5</div>
                    <div>Kills: {game.getTeamKills(TEAM_RED)}</div>
                    <div>Deaths: {game.getTeamDeaths(TEAM_RED)}</div>
                    <div>Structures: {game.getTeamStructuresAlive(TEAM_RED)}/7</div>
                  </div>
                </div>
              </div> */}
              
              {/* {selectedHero !== null && (
                <div className="bg-gray-700 p-2 rounded">
                  {(() => {
                    const hero = game.heroes.find(h => h.id === selectedHero);
                    if (!hero) return null;
                    
                    return (
                      <>
                        <h3 className="font-bold mb-2">
                          {hero.name} ({hero.heroType}) - Level {hero.level}
                        </h3>
                        
                        <div className="mb-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Health: {Math.floor(hero.health)}/{hero.maxHealth}</span>
                            <span>Mana: {Math.floor(hero.mana)}/{hero.maxMana}</span>
                          </div>
                          
                          <div className="w-full bg-gray-800 h-2 rounded mb-1">
                            <div 
                              className="bg-green-500 h-2 rounded"
                              style={{ width: `${(hero.health / hero.maxHealth) * 100}%` }}
                            ></div>
                          </div>
                          
                          <div className="w-full bg-gray-800 h-2 rounded">
                            <div 
                              className="bg-blue-500 h-2 rounded"
                              style={{ width: `${(hero.mana / hero.maxMana) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div className="text-xs">
                            <div>Attack: {Math.floor(hero.attackDamage)}</div>
                            <div>Ability Power: {Math.floor(hero.abilityPower)}</div>
                          </div>
                          <div className="text-xs">
                            <div>Armor: {Math.floor(hero.armor)}</div>
                            <div>K/D/A: {hero.kills}/{hero.deaths}/{hero.assists}</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          {['ability1', 'ability2', 'ability3', 'ultimate'].map(ability => (
                            <button
                              key={ability}
                              className={`px-2 py-1 rounded text-white text-xs
                                ${ability === 'ultimate' 
                                  ? 'bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600' 
                                  : 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600'}
                                transition-colors focus:outline-none`}
                              onClick={() => handleUseAbility(selectedHero, ability)}
                              disabled={!hero.alive || hero.cooldowns[ability] > 0}
                            >
                              {hero.cooldowns[ability] > 0 
                                ? `${Math.ceil(hero.cooldowns[ability])}s` 
                                : getAbilityName(ability, hero.heroType)}
                            </button>
                          ))}
                        </div>
                        
                        <div className="mt-2 text-xs text-gray-400">
                          Click on the map to move the selected hero
                        </div>
                      </>
                    );
                  })()}
                </div>
              )} */}
              
              {/* <div>
                <h3 className="font-bold mb-1">Blue Team Heroes</h3>
                <div className="space-y-1">
                  {game.heroes
                    .filter(h => h.team === TEAM_BLUE)
                    .map(hero => (
                      <div 
                        key={hero.id}
                        className={`p-2 rounded cursor-pointer ${
                          selectedHero === hero.id ? 'bg-blue-700 ring-1 ring-yellow-400' : 'bg-blue-800'
                        }`}
                        onClick={() => setSelectedHero(hero.id)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{hero.name}</span>
                          <span className="text-xs">Lvl {hero.level}</span>
                        </div>
                        
                        <div className="text-xs">{hero.heroType} ({hero.lane} lane)</div>
                        
                        {!hero.alive ? (
                          <div className="text-xs text-gray-400">
                            Respawning in {Math.ceil(hero.respawnTime)}s
                          </div>
                        ) : (
                          <>
                            <div className="w-full bg-gray-700 h-1 mt-1">
                              <div 
                                className="bg-green-500 h-1"
                                style={{ width: `${(hero.health / hero.maxHealth) * 100}%` }}
                              ></div>
                            </div>
                            
                            <div className="w-full bg-gray-700 h-1 mt-1">
                              <div 
                                className="bg-blue-500 h-1"
                                style={{ width: `${(hero.mana / hero.maxMana) * 100}%` }}
                              ></div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                </div>
              </div>
               */}
              {/* <div>
                <h3 className="font-bold mb-1">Red Team Heroes</h3>
                <div className="space-y-1">
                  {game.heroes
                    .filter(h => h.team === TEAM_RED)
                    .map(hero => (
                      <div 
                        key={hero.id}
                        className={`p-2 rounded cursor-pointer ${
                          selectedHero === hero.id ? 'bg-red-700 ring-1 ring-yellow-400' : 'bg-red-800'
                        }`}
                        onClick={() => setSelectedHero(hero.id)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{hero.name}</span>
                          <span className="text-xs">Lvl {hero.level}</span>
                        </div>
                        
                        <div className="text-xs">{hero.heroType} ({hero.lane} lane)</div>
                        
                        {!hero.alive ? (
                          <div className="text-xs text-gray-400">
                            Respawning in {Math.ceil(hero.respawnTime)}s
                          </div>
                        ) : (
                          <>
                            <div className="w-full bg-gray-700 h-1 mt-1">
                              <div 
                                className="bg-green-500 h-1"
                                style={{ width: `${(hero.health / hero.maxHealth) * 100}%` }}
                              ></div>
                            </div>
                            
                            <div className="w-full bg-gray-700 h-1 mt-1">
                              <div 
                                className="bg-blue-500 h-1"
                                style={{ width: `${(hero.mana / hero.maxMana) * 100}%` }}
                              ></div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                </div>
              </div> */}
              
              {/* <div className="mt-4 text-sm text-gray-400">
                <div className="font-bold mb-1">How to play:</div>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Click on a hero to select it</li>
                  <li>Click on the map to move the selected hero</li>
                  <li>Use ability buttons to cast abilities</li>
                  <li>Destroy enemy towers and nexus to win</li>
                </ul>
              </div> */}
            {/* </>
          )}
        </div> */}
      </div>
    </div>
  );
}