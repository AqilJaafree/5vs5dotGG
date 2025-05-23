import { TEAM_BLUE, TEAM_RED, TEAM_NEUTRAL, HERO_COLORS } from './GameClasses';

// Class to handle rendering the game to a canvas
export class GameRenderer {
  constructor(game, canvas) {
    this.game = game;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    this.resizeCanvas();
    
    // Images for different game objects
    this.images = {
      blueTower: null,
      redTower: null,
      blueInhibitor: null,
      redInhibitor: null,
      blueNexus: null,
      redNexus: null,
      jungleCamp: null,
      obstacle: null,
      background: null
    };
    
    // Load images
    this.loadImages();
  }
  
  resizeCanvas() {
    // Get actual dimensions of the container
    const container = this.canvas.parentElement;
    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;
  }
  
  loadImages() {
    // For this example, we'll just use basic shapes
    // In a real game, you'd load actual image assets here
  }
  
  render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Calculate scale to fit game map to canvas
    const scaleX = this.canvas.width / 1000;
    const scaleY = this.canvas.height / 1000;
    const scale = Math.min(scaleX, scaleY);
    
    // Draw background
    this.drawMap(scale);
    
    // Draw lanes
    this.drawLanes(scale);
    
    // Draw structures
    this.game.structures.forEach(structure => {
      this.drawStructure(structure, scale);
    });
    
    // Draw jungle camps
    this.game.jungleCamps.forEach(camp => {
      this.drawJungleCamp(camp, scale);
    });
    
