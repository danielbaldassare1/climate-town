/**
 * User interface handling for the climate town game
 */

// Ensure we have access to constants from other files
// These will be defined in the projects.js file which is loaded before this file
/* global PROJECT_CATEGORIES, PROJECT_STATUS, EVENT_SEVERITY */

class GameUI {
    constructor(game) {
        this.game = game;
        this.selectedProject = null;
        this.townElements = [];
        
        // DOM elements
        this.moneyDisplay = document.getElementById('money');
        this.turnDisplay = document.getElementById('turn');
        this.intensityDisplay = document.getElementById('intensity');
        this.projectsList = document.getElementById('projects-list');
        this.eventsLog = document.getElementById('events-log');
        this.townMap = document.getElementById('town-map');
        this.endTurnBtn = document.getElementById('end-turn-btn');
        this.modal = document.getElementById('game-modal');
        this.modalTitle = document.getElementById('modal-title');
        this.modalMessage = document.getElementById('modal-message');
        this.modalCloseBtn = document.getElementById('modal-close-btn');
        
        this.initEventListeners();
    }
    
    // Initialize event listeners
    initEventListeners() {
        // End turn button
        this.endTurnBtn.addEventListener('click', () => {
            this.game.endTurn();
        });
        
        // Modal close button
        this.modalCloseBtn.addEventListener('click', () => {
            this.hideModal();
        });
    }
    
    // Update the game stats display
    updateStats() {
        this.moneyDisplay.textContent = `$${this.formatNumber(this.game.state.money)}`;
        this.turnDisplay.textContent = this.game.state.turn;
        
        // Update climate intensity display
        const intensity = this.game.state.climateIntensity;
        let intensityText = '';
        let intensityClass = '';
        
        if (intensity < 1.2) {
            intensityText = 'Low';
            intensityClass = 'normal';
        } else if (intensity < 1.5) {
            intensityText = 'Moderate';
            intensityClass = 'normal';
        } else if (intensity < 1.8) {
            intensityText = 'High';
            intensityClass = 'warning';
        } else {
            intensityText = 'Extreme';
            intensityClass = 'danger';
        }
        
        this.intensityDisplay.textContent = intensityText;
        this.intensityDisplay.className = `stat-value ${intensityClass}`;
    }
    
    // Format number with commas
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    // Render available projects
    renderProjects() {
        // Clear current projects
        this.projectsList.innerHTML = '';
        
        // Get available projects
        const availableProjects = this.game.projectManager.getAvailableProjects();
        const builtProjects = this.game.projectManager.getBuiltProjects();
        
        // Combine and sort projects
        const allProjects = [...builtProjects, ...availableProjects.filter(p => !p.built)];
        allProjects.sort((a, b) => {
            // Sort by built status first, then by category
            if (a.built && !b.built) return -1;
            if (!a.built && b.built) return 1;
            return a.category.localeCompare(b.category);
        });
        
        // Create project elements
        allProjects.forEach(project => {
            const projectElement = document.createElement('div');
            projectElement.className = `project-item ${project.built ? 'built' : ''} ${project.status === PROJECT_STATUS.DAMAGED ? 'damaged' : ''}`;
            projectElement.dataset.id = project.id;
            
            let statusText = '';
            if (project.built) {
                if (project.status === PROJECT_STATUS.DAMAGED) {
                    statusText = `<span class="project-status damaged">Damaged (${project.health}%)</span>`;
                } else {
                    statusText = `<span class="project-status built">Built</span>`;
                }
            }
            
            projectElement.innerHTML = `
                <div class="project-header">
                    <span class="project-name">${project.name}</span>
                    <span class="project-cost">${project.built ? statusText : `$${this.formatNumber(project.cost)}`}</span>
                </div>
                <div class="project-description">${project.description}</div>
                <div class="project-details">
                    ${!project.built ? `<button class="btn build-btn" data-id="${project.id}">Build</button>` : 
                      (project.status === PROJECT_STATUS.DAMAGED ? `<button class="btn repair-btn" data-id="${project.id}">Repair</button>` : '')}
                </div>
            `;
            
            this.projectsList.appendChild(projectElement);
            
            // Add event listeners to buttons
            const buildBtn = projectElement.querySelector('.build-btn');
            if (buildBtn) {
                buildBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.buildProject(project.id);
                });
            }
            
            const repairBtn = projectElement.querySelector('.repair-btn');
            if (repairBtn) {
                repairBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.repairProject(project.id);
                });
            }
        });
        
        // If no projects available
        if (allProjects.length === 0) {
            this.projectsList.innerHTML = '<div class="no-projects">No projects available yet.</div>';
        }
    }
    
    // Build a project
    buildProject(projectId) {
        const project = this.game.projectManager.projects.find(p => p.id === projectId);
        
        if (!project) return;
        
        if (project.cost > this.game.state.money) {
            this.showMessage('Insufficient Funds', `You don't have enough money to build ${project.name}.`);
            return;
        }
        
        const success = this.game.projectManager.buildProject(projectId);
        
        if (success) {
            this.addEventToLog(`Built ${project.name} for $${this.formatNumber(project.cost)}.`, 'success');
            this.updateStats();
            this.renderProjects();
            this.renderTownMap();
        }
    }
    
    // Repair a project
    repairProject(projectId) {
        const project = this.game.projectManager.projects.find(p => p.id === projectId);
        
        if (!project) return;
        
        const repairCost = Math.ceil((project.damage / 100) * project.cost * 0.6);
        
        if (repairCost > this.game.state.money) {
            this.showMessage('Insufficient Funds', `You don't have enough money to repair ${project.name}.`);
            return;
        }
        
        const result = this.game.projectManager.repairProject(projectId);
        
        if (result) {
            this.addEventToLog(`Repaired ${result.projectName} for $${this.formatNumber(result.repairCost)}.`, 'success');
            this.updateStats();
            this.renderProjects();
            this.renderTownMap();
        }
    }
    
    // Add an event to the log
    addEventToLog(message, type = 'normal') {
        const eventElement = document.createElement('div');
        eventElement.className = `event-item ${type}`;
        eventElement.textContent = message;
        
        this.eventsLog.prepend(eventElement);
        
        // Limit log size
        if (this.eventsLog.children.length > 50) {
            this.eventsLog.removeChild(this.eventsLog.lastChild);
        }
    }
    
    // Render the town map with projects
    renderTownMap() {
        // Clear current elements
        this.townMap.innerHTML = '';
        
        // Add ocean background
        const oceanElement = document.createElement('div');
        oceanElement.className = 'town-element town-ocean';
        oceanElement.style.width = '100%';
        oceanElement.style.height = '100%';
        oceanElement.style.bottom = '0';
        oceanElement.style.left = '0';
        oceanElement.style.backgroundColor = '#1565C0'; // Deep blue for ocean
        oceanElement.style.zIndex = '1';
        this.townMap.appendChild(oceanElement);
        
        // Add town base elements (land, water, etc.)
        const landElement = document.createElement('div');
        landElement.className = 'town-element town-land';
        landElement.style.width = '100%';
        landElement.style.height = '60%';
        landElement.style.bottom = '0';
        landElement.style.left = '0';
        landElement.style.backgroundColor = '#8D6E63'; // Brown for land
        landElement.style.zIndex = '2';
        landElement.style.borderTopLeftRadius = '20px';
        landElement.style.borderTopRightRadius = '20px';
        landElement.style.boxShadow = '0 -2px 10px rgba(0,0,0,0.3)';
        this.townMap.appendChild(landElement);
        
        // Add beach area
        const beachElement = document.createElement('div');
        beachElement.className = 'town-element town-beach';
        beachElement.style.width = '100%';
        beachElement.style.height = '10px';
        beachElement.style.bottom = '60%';
        beachElement.style.left = '0';
        beachElement.style.backgroundColor = '#E0C088'; // Sand color
        beachElement.style.zIndex = '3';
        this.townMap.appendChild(beachElement);
        
        // Add some town buildings in the background
        for (let i = 0; i < 8; i++) {
            const buildingElement = document.createElement('div');
            buildingElement.className = 'town-element town-building';
            
            // Randomize building properties
            const width = 15 + Math.random() * 25;
            const height = 20 + Math.random() * 40;
            const left = 20 + (i * 35) + (Math.random() * 10);
            
            buildingElement.style.width = `${width}px`;
            buildingElement.style.height = `${height}px`;
            buildingElement.style.bottom = '60%';
            buildingElement.style.left = `${left}px`;
            buildingElement.style.backgroundColor = `rgba(${100 + Math.random() * 155}, ${100 + Math.random() * 155}, ${100 + Math.random() * 155}, 0.8)`;
            buildingElement.style.zIndex = '3';
            buildingElement.style.borderRadius = '2px';
            buildingElement.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';
            
            this.townMap.appendChild(buildingElement);
        }
        
        // Render built projects
        const builtProjects = this.game.projectManager.getBuiltProjects();
        
        builtProjects.forEach(project => {
            const projectElement = document.createElement('div');
            projectElement.className = `town-element project-${project.id} ${project.status.toLowerCase()}`;
            projectElement.style.width = `${project.position.width}px`;
            projectElement.style.height = `${project.position.height}px`;
            projectElement.style.left = `${project.position.x}px`;
            projectElement.style.top = `${project.position.y}px`;
            
            // Use background color and icon based on project category
            let bgColor, icon;
            switch (project.category) {
                case PROJECT_CATEGORIES.COASTAL:
                    bgColor = 'rgba(33, 150, 243, 0.8)'; // Blue with transparency
                    icon = '🌊'; // Wave emoji for coastal projects
                    break;
                case PROJECT_CATEGORIES.INFRASTRUCTURE:
                    bgColor = 'rgba(96, 125, 139, 0.8)'; // Blue-gray with transparency
                    icon = '🏗️'; // Construction emoji for infrastructure
                    break;
                case PROJECT_CATEGORIES.COMMUNITY:
                    bgColor = 'rgba(76, 175, 80, 0.8)'; // Green with transparency
                    icon = '🏘️'; // Houses emoji for community
                    break;
                case PROJECT_CATEGORIES.EMERGENCY:
                    bgColor = 'rgba(244, 67, 54, 0.8)'; // Red with transparency
                    icon = '🚨'; // Alert emoji for emergency
                    break;
                default:
                    bgColor = 'rgba(158, 158, 158, 0.8)'; // Gray with transparency
                    icon = '🏢'; // Building emoji as default
            }
            
            projectElement.style.backgroundColor = bgColor;
            projectElement.style.borderRadius = '4px';
            projectElement.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
            projectElement.style.zIndex = '5';
            projectElement.style.display = 'flex';
            projectElement.style.justifyContent = 'center';
            projectElement.style.alignItems = 'center';
            projectElement.style.fontSize = `${Math.min(project.position.width, project.position.height) * 0.5}px`;
            projectElement.style.transition = 'all 0.3s ease';
            
            // Add title for hover
            projectElement.title = `${project.name} (Health: ${project.health}%)`;
            
            // Add icon and status indicator
            if (project.status === PROJECT_STATUS.DAMAGED) {
                projectElement.innerHTML = `
                    <div style="position: relative; text-align: center;">
                        <div style="font-size: 0.8em; opacity: 0.8;">${icon}</div>
                        <div class="damage-indicator" style="position: absolute; top: 100%; left: 50%; transform: translateX(-50%); 
                             background-color: rgba(255,0,0,0.7); color: white; border-radius: 10px; padding: 2px 5px; 
                             font-size: 10px; white-space: nowrap;">${project.health}%</div>
                    </div>
                `;
                projectElement.style.filter = 'grayscale(50%)';
                projectElement.style.opacity = '0.8';
            } else {
                projectElement.innerHTML = `<div>${icon}</div>`;
            }
            
            this.townMap.appendChild(projectElement);
        });
    }
    
    // Show damage animation on the town map
    showDamageAnimation(eventResults) {
        if (!eventResults || !eventResults.damagedProjects) return;
        
        // Create a flash effect for the whole map to indicate damage
        const flashOverlay = document.createElement('div');
        flashOverlay.style.position = 'absolute';
        flashOverlay.style.top = '0';
        flashOverlay.style.left = '0';
        flashOverlay.style.width = '100%';
        flashOverlay.style.height = '100%';
        flashOverlay.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
        flashOverlay.style.zIndex = '100';
        flashOverlay.style.pointerEvents = 'none';
        flashOverlay.style.animation = 'flash-damage 0.5s ease-out';
        
        // Add keyframes for the flash animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes flash-damage {
                0% { opacity: 0; }
                50% { opacity: 1; }
                100% { opacity: 0; }
            }
            
            @keyframes float-up {
                0% { transform: translateY(0); opacity: 1; }
                100% { transform: translateY(-50px); opacity: 0; }
            }
            
            @keyframes shake {
                0% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                50% { transform: translateX(5px); }
                75% { transform: translateX(-5px); }
                100% { transform: translateX(0); }
            }
        `;
        document.head.appendChild(style);
        this.townMap.appendChild(flashOverlay);
        
        // Remove flash after animation completes
        setTimeout(() => {
            if (flashOverlay.parentNode) {
                flashOverlay.parentNode.removeChild(flashOverlay);
            }
        }, 500);
        
        eventResults.damagedProjects.forEach(result => {
            const project = this.game.projectManager.projects.find(p => p.name === result.projectName);
            
            if (!project) return;
            
            // Find the project element
            const projectElement = document.querySelector(`.project-${project.id}`);
            
            if (!projectElement) return;
            
            // Apply shake animation to the damaged project
            projectElement.style.animation = 'shake 0.5s ease-in-out';
            
            // Create damage indicator with improved styling
            const damageIndicator = document.createElement('div');
            damageIndicator.className = 'damage-indicator';
            damageIndicator.textContent = `-${result.damage}`;
            damageIndicator.style.position = 'absolute';
            damageIndicator.style.left = `${project.position.x + project.position.width / 2}px`;
            damageIndicator.style.top = `${project.position.y}px`;
            damageIndicator.style.color = 'red';
            damageIndicator.style.fontWeight = 'bold';
            damageIndicator.style.fontSize = '16px';
            damageIndicator.style.textShadow = '0 0 3px white';
            damageIndicator.style.zIndex = '101';
            damageIndicator.style.animation = 'float-up 2s ease-out forwards';
            
            this.townMap.appendChild(damageIndicator);
            
            // Remove after animation completes
            setTimeout(() => {
                if (damageIndicator.parentNode) {
                    damageIndicator.parentNode.removeChild(damageIndicator);
                }
                projectElement.style.animation = '';
            }, 2000);
            
            // Update project element appearance
            if (result.destroyed) {
                // Create explosion effect
                const explosion = document.createElement('div');
                explosion.style.position = 'absolute';
                explosion.style.left = `${project.position.x}px`;
                explosion.style.top = `${project.position.y}px`;
                explosion.style.width = `${project.position.width}px`;
                explosion.style.height = `${project.position.height}px`;
                explosion.style.backgroundColor = 'rgba(255, 100, 0, 0.7)';
                explosion.style.borderRadius = '50%';
                explosion.style.zIndex = '99';
                explosion.style.transform = 'scale(0.1)';
                explosion.style.transition = 'all 0.5s ease-out';
                
                this.townMap.appendChild(explosion);
                
                // Animate explosion
                setTimeout(() => {
                    explosion.style.transform = 'scale(2)';
                    explosion.style.opacity = '0';
                }, 10);
                
                // Remove explosion and project element
                setTimeout(() => {
                    if (explosion.parentNode) {
                        explosion.parentNode.removeChild(explosion);
                    }
                    if (projectElement.parentNode) {
                        projectElement.parentNode.removeChild(projectElement);
                    }
                }, 500);
            } else {
                // Update damaged project appearance
                projectElement.classList.add('damaged');
                projectElement.style.filter = 'grayscale(50%)';
                projectElement.style.opacity = '0.8';
                projectElement.style.boxShadow = '0 0 8px rgba(255,0,0,0.5)';
                
                // Get the appropriate icon based on project category
                let icon;
                switch (project.category) {
                    case PROJECT_CATEGORIES.COASTAL:
                        icon = '🌊';
                        break;
                    case PROJECT_CATEGORIES.INFRASTRUCTURE:
                        icon = '🏗️';
                        break;
                    case PROJECT_CATEGORIES.COMMUNITY:
                        icon = '🏘️';
                        break;
                    case PROJECT_CATEGORIES.EMERGENCY:
                        icon = '🚨';
                        break;
                    default:
                        icon = '🏢';
                }
                
                projectElement.innerHTML = `
                    <div style="position: relative; text-align: center;">
                        <div style="font-size: 0.8em; opacity: 0.8;">${icon}</div>
                        <div class="damage-indicator" style="position: absolute; top: 100%; left: 50%; transform: translateX(-50%); 
                             background-color: rgba(255,0,0,0.7); color: white; border-radius: 10px; padding: 2px 5px; 
                             font-size: 10px; white-space: nowrap;">${result.newHealth}%</div>
                    </div>
                `;
            }
        });
    }
    
    // Show a modal message
    showMessage(title, message) {
        this.modalTitle.textContent = title;
        this.modalMessage.textContent = message;
        this.modal.classList.add('active');
    }
    
    // Hide the modal
    hideModal() {
        this.modal.classList.remove('active');
    }
    
    // Show weather effects based on event type
    showWeatherEffect(eventType) {
        // Remove any existing weather effects
        const existingEffects = document.querySelectorAll('.weather-effect');
        existingEffects.forEach(effect => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        });
        
        // Create new weather effect element
        const weatherEffect = document.createElement('div');
        weatherEffect.className = 'weather-effect';
        
        // Set effect type based on event
        switch (eventType) {
            case EVENT_TYPES.FLOODING:
            case EVENT_TYPES.STORM:
                weatherEffect.classList.add('rain');
                break;
            case EVENT_TYPES.HEATWAVE:
                weatherEffect.classList.add('heat');
                break;
            default:
                return; // No effect for other event types
        }
        
        // Add to town map
        this.townMap.appendChild(weatherEffect);
        
        // Activate the effect (for transition)
        setTimeout(() => {
            weatherEffect.classList.add('active');
        }, 10);
        
        // Remove after a delay
        setTimeout(() => {
            weatherEffect.classList.remove('active');
            setTimeout(() => {
                if (weatherEffect.parentNode) {
                    weatherEffect.parentNode.removeChild(weatherEffect);
                }
            }, 1000);
        }, 5000);
    }
    
    // Show turn results
    showTurnResults(results) {
        let message = '';
        
        // Add tax revenue information
        message += `Tax revenue collected: $${this.formatNumber(results.taxRevenue)}\n\n`;
        
        // Add events information
        if (results.events.length > 0) {
            message += 'The following events occurred:\n\n';
            
            results.events.forEach(event => {
                const damageText = event.actualDamage >= 0 ? 
                    `Cost: $${this.formatNumber(event.actualDamage)}` : 
                    `Gained: $${this.formatNumber(Math.abs(event.actualDamage))}`;
                
                message += `• ${event.name}: ${event.description} (${damageText})\n`;
                
                // Show weather effect for this event
                if (event.type === EVENT_TYPES.FLOODING || 
                    event.type === EVENT_TYPES.STORM || 
                    event.type === EVENT_TYPES.HEATWAVE) {
                    this.showWeatherEffect(event.type);
                }
            });
            
            message += '\n';
        } else {
            message += 'No significant events occurred this turn.\n\n';
        }
        
        // Add financial summary
        message += `Financial Summary:\n`;
        message += `• Tax Revenue: +$${this.formatNumber(results.taxRevenue)}\n`;
        message += `• Maintenance Costs: -$${this.formatNumber(results.maintenanceCost)}\n`;
        
        // Calculate event costs
        let eventCosts = 0;
        results.events.forEach(event => {
            if (event.actualDamage > 0) {
                eventCosts += event.actualDamage;
            }
        });
        
        if (eventCosts > 0) {
            message += `• Event Costs: -$${this.formatNumber(eventCosts)}\n`;
        }
        
        // Calculate net change
        const netChange = results.taxRevenue - results.maintenanceCost - eventCosts;
        const netChangeText = netChange >= 0 ? 
            `+$${this.formatNumber(netChange)}` : 
            `-$${this.formatNumber(Math.abs(netChange))}`;
            
        message += `• Net Change: ${netChangeText}\n\n`;
        
        // Add damaged projects
        if (results.damagedProjects.length > 0) {
            message += 'Damaged infrastructure:\n';
            
            results.damagedProjects.forEach(result => {
                const status = result.destroyed ? 'Destroyed' : `Damaged (${result.newHealth}% integrity)`;
                message += `• ${result.projectName}: ${status}\n`;
            });
            
            message += '\n';
        }
        
        // Add remaining funds
        message += `Remaining town funds: $${this.formatNumber(this.game.state.money)}`;
        
        // Show game over message if applicable
        if (this.game.state.gameOver) {
            this.showGameOver();
        } else {
            this.showMessage(`Turn ${this.game.state.turn - 1} Results`, message);
        }
    }
    
    // Show game over screen
    showGameOver() {
        const finalTurn = this.game.state.turn - 1;
        const message = `Your town has run out of funds after ${finalTurn} turns. Despite your efforts, the increasing severity of climate events has overwhelmed your town's resources.\n\nYou managed to survive ${finalTurn} years of climate change, building various adaptation projects, but ultimately the town could not be sustained indefinitely.\n\nThis outcome reflects the difficult reality of climate adaptation: while we can delay and mitigate impacts, some climate change effects are now inevitable and will require ongoing resources and adaptation.`;
        
        this.showMessage('Game Over', message);
        this.endTurnBtn.disabled = true;
    }
    
    // Initialize the UI
    initialize() {
        this.updateStats();
        this.renderProjects();
        this.renderTownMap();
        this.addEventToLog('Welcome to Coastal Town: Climate Crisis. You are now the town manager.', 'normal');
        this.addEventToLog('Your goal is to adapt to climate change and protect your town as long as possible.', 'normal');
        
        // Show welcome message
        this.showMessage(
            'Welcome to Coastal Town: Climate Crisis',
            'You are the new manager of a coastal town facing the growing threat of climate change. Your task is to manage the town\'s resources and implement adaptation projects to protect against increasingly severe weather events.\n\nNo matter how well you plan, the town will eventually succumb to the effects of climate change. Your goal is to keep the town functioning for as long as possible.\n\nGood luck!'
        );
    }
}
