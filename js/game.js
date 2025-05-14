/**
 * Main game logic for the climate town game
 */

// Ensure we have access to constants from other files
/* global PROJECT_STATUS, EVENT_SEVERITY, EVENT_TYPES */

// Game state
class GameState {
    constructor() {
        this.money = 1000000; // Starting funds: $1 million
        this.turn = 1; // Starting turn
        this.climateIntensity = 1.0; // Starting climate intensity (will increase over time)
        this.gameOver = false;
    }
}

// Main game class
class Game {
    constructor() {
        this.state = new GameState();
        this.projectManager = new ProjectManager(this.state);
        this.eventManager = new EventManager(this.state, this.projectManager);
        this.ui = new GameUI(this);
        
        this.initialize();
    }
    
    // Initialize the game
    initialize() {
        this.ui.initialize();
    }
    
    // Calculate tax revenue based on turn number and built projects
    calculateTaxRevenue() {
        // Base tax revenue (reduced by half as requested)
        const baseTaxRevenue = 50000;
        
        // Bonus based on number of built projects (more infrastructure = more economic activity)
        // (reduced by half as requested)
        const builtProjects = this.projectManager.getBuiltProjects();
        const projectBonus = builtProjects.length * 2500;
        
        // Penalty based on climate intensity (higher intensity = more economic disruption)
        // (reduced by half as requested)
        const intensityPenalty = Math.floor((this.state.climateIntensity - 1) * 25000);
        
        // Calculate final tax revenue
        const taxRevenue = Math.max(0, baseTaxRevenue + projectBonus - intensityPenalty);
        
        return taxRevenue;
    }
    
    // End the current turn and process events
    endTurn() {
        // Skip if game is over
        if (this.state.gameOver) return;
        
        // Calculate tax revenue
        const taxRevenue = this.calculateTaxRevenue();
        this.state.money += taxRevenue;
        
        // Log tax revenue
        this.ui.addEventToLog(`Collected $${this.ui.formatNumber(taxRevenue)} in tax revenue.`, 'success');
        
        // Calculate maintenance costs
        const maintenanceCost = this.projectManager.calculateMaintenanceCosts();
        this.state.money -= maintenanceCost;
        
        // Check if town is bankrupt
        if (this.state.money <= 0) {
            this.state.money = 0;
            this.state.gameOver = true;
            this.ui.updateStats();
            this.ui.showGameOver();
            return;
        }
        
        // Generate events for this turn
        const events = this.eventManager.generateEvents();
        
        // Apply event effects
        const eventResults = this.eventManager.applyEvents();
        
        // Log events
        events.forEach(event => {
            let messageType = 'normal';
            
            if (event.severity === EVENT_SEVERITY.MAJOR || event.severity === EVENT_SEVERITY.CATASTROPHIC) {
                messageType = 'danger';
            } else if (event.severity === EVENT_SEVERITY.MODERATE) {
                messageType = 'warning';
            } else if (event.actualDamage < 0) {
                messageType = 'success';
            }
            
            const damageText = event.actualDamage >= 0 ? 
                `-$${this.ui.formatNumber(event.actualDamage)}` : 
                `+$${this.ui.formatNumber(Math.abs(event.actualDamage))}`;
            
            this.ui.addEventToLog(`${event.name}: ${event.description} (${damageText})`, messageType);
        });
        
        // Log maintenance costs
        this.ui.addEventToLog(`Paid $${this.ui.formatNumber(maintenanceCost)} in maintenance costs.`, 'normal');
        
        // Show damage animations
        this.ui.showDamageAnimation(eventResults);
        
        // Check if town is bankrupt after events
        if (this.state.money <= 0) {
            this.state.money = 0;
            this.state.gameOver = true;
            this.ui.updateStats();
            this.ui.showGameOver();
            return;
        }
        
        // Increase climate intensity
        this.increaseClimateIntensity();
        
        // Advance to next turn
        this.state.turn++;
        
        // Update UI
        this.ui.updateStats();
        this.ui.renderProjects();
        this.ui.renderTownMap();
        
        // Show turn results
        this.ui.showTurnResults({
            events,
            taxRevenue,
            maintenanceCost,
            damagedProjects: eventResults.damagedProjects
        });
    }
    
    // Increase climate intensity based on turn number
    increaseClimateIntensity() {
        // Base increase per turn
        const baseIncrease = 0.05;
        
        // Additional increase based on turn number (accelerating change)
        const additionalIncrease = Math.min(0.01 * Math.floor(this.state.turn / 3), 0.05);
        
        // Apply increase
        this.state.climateIntensity += baseIncrease + additionalIncrease;
        
        // Cap at maximum intensity
        this.state.climateIntensity = Math.min(this.state.climateIntensity, 2.0);
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    
    // Add some CSS for project status in the town map
    const style = document.createElement('style');
    style.textContent = `
        .town-element.damaged {
            opacity: 0.7;
            border: 2px dashed red;
        }
        
        .town-element.destroyed {
            opacity: 0.3;
            animation: fadeOut 1s forwards;
        }
        
        .project-item.built {
            background-color: #e3f2fd;
        }
        
        .project-item.damaged {
            background-color: #ffebee;
        }
        
        .project-status {
            font-size: 0.8em;
            padding: 2px 5px;
            border-radius: 3px;
        }
        
        .project-status.built {
            background-color: #e8f5e9;
            color: #2e7d32;
        }
        
        .project-status.damaged {
            background-color: #ffebee;
            color: #c62828;
        }
    `;
    document.head.appendChild(style);
});