    // Draw heroes
    this.game.heroes.forEach(hero => {
      this.drawHero(hero, scale);
    });
  }
  
  drawMap(scale) {
    // Draw map background (darker green)
    this.ctx.fillStyle = '#2D3B2D';
    this.ctx.fillRect(0, 0, 1000 * scale, 1000 * scale);
    
    // Draw obstacles
    this.game.obstacles.forEach(obstacle => {
      this.drawObstacle(obstacle, scale);
    });
    
    // Draw river (horizontal blue strip across middle)
    this.ctx.fillStyle = 'rgba(64, 164, 223, 0.5)';
    this.ctx.beginPath();
    this.ctx.moveTo(0, 450 * scale);
    this.ctx.lineTo(1000 * scale, 450 * scale);
    this.ctx.lineTo(1000 * scale, 550 * scale);
    this.ctx.lineTo(0, 550 * scale);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Draw blue base area
    this.ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
    this.ctx.beginPath();
    this.ctx.arc(100 * scale, 500 * scale, 150 * scale, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Draw red base area
    this.ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
    this.ctx.beginPath();
    this.ctx.arc(900 * scale, 500 * scale, 150 * scale, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  drawLanes(scale) {
    // Draw lanes as lighter paths
    this.ctx.fillStyle = '#3D4B3D';
    
    // Top lane
    this.ctx.beginPath();
    this.ctx.moveTo(0, 150 * scale);
    this.ctx.lineTo(1000 * scale, 150 * scale);
    this.ctx.lineTo(1000 * scale, 250 * scale);
    this.ctx.lineTo(0, 250 * scale);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Mid lane
    this.ctx.beginPath();
    this.ctx.moveTo(0, 450 * scale);
    this.ctx.lineTo(1000 * scale, 450 * scale);
    this.ctx.lineTo(1000 * scale, 550 * scale);
    this.ctx.lineTo(0, 550 * scale);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Bot lane
    this.ctx.beginPath();
    this.ctx.moveTo(0, 750 * scale);
    this.ctx.lineTo(1000 * scale, 750 * scale);
    this.ctx.lineTo(1000 * scale, 850 * scale);
    this.ctx.lineTo(0, 850 * scale);
    this.ctx.closePath();
    this.ctx.fill();
  }
  
  drawObstacle(obstacle, scale) {
    // Draw obstacle (dark terrain)
    this.ctx.fillStyle = '#1A291A';
    this.ctx.beginPath();
    this.ctx.arc(
      obstacle.x * scale, 
      obstacle.y * scale, 
      obstacle.radius * scale, 
      0, 
      Math.PI * 2
    );
    this.ctx.fill();
  }
  
  drawStructure(structure, scale) {
    if (!structure.alive) return;
    
    const x = structure.x * scale;
    const y = structure.y * scale;
    const radius = structure.radius * scale;
    
    // Base color by team
    const baseColor = structure.team === TEAM_BLUE ? '#0088FF' : '#FF3333';
    
    if (structure.type === 'tower') {
      // Draw tower as a cylinder
      this.ctx.fillStyle = baseColor;
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Tower details
      this.ctx.fillStyle = '#333';
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius * 0.7, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Tower health bar
      this.drawHealthBar(structure, x, y - radius - 10, scale);
    } 
    else if (structure.type === 'inhibitor') {
      // Draw inhibitor as a hexagon
      this.ctx.fillStyle = baseColor;
      this.ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const xPoint = x + radius * Math.cos(angle);
        const yPoint = y + radius * Math.sin(angle);
        
        if (i === 0) {
          this.ctx.moveTo(xPoint, yPoint);
        } else {
          this.ctx.lineTo(xPoint, yPoint);
        }
      }
      this.ctx.closePath();
      this.ctx.fill();
      
      // Inhibitor core
      this.ctx.fillStyle = '#FFF';
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius * 0.4, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Inhibitor health bar
      this.drawHealthBar(structure, x, y - radius - 10, scale);
    }
    else if (structure.type === 'nexus') {
      // Draw nexus as a glowing circle
      const gradient = this.ctx.createRadialGradient(
        x, y, radius * 0.2,
        x, y, radius
      );
      gradient.addColorStop(0, '#FFF');
      gradient.addColorStop(1, baseColor);
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Nexus health bar
      this.drawHealthBar(structure, x, y - radius - 10, scale);
    }
  }
  
  drawJungleCamp(camp, scale) {
    if (!camp.alive) return;
    
    const x = camp.x * scale;
    const y = camp.y * scale;
    const radius = camp.radius * scale;
    
    // Draw jungle camp as a yellow pentagon
    this.ctx.fillStyle = '#FFCC00';
    this.ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
      const xPoint = x + radius * Math.cos(angle);
      const yPoint = y + radius * Math.sin(angle);
      
      if (i === 0) {
        this.ctx.moveTo(xPoint, yPoint);
      } else {
        this.ctx.lineTo(xPoint, yPoint);
      }
    }
    this.ctx.closePath();
    this.ctx.fill();
    
    // Health bar
    this.drawHealthBar(camp, x, y - radius - 10, scale);
  }
  
  drawHero(hero, scale) {
    if (!hero.alive) return;
    
    const x = hero.x * scale;
    const y = hero.y * scale;
    const radius = hero.radius * scale;
    
    // Base color by team
    const baseColor = hero.team === TEAM_BLUE ? '#0088FF' : '#FF3333';
    
    // Draw hero body
    this.ctx.fillStyle = baseColor;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Draw hero type indicator
    this.ctx.fillStyle = HERO_COLORS[hero.heroType];
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius * 0.7, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Draw selection indicator if selected
    if (hero.isSelected) {
      this.ctx.strokeStyle = '#FFFF00';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius * 1.3, 0, Math.PI * 2);
      this.ctx.stroke();
    }
    
    // Draw hero name
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = `${10 * scale}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.fillText(hero.name, x, y - radius * 1.5);
    
    // Draw level
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = `${8 * scale}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.fillText(hero.level, x, y + radius * 0.3);
    
    // Draw health and mana bars
    this.drawHeroStatusBars(hero, x, y, scale);
  }
  
  drawHealthBar(entity, x, y, scale) {
    const width = entity.radius * 2 * scale;
    const height = 5 * scale;
    const healthPercent = entity.health / entity.maxHealth;
    
    // Background
    this.ctx.fillStyle = '#333';
    this.ctx.fillRect(x - width / 2, y, width, height);
    
    // Health
    this.ctx.fillStyle = '#4ade80';
    this.ctx.fillRect(x - width / 2, y, width * healthPercent, height);
  }
  
  drawHeroStatusBars(hero, x, y, scale) {
    const radius = hero.radius * scale;
    const width = radius * 2;
    const height = 4 * scale;
    const healthPercent = hero.health / hero.maxHealth;
    const manaPercent = hero.mana / hero.maxMana;
    
    // Health bar
    this.ctx.fillStyle = '#333';
    this.ctx.fillRect(x - width / 2, y - radius - height - 2, width, height);
    
    this.ctx.fillStyle = '#4ade80';
    this.ctx.fillRect(x - width / 2, y - radius - height - 2, width * healthPercent, height);
    
    // Mana bar
    this.ctx.fillStyle = '#333';
    this.ctx.fillRect(x - width / 2, y - radius - 2, width, height);
    
    this.ctx.fillStyle = '#3b82f6';
    this.ctx.fillRect(x - width / 2, y - radius - 2, width * manaPercent, height);
  }
}