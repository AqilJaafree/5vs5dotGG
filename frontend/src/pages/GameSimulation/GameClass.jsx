import { 
  TEAM_BLUE, 
  TEAM_RED, 
  TEAM_NEUTRAL, 
  MAP_WIDTH, 
  MAP_HEIGHT, 
  HERO_TYPES,
  Hero, 
  Structure, 
  JungleCamp, 
  Obstacle 
} from './GameClasses';

// Game class that manages the simulation
export class Game {
  constructor() {
    this.heroes = [];
    this.structures = [];
    this.jungleCamps = [];
    this.obstacles = [];
    this.topLanePath = [];
    this.midLanePath = [];
    this.botLanePath = [];
    this.gameTime = 0;
    this.gameState = 'active'; // active, ended
    this.winner = null;
    
    this.initializeMap();
    this.initializeGame();
  }
  
  initializeMap() {
    // Create map paths (lane waypoints)
    
    // Top lane path (blue -> red)
    this.topLanePath = [
      {x: 150, y: 200},
      {x: 300, y: 200},
      {x: 450, y: 200},
      {x: 600, y: 200},
      {x: 750, y: 200},
      {x: 900, y: 200}
    ];
    
    // Mid lane path (blue -> red)
    this.midLanePath = [
      {x: 150, y: 500},
      {x: 300, y: 500},
      {x: 500, y: 500},
      {x: 700, y: 500},
      {x: 900, y: 500}
    ];
    
    // Bottom lane path (blue -> red)
    this.botLanePath = [
      {x: 150, y: 800},
      {x: 300, y: 800},
      {x: 450, y: 800},
      {x: 600, y: 800},
      {x: 750, y: 800},
      {x: 900, y: 800}
    ];
    
    // Create obstacles (terrain)
    // Dark areas in jungle
    const jungleObstacles = [
      // Top jungle (blue side)
      {x: 250, y: 300, r: 40},
      {x: 350, y: 350, r: 35},
      {x: 300, y: 400, r: 45},
      
      // Bottom jungle (blue side)
      {x: 250, y: 700, r: 40},
      {x: 350, y: 650, r: 35},
      {x: 300, y: 600, r: 45},
      
      // Top jungle (red side)
      {x: 750, y: 300, r: 40},
      {x: 650, y: 350, r: 35},
      {x: 700, y: 400, r: 45},
      
      // Bottom jungle (red side)
      {x: 750, y: 700, r: 40},
      {x: 650, y: 650, r: 35},
      {x: 700, y: 600, r: 45},
      
      // Center area obstacles
      {x: 450, y: 450, r: 30},
      {x: 550, y: 450, r: 30},
      {x: 450, y: 550, r: 30},
      {x: 550, y: 550, r: 30},
      {x: 500, y: 500, r: 50}
    ];
    
    jungleObstacles.forEach((obstacle, index) => {
      this.obstacles.push(new Obstacle(index, obstacle.x, obstacle.y, obstacle.r));
    });
    
    // Create jungle camps
    // Blue side jungle camps
    this.jungleCamps.push(new JungleCamp(0, 250, 350)); // Top blue buff
    this.jungleCamps.push(new JungleCamp(1, 250, 650)); // Bottom blue buff
    
    // Red side jungle camps
    this.jungleCamps.push(new JungleCamp(2, 750, 350)); // Top red buff
    this.jungleCamps.push(new JungleCamp(3, 750, 650)); // Bottom red buff
    
    // Neutral camps (in river)
    this.jungleCamps.push(new JungleCamp(4, 500, 300)); // Top scuttler
    this.jungleCamps.push(new JungleCamp(5, 500, 700)); // Bottom scuttler
    
    // Center monster (like Baron/Dragon)
    this.jungleCamps.push(new JungleCamp(6, 500, 500));
  }
  
  initializeGame() {
    // Create structures
    
    // Blue side structures
    
    // Blue nexus
    this.structures.push(new Structure(0, 'nexus', TEAM_BLUE, 100, 500));
    
    // Blue inhibitors
    this.structures.push(new Structure(1, 'inhibitor', TEAM_BLUE, 200, 200)); // Top
    this.structures.push(new Structure(2, 'inhibitor', TEAM_BLUE, 200, 500)); // Mid
    this.structures.push(new Structure(3, 'inhibitor', TEAM_BLUE, 200, 800)); // Bot
    
    // Blue towers
    this.structures.push(new Structure(4, 'tower', TEAM_BLUE, 300, 200)); // Top lane
    this.structures.push(new Structure(5, 'tower', TEAM_BLUE, 300, 500)); // Mid lane
    this.structures.push(new Structure(6, 'tower', TEAM_BLUE, 300, 800)); // Bot lane
    
    // Red side structures
    
    // Red nexus
    this.structures.push(new Structure(7, 'nexus', TEAM_RED, 900, 500));
    
    // Red inhibitors
    this.structures.push(new Structure(8, 'inhibitor', TEAM_RED, 800, 200)); // Top
    this.structures.push(new Structure(9, 'inhibitor', TEAM_RED, 800, 500)); // Mid
    this.structures.push(new Structure(10, 'inhibitor', TEAM_RED, 800, 800)); // Bot
    
    // Red towers
    this.structures.push(new Structure(11, 'tower', TEAM_RED, 700, 200)); // Top lane
    this.structures.push(new Structure(12, 'tower', TEAM_RED, 700, 500)); // Mid lane
    this.structures.push(new Structure(13, 'tower', TEAM_RED, 700, 800)); // Bot lane
    
    // Create heroes - 5 per team (2 top, 1 mid, 2 bot for each team)
    
    // Blue team heroes
    const blueTeamNames = ['Astra', 'Bolt', 'Crystal', 'Drake', 'Echo'];
    const blueTeamTypes = [...HERO_TYPES].sort(() => Math.random() - 0.5);
    
    // Top lane heroes (2)
    this.heroes.push(new Hero(0, blueTeamNames[0], blueTeamTypes[0], TEAM_BLUE, 150, 200, 'top'));
    this.heroes.push(new Hero(1, blueTeamNames[1], blueTeamTypes[1], TEAM_BLUE, 180, 220, 'top'));
    
    // Mid lane hero (1)
    this.heroes.push(new Hero(2, blueTeamNames[2], blueTeamTypes[2], TEAM_BLUE, 150, 500, 'mid'));
    
    // Bot lane heroes (2)
    this.heroes.push(new Hero(3, blueTeamNames[3], blueTeamTypes[3], TEAM_BLUE, 150, 800, 'bot'));
    this.heroes.push(new Hero(4, blueTeamNames[4], blueTeamTypes[4], TEAM_BLUE, 180, 780, 'bot'));
    
    // Red team heroes
    const redTeamNames = ['Fury', 'Grim', 'Havoc', 'Inferno', 'Jinx'];
    const redTeamTypes = [...HERO_TYPES].sort(() => Math.random() - 0.5);
    
    // Top lane heroes (2)
    this.heroes.push(new Hero(5, redTeamNames[0], redTeamTypes[0], TEAM_RED, 850, 200, 'top'));
    this.heroes.push(new Hero(6, redTeamNames[1], redTeamTypes[1], TEAM_RED, 820, 220, 'top'));
    
    // Mid lane hero (1)
    this.heroes.push(new Hero(7, redTeamNames[2], redTeamTypes[2], TEAM_RED, 850, 500, 'mid'));
    
    // Bot lane heroes (2)
    this.heroes.push(new Hero(8, redTeamNames[3], redTeamTypes[3], TEAM_RED, 850, 800, 'bot'));
    this.heroes.push(new Hero(9, redTeamNames[4], redTeamTypes[4], TEAM_RED, 820, 780, 'bot'));
  }
  
  update(deltaTime) {
    if (this.gameState !== 'active') return;
    
    this.gameTime += deltaTime;
    
    // Update heroes
    this.heroes.forEach(hero => hero.update(deltaTime, this));
    
    // Update structures
    this.structures.forEach(structure => structure.update(deltaTime, this.heroes));
    
    // Update jungle camps
    this.jungleCamps.forEach(camp => camp.update(deltaTime, this.heroes));
    
    // Check win conditions
    this.checkWinConditions();
  }
  
  checkWinConditions() {
    // Check if a nexus is destroyed
    const blueNexus = this.structures.find(s => s.type === 'nexus' && s.team === TEAM_BLUE);
    const redNexus = this.structures.find(s => s.type === 'nexus' && s.team === TEAM_RED);
    
    if (blueNexus && !blueNexus.alive) {
      this.gameState = 'ended';
      this.winner = TEAM_RED;
    } else if (redNexus && !redNexus.alive) {
      this.gameState = 'ended';
      this.winner = TEAM_BLUE;
    }
  }
  
  getTeamKills(team) {
    return this.heroes.filter(hero => hero.team === team).reduce((sum, hero) => sum + hero.kills, 0);
  }
  
  getTeamDeaths(team) {
    return this.heroes.filter(hero => hero.team === team).reduce((sum, hero) => sum + hero.deaths, 0);
  }
  
  getTeamStructuresAlive(team) {
    return this.structures.filter(structure => structure.team === team && structure.alive).length;
  }
  
  getTeamHeroesAlive(team) {
    return this.heroes.filter(hero => hero.team === team && hero.alive).length;
  }
}