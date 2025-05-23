// Game constants
export const TEAM_BLUE = 'blue';
export const TEAM_RED = 'red';
export const TEAM_NEUTRAL = 'neutral';
export const MAP_WIDTH = 1000;
export const MAP_HEIGHT = 1000;
export const HERO_TYPES = ['Tank', 'Fighter', 'Mage', 'Marksman', 'Support'];
export const HERO_COLORS = {
  Tank: '#FFA500',     // Orange
  Fighter: '#FFFF00',  // Yellow
  Mage: '#00FFFF',     // Cyan
  Marksman: '#00FF00', // Green
  Support: '#FF00FF'   // Magenta
};

// Base class for all game objects
export class GameObject {
  constructor(id, type, team, x, y, radius) {
    this.id = id;
    this.type = type;
    this.team = team;
    this.x = x;
    this.y = y;
    this.radius = radius || 15;
  }
  
  distanceTo(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

// Hero class
export class Hero extends GameObject {
  constructor(id, name, type, team, x, y, lane) {
    super(id, 'hero', team, x, y, 15);
    this.name = name;
    this.heroType = type;
    this.lane = lane; // top, mid, bot
    this.level = 1;
    this.maxHealth = this.getMaxHealth();
    this.health = this.maxHealth;
    this.maxMana = this.getMaxMana();
    this.mana = this.maxMana;
    this.attackDamage = this.getAttackDamage();
    this.abilityPower = this.getAbilityPower();
    this.armor = this.getArmor();
    this.moveSpeed = this.getMoveSpeed();
    this.attackRange = this.getAttackRange();
    this.alive = true;
    this.respawnTime = 0;
    this.kills = 0;
    this.deaths = 0;
    this.assists = 0;
    this.cooldowns = {
      ability1: 0,
      ability2: 0,
      ability3: 0,
      ultimate: 0
    };
    this.targetX = x;
    this.targetY = y;
    this.pathIndex = 0;
    this.isSelected = false;
  }
  
  getMaxHealth() {
    const baseHealth = {
      Tank: 1000,
      Fighter: 800,
      Mage: 550,
      Marksman: 600,
      Support: 650
    };
    return baseHealth[this.heroType] + (this.level - 1) * 100;
  }
  
  getMaxMana() {
    const baseMana = {
      Tank: 400,
      Fighter: 300,
      Mage: 800,
      Marksman: 400,
      Support: 700
    };
    return baseMana[this.heroType] + (this.level - 1) * 50;
  }
  
  getAttackDamage() {
    const baseAD = {
      Tank: 60,
      Fighter: 80,
      Mage: 50,
      Marksman: 85,
      Support: 40
    };
    return baseAD[this.heroType] + (this.level - 1) * 5;
  }
  
  getAbilityPower() {
    const baseAP = {
      Tank: 40,
      Fighter: 50,
      Mage: 90,
      Marksman: 30,
      Support: 70
    };
    return baseAP[this.heroType] + (this.level - 1) * 7;
  }
  
  getArmor() {
    const baseArmor = {
      Tank: 50,
      Fighter: 40,
      Mage: 20,
      Marksman: 25,
      Support: 30
    };
    return baseArmor[this.heroType] + (this.level - 1) * 3;
  }
  
  getMoveSpeed() {
    const baseSpeed = {
      Tank: 2.0,
      Fighter: 2.5,
      Mage: 2.0,
      Marksman: 2.5,
      Support: 2.2
    };
    return baseSpeed[this.heroType];
  }
  
  getAttackRange() {
    const baseRange = {
      Tank: 100,
      Fighter: 100,
      Mage: 450,
      Marksman: 500,
      Support: 350
    };
    return baseRange[this.heroType];
  }
  
  update(deltaTime, game) {
    if (!this.alive) {
      this.respawnTime -= deltaTime;
      if (this.respawnTime <= 0) {
        this.respawn(game);
      }
      return;
    }
    
    // Move towards target
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 5) {
      // Check for collisions with terrain obstacles
      const newX = this.x + (dx / distance) * this.moveSpeed * deltaTime;
      const newY = this.y + (dy / distance) * this.moveSpeed * deltaTime;
      
      // Simple collision check with obstacles
      let collision = false;
      
      for (const obstacle of game.obstacles) {
        const obstacleDistance = Math.sqrt(
          Math.pow(newX - obstacle.x, 2) + 
          Math.pow(newY - obstacle.y, 2)
        );
        
        if (obstacleDistance < this.radius + obstacle.radius) {
          collision = true;
          break;
        }
      }
      
      if (!collision) {
        this.x = newX;
        this.y = newY;
      } else {
        // Try to navigate around obstacle by adjusting target
        this.findNewPath(game);
      }
    } else if (!this.isSelected) {
      // AI movement along lanes when destination is reached
      this.aiMovement(game);
    }
    
    // Update cooldowns
    for (const ability in this.cooldowns) {
      if (this.cooldowns[ability] > 0) {
        this.cooldowns[ability] -= deltaTime;
        if (this.cooldowns[ability] < 0) this.cooldowns[ability] = 0;
      }
    }
    
    // Regenerate health and mana
    this.health = Math.min(this.health + 0.5 * deltaTime, this.maxHealth);
    this.mana = Math.min(this.mana + 1 * deltaTime, this.maxMana);
    
    // Attack enemies in range
    this.attackNearbyEnemies(game, deltaTime);
  }
  
  findNewPath(game) {
    // Simple path finding by adjusting target slightly
    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * 50;
    
    this.targetX = this.x + Math.cos(angle) * distance;
    this.targetY = this.y + Math.sin(angle) * distance;
    
    // Ensure within map bounds
    this.targetX = Math.max(20, Math.min(MAP_WIDTH - 20, this.targetX));
    this.targetY = Math.max(20, Math.min(MAP_HEIGHT - 20, this.targetY));
  }
  
  aiMovement(game) {
    // AI movement along lanes
    if (this.team === TEAM_BLUE) {
      let lanePoints = [];
      
      // Choose path based on lane
      if (this.lane === 'top') {
        lanePoints = game.topLanePath;
      } else if (this.lane === 'mid') {
        lanePoints = game.midLanePath;
      } else if (this.lane === 'bot') {
        lanePoints = game.botLanePath;
      }
      
      // Move to next point in path
      if (lanePoints.length > 0) {
        if (this.pathIndex < lanePoints.length) {
          const nextPoint = lanePoints[this.pathIndex];
          this.setTarget(nextPoint.x, nextPoint.y);
          
          // If reached point, move to next
          if (this.distanceTo(nextPoint) < 20) {
            this.pathIndex++;
          }
        } else {
          // Target enemy nexus when path complete
          const enemyNexus = game.structures.find(s => s.type === 'nexus' && s.team !== this.team);
          if (enemyNexus) {
            this.setTarget(enemyNexus.x, enemyNexus.y);
          }
        }
      }
    } else if (this.team === TEAM_RED) {
      let lanePoints = [];
      
      // Choose path based on lane
      if (this.lane === 'top') {
        lanePoints = [...game.topLanePath].reverse();
      } else if (this.lane === 'mid') {
        lanePoints = [...game.midLanePath].reverse();
      } else if (this.lane === 'bot') {
        lanePoints = [...game.botLanePath].reverse();
      }
      
      // Move to next point in path
      if (lanePoints.length > 0) {
        if (this.pathIndex < lanePoints.length) {
          const nextPoint = lanePoints[this.pathIndex];
          this.setTarget(nextPoint.x, nextPoint.y);
          
          // If reached point, move to next
          if (this.distanceTo(nextPoint) < 20) {
            this.pathIndex++;
          }
        } else {
          // Target enemy nexus when path complete
          const enemyNexus = game.structures.find(s => s.type === 'nexus' && s.team !== this.team);
          if (enemyNexus) {
            this.setTarget(enemyNexus.x, enemyNexus.y);
          }
        }
      }
    }
  }
  
  attackNearbyEnemies(game, deltaTime) {
    // Find enemy heroes in attack range
    const enemyHeroes = game.heroes.filter(hero => 
      hero.team !== this.team && 
      hero.alive && 
      this.distanceTo(hero) <= this.attackRange
    );
    
    // Find enemy structures in attack range
    const enemyStructures = game.structures.filter(structure => 
      structure.team !== this.team && 
      structure.alive && 
      this.distanceTo(structure) <= this.attackRange
    );
    
    // Attack enemy hero if available
    if (enemyHeroes.length > 0) {
      // Attack closest enemy
      const target = enemyHeroes.reduce((closest, hero) => 
        this.distanceTo(hero) < this.distanceTo(closest) ? hero : closest, 
        enemyHeroes[0]
      );
      
      target.takeDamage(this.attackDamage * deltaTime, this);
      
      // Use abilities when possible
      if (Math.random() < 0.01 * deltaTime) {
        const abilities = ['ability1', 'ability2', 'ability3', 'ultimate'];
        const randomAbility = abilities[Math.floor(Math.random() * abilities.length)];
        
        this.useAbility(randomAbility, game.heroes);
      }
    } 
    // Otherwise attack structures
    else if (enemyStructures.length > 0) {
      const target = enemyStructures.reduce((closest, structure) => 
        this.distanceTo(structure) < this.distanceTo(closest) ? structure : closest, 
        enemyStructures[0]
      );
      
      target.takeDamage(this.attackDamage * 0.5 * deltaTime, this);
    }
  }
  
  takeDamage(amount, attacker) {
    if (!this.alive) return 0;
    
    // Apply damage reduction from armor
    const reducedDamage = amount * (100 / (100 + this.armor));
    this.health -= reducedDamage;
    
    if (this.health <= 0) {
      this.die(attacker);
    }
    
    return reducedDamage;
  }
  
  die(killer) {
    this.alive = false;
    this.health = 0;
    this.deaths++;
    
    if (killer) {
      killer.kills++;
    }
    
    // Respawn time increases with level
    this.respawnTime = 5 + this.level * 2;
  }
  
  respawn(game) {
    this.alive = true;
    this.health = this.maxHealth;
    this.mana = this.maxMana;
    this.pathIndex = 0;
    
    // Respawn at base
    if (this.team === TEAM_BLUE) {
      const blueBase = game.structures.find(s => s.type === 'nexus' && s.team === TEAM_BLUE);
      if (blueBase) {
        this.x = blueBase.x + (Math.random() - 0.5) * 100;
        this.y = blueBase.y + (Math.random() - 0.5) * 100;
      } else {
        this.x = 100;
        this.y = MAP_HEIGHT / 2;
      }
    } else {
      const redBase = game.structures.find(s => s.type === 'nexus' && s.team === TEAM_RED);
      if (redBase) {
        this.x = redBase.x + (Math.random() - 0.5) * 100;
        this.y = redBase.y + (Math.random() - 0.5) * 100;
      } else {
        this.x = MAP_WIDTH - 100;
        this.y = MAP_HEIGHT / 2;
      }
    }
    
    this.targetX = this.x;
    this.targetY = this.y;
  }
  
  useAbility(abilityName, targets) {
    if (!this.alive || this.cooldowns[abilityName] > 0) return false;
    
    let manaCost = 0;
    let cooldown = 0;
    let damage = 0;
    let healing = 0;
    let range = 0;
    
    switch(abilityName) {
      case 'ability1':
        manaCost = 50;
        cooldown = 8;
        range = 300;
        
        if (this.heroType === 'Tank') {
          damage = 40 + this.armor * 0.5;
        } else if (this.heroType === 'Fighter') {
          damage = 80 + this.attackDamage * 0.6;
        } else if (this.heroType === 'Mage') {
          damage = 100 + this.abilityPower * 0.7;
        } else if (this.heroType === 'Marksman') {
          damage = 90 + this.attackDamage * 0.8;
        } else if (this.heroType === 'Support') {
          healing = 80 + this.abilityPower * 0.6;
        }
        break;
        
      case 'ability2':
        manaCost = 70;
        cooldown = 12;
        range = 250;
        
        if (this.heroType === 'Tank') {
          // Shield Wall - increase armor temporarily
          this.armor += 20;
          setTimeout(() => { this.armor -= 20; }, 5000);
          return true;
        } else if (this.heroType === 'Fighter') {
          damage = 120 + this.attackDamage * 0.5;
        } else if (this.heroType === 'Mage') {
          damage = 80 + this.abilityPower * 0.6;
        } else if (this.heroType === 'Marksman') {
          damage = 60 + this.attackDamage * 0.4;
        } else if (this.heroType === 'Support') {
          healing = 60 + this.abilityPower * 0.5;
        }
        break;
        
      case 'ability3':
        manaCost = 90;
        cooldown = 15;
        range = 400;
        
        if (this.heroType === 'Tank') {
          damage = 100 + this.armor * 0.4 + this.attackDamage * 0.3;
        } else if (this.heroType === 'Fighter') {
          damage = 150 + this.attackDamage * 0.7;
        } else if (this.heroType === 'Mage') {
          damage = 130 + this.abilityPower * 0.9;
        } else if (this.heroType === 'Marksman') {
          damage = 110 + this.attackDamage * 0.6;
        } else if (this.heroType === 'Support') {
          healing = 100 + this.abilityPower * 0.7;
        }
        break;
        
      case 'ultimate':
        manaCost = 150;
        cooldown = 60;
        range = 500;
        
        if (this.heroType === 'Tank') {
          // Unstoppable - temporary armor boost
          this.armor += 50;
          setTimeout(() => { this.armor -= 50; }, 8000);
          return true;
        } else if (this.heroType === 'Fighter') {
          damage = 250 + this.attackDamage * 1.2;
        } else if (this.heroType === 'Mage') {
          damage = 300 + this.abilityPower * 1.5;
        } else if (this.heroType === 'Marksman') {
          damage = 220 + this.attackDamage * 1.0;
        } else if (this.heroType === 'Support') {
          healing = 200 + this.abilityPower * 1.0;
        }
        break;
    }
    
    if (this.mana < manaCost) return false;
    
    this.mana -= manaCost;
    this.cooldowns[abilityName] = cooldown;
    
    // Filter targets by range
    const inRangeTargets = targets.filter(target => {
      const dx = target.x - this.x;
      const dy = target.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance <= range;
    });
    
    // Apply effects to targets
    if (inRangeTargets.length > 0) {
      inRangeTargets.forEach(target => {
        if (damage > 0 && target.team !== this.team) {
          target.takeDamage(damage, this);
        }
        
        if (healing > 0 && target.team === this.team) {
          target.health = Math.min(target.health + healing, target.maxHealth);
        }
      });
    }
    
    return true;
  }
  
  setTarget(x, y) {
    this.targetX = x;
    this.targetY = y;
  }
}

// Structure class (towers, inhibitors, nexus)
export class Structure extends GameObject {
  constructor(id, type, team, x, y) {
    const radius = type === 'tower' ? 25 : type === 'inhibitor' ? 35 : 50;
    super(id, type, team, x, y, radius);
    this.alive = true;
    
    switch(type) {
      case 'tower':
        this.maxHealth = 2000;
        this.health = 2000;
        this.attackDamage = 150;
        this.attackRange = 300;
        this.attackSpeed = 1; // attacks per second
        this.lastAttackTime = 0;
        break;
      case 'inhibitor':
        this.maxHealth = 1500;
        this.health = 1500;
        this.attackDamage = 0;
        this.attackRange = 0;
        break;
      case 'nexus':
        this.maxHealth = 3000;
        this.health = 3000;
        this.attackDamage = 0;
        this.attackRange = 0;
        break;
    }
  }
  
  update(deltaTime, heroes) {
    if (!this.alive) return;
    
    // Towers attack nearby enemy heroes
    if (this.type === 'tower' && this.attackDamage > 0) {
      this.lastAttackTime += deltaTime;
      
      if (this.lastAttackTime >= 1) {
        // Find enemy heroes in range
        const enemyHeroes = heroes.filter(hero => 
          hero.team !== this.team && 
          hero.alive && 
          this.distanceTo(hero) <= this.attackRange
        );
        
        if (enemyHeroes.length > 0) {
          // Attack closest enemy
          const target = enemyHeroes.reduce((closest, hero) => 
            this.distanceTo(hero) < this.distanceTo(closest) ? hero : closest, 
            enemyHeroes[0]
          );
          
          target.takeDamage(this.attackDamage, null);
          this.lastAttackTime = 0;
        }
      }
    }
  }
  
  takeDamage(amount) {
    if (!this.alive) return 0;
    
    this.health -= amount;
    
    if (this.health <= 0) {
      this.die();
    }
    
    return amount;
  }
  
  die() {
    this.alive = false;
    this.health = 0;
  }
}

// Jungle Camp class
export class JungleCamp extends GameObject {
  constructor(id, x, y) {
    super(id, 'jungle_camp', TEAM_NEUTRAL, x, y, 30);
    this.maxHealth = 800;
    this.health = 800;
    this.attackDamage = 50;
    this.respawnTime = 0;
    this.alive = true;
  }
  
  update(deltaTime, heroes) {
    if (!this.alive) {
      this.respawnTime -= deltaTime;
      if (this.respawnTime <= 0) {
        this.respawn();
      }
      return;
    }
    
    // Attack nearby heroes
    const nearbyHeroes = heroes.filter(hero => 
      hero.alive && 
      this.distanceTo(hero) < 150
    );
    
    if (nearbyHeroes.length > 0) {
      // Attack closest hero
      const target = nearbyHeroes.reduce((closest, hero) => 
        this.distanceTo(hero) < this.distanceTo(closest) ? hero : closest, 
        nearbyHeroes[0]
      );
      
      target.takeDamage(this.attackDamage * deltaTime * 0.2, null);
    }
  }
  
  takeDamage(amount, attacker) {
    if (!this.alive) return 0;
    
    this.health -= amount;
    
    if (this.health <= 0) {
      this.die(attacker);
    }
    
    return amount;
  }
  
  die(killer) {
    this.alive = false;
    this.health = 0;
    this.respawnTime = 60; // 1 minute respawn
    
    // Grant XP to killer
    if (killer) {
      killer.experience += 100;
      
      // Check for level up
      const expNeeded = killer.level * 200;
      if (killer.experience >= expNeeded) {
        killer.level++;
        killer.experience = 0;
        killer.maxHealth = killer.getMaxHealth();
        killer.maxMana = killer.getMaxMana();
        killer.attackDamage = killer.getAttackDamage();
        killer.abilityPower = killer.getAbilityPower();
        killer.armor = killer.getArmor();
      }
    }
  }
  
  respawn() {
    this.alive = true;
    this.health = this.maxHealth;
  }
}

// Obstacle class for terrain
export class Obstacle extends GameObject {
  constructor(id, x, y, radius) {
    super(id, 'obstacle', TEAM_NEUTRAL, x, y, radius || 30);
  }
}