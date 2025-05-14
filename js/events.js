/**
 * Climate events that occur during the game
 */

// Event types
const EVENT_TYPES = {
    FLOODING: 'flooding',
    STORM: 'storm',
    HEATWAVE: 'heatwave',
    ECONOMIC: 'economic',
    SOCIAL: 'social'
};

// Event severity levels
const EVENT_SEVERITY = {
    MINOR: 'minor',
    MODERATE: 'moderate',
    MAJOR: 'major',
    CATASTROPHIC: 'catastrophic'
};

// Base events that can occur
const BASE_EVENTS = [
    {
        id: 'minor_flooding',
        name: 'Minor Flooding',
        type: EVENT_TYPES.FLOODING,
        severity: EVENT_SEVERITY.MINOR,
        description: 'Persistent precipitation has overwhelmed drainage systems in vulnerable low-lying neighborhoods, forcing residents to navigate increasingly treacherous streets.',
        baseDamage: 20000,
        baseProjectDamage: 5,
        minTurn: 1,
        probability: 0.4
    },
    {
        id: 'moderate_flooding',
        name: 'Moderate Flooding',
        type: EVENT_TYPES.FLOODING,
        severity: EVENT_SEVERITY.MODERATE,
        description: 'Relentless downpours have transformed streets into rivers, with water seeping into homes and businesses as the ground becomes increasingly saturated with each passing hour.',
        baseDamage: 50000,
        baseProjectDamage: 15,
        minTurn: 2,
        probability: 0.3
    },
    {
        id: 'major_flooding',
        name: 'Major Flooding',
        type: EVENT_TYPES.FLOODING,
        severity: EVENT_SEVERITY.MAJOR,
        description: 'Floodwaters have surged through neighborhoods with unprecedented force, submerging entire blocks and rendering critical infrastructure inaccessible as evacuation efforts intensify.',
        baseDamage: 120000,
        baseProjectDamage: 30,
        minTurn: 4,
        probability: 0.2
    },
    {
        id: 'catastrophic_flooding',
        name: 'Catastrophic Flooding',
        type: EVENT_TYPES.FLOODING,
        severity: EVENT_SEVERITY.CATASTROPHIC,
        description: 'A cataclysmic deluge has transformed the landscape beyond recognition, with entire neighborhoods now underwater and essential services completely collapsed as desperate rescue operations continue around the clock.',
        baseDamage: 300000,
        baseProjectDamage: 60,
        minTurn: 7,
        probability: 0.1
    },
    {
        id: 'minor_storm',
        name: 'Tropical Depression',
        type: EVENT_TYPES.STORM,
        severity: EVENT_SEVERITY.MINOR,
        description: 'Swirling winds and persistent rainfall have descended upon the coast, testing the resilience of our infrastructure as residents brace for potential escalation of this weather system.',
        baseDamage: 30000,
        baseProjectDamage: 10,
        minTurn: 1,
        probability: 0.3
    },
    {
        id: 'moderate_storm',
        name: 'Tropical Storm',
        type: EVENT_TYPES.STORM,
        severity: EVENT_SEVERITY.MODERATE,
        description: 'Howling winds and torrential rain lash against buildings as the tropical storm batters our coastline, uprooting trees and flooding low-lying areas while power lines sway precariously.',
        baseDamage: 80000,
        baseProjectDamage: 20,
        minTurn: 3,
        probability: 0.25
    },
    {
        id: 'major_storm',
        name: 'Category 2 Hurricane',
        type: EVENT_TYPES.STORM,
        severity: EVENT_SEVERITY.MAJOR,
        description: 'The hurricane\'s ferocious winds tear through our community with terrifying force, ripping roofs from buildings and hurling debris through the air as storm surge inundates coastal areas and torrential rain triggers widespread flooding.',
        baseDamage: 200000,
        baseProjectDamage: 40,
        minTurn: 5,
        probability: 0.15
    },
    {
        id: 'catastrophic_storm',
        name: 'Category 4 Hurricane',
        type: EVENT_TYPES.STORM,
        severity: EVENT_SEVERITY.CATASTROPHIC,
        description: 'An apocalyptic maelstrom of unprecedented fury has engulfed our town, with 150+ mph winds obliterating structures, catastrophic storm surge erasing entire coastal sections, and torrential rainfall triggering lethal flash floods and landslides.',
        baseDamage: 500000,
        baseProjectDamage: 70,
        minTurn: 8,
        probability: 0.1
    },
    {
        id: 'minor_heatwave',
        name: 'Mild Heatwave',
        type: EVENT_TYPES.HEATWAVE,
        severity: EVENT_SEVERITY.MINOR,
        description: 'Temperatures have climbed steadily above seasonal norms, causing discomfort among vulnerable populations and prompting increased energy consumption as air conditioners strain to keep pace.',
        baseDamage: 10000,
        baseProjectDamage: 5,
        minTurn: 2,
        probability: 0.35
    },
    {
        id: 'moderate_heatwave',
        name: 'Moderate Heatwave',
        type: EVENT_TYPES.HEATWAVE,
        severity: EVENT_SEVERITY.MODERATE,
        description: 'Relentless heat has settled over the region for days, causing brownouts as the electrical grid struggles under peak demand while emergency services report a surge in heat-related illnesses among the elderly and vulnerable.',
        baseDamage: 40000,
        baseProjectDamage: 10,
        minTurn: 3,
        probability: 0.25
    },
    {
        id: 'major_heatwave',
        name: 'Severe Heatwave',
        type: EVENT_TYPES.HEATWAVE,
        severity: EVENT_SEVERITY.MAJOR,
        description: 'Scorching temperatures have persisted for weeks, causing widespread power outages as transformers fail and cooling systems collapse, while hospitals are overwhelmed with heat stroke victims and outdoor activities become life-threatening.',
        baseDamage: 90000,
        baseProjectDamage: 15,
        minTurn: 6,
        probability: 0.15
    },
    {
        id: 'catastrophic_heatwave',
        name: 'Extreme Heatwave',
        type: EVENT_TYPES.HEATWAVE,
        severity: EVENT_SEVERITY.CATASTROPHIC,
        description: 'A hellish dome of heat has descended upon our region, shattering all historical temperature records as roads buckle, power grids collapse completely, and mass casualties mount despite emergency cooling shelters operating beyond capacity.',
        baseDamage: 180000,
        baseProjectDamage: 25,
        minTurn: 9,
        probability: 0.1
    },
    {
        id: 'budget_cut',
        name: 'Municipal Budget Cut',
        type: EVENT_TYPES.ECONOMIC,
        severity: EVENT_SEVERITY.MODERATE,
        description: 'Mounting climate adaptation costs have strained regional finances, forcing difficult decisions as municipal bond ratings decline and tax revenues fail to keep pace with the escalating demands on public infrastructure.',
        baseDamage: 100000, // Direct reduction in funds
        baseProjectDamage: 0,
        minTurn: 2,
        probability: 0.2
    },
    {
        id: 'population_decline',
        name: 'Population Decline',
        type: EVENT_TYPES.SOCIAL,
        severity: EVENT_SEVERITY.MODERATE,
        description: 'A steady exodus of residents and businesses has accelerated as climate risks intensify, creating a downward spiral of declining property values and shrinking tax base that further limits our adaptation capabilities.',
        baseDamage: 80000,
        baseProjectDamage: 0,
        minTurn: 4,
        probability: 0.15
    },
    {
        id: 'federal_aid',
        name: 'Federal Aid Package',
        type: EVENT_TYPES.ECONOMIC,
        severity: EVENT_SEVERITY.MINOR,
        description: 'Federal disaster resilience funding has been allocated to our community, providing a temporary financial reprieve to implement critical adaptation measures before the next inevitable climate emergency strikes.',
        baseDamage: -150000, // Negative damage means funds are added
        baseProjectDamage: 0,
        minTurn: 3,
        probability: 0.15
    }
];

// Class to manage climate events
class EventManager {
    constructor(gameState, projectManager) {
        this.gameState = gameState;
        this.projectManager = projectManager;
        this.eventHistory = [];
        this.currentEvents = [];
    }

    // Get events that can occur at the current turn
    getAvailableEvents() {
        const currentTurn = this.gameState.turn;
        return BASE_EVENTS.filter(event => event.minTurn <= currentTurn);
    }

    // Generate events for the current turn
    generateEvents() {
        const availableEvents = this.getAvailableEvents();
        const currentIntensity = this.gameState.climateIntensity;
        this.currentEvents = [];
        
        // Calculate how many events will occur this turn
        const baseEventCount = 1;
        const additionalEventChance = Math.min(0.1 * (this.gameState.turn - 1), 0.5);
        const eventCount = baseEventCount + (Math.random() < additionalEventChance ? 1 : 0);
        
        // Select events based on probability (adjusted by climate intensity)
        for (let i = 0; i < eventCount; i++) {
            const selectedEvent = this.selectRandomEvent(availableEvents, currentIntensity);
            if (selectedEvent) {
                this.currentEvents.push(selectedEvent);
            }
        }
        
        return this.currentEvents;
    }

    // Select a random event based on probability
    selectRandomEvent(events, intensityMultiplier) {
        // Adjust probabilities based on climate intensity
        const adjustedEvents = events.map(event => ({
            ...event,
            adjustedProbability: event.probability * (
                event.severity === EVENT_SEVERITY.CATASTROPHIC ? intensityMultiplier * 1.5 :
                event.severity === EVENT_SEVERITY.MAJOR ? intensityMultiplier * 1.2 :
                event.severity === EVENT_SEVERITY.MODERATE ? intensityMultiplier :
                1
            )
        }));
        
        // Calculate total probability
        const totalProbability = adjustedEvents.reduce((sum, event) => sum + event.adjustedProbability, 0);
        
        // Select an event based on adjusted probability
        let random = Math.random() * totalProbability;
        for (const event of adjustedEvents) {
            random -= event.adjustedProbability;
            if (random <= 0) {
                return {
                    ...event,
                    actualDamage: this.calculateActualDamage(event),
                    turn: this.gameState.turn
                };
            }
        }
        
        // Fallback to a random event if none selected by probability
        const randomIndex = Math.floor(Math.random() * events.length);
        const event = events[randomIndex];
        return {
            ...event,
            actualDamage: this.calculateActualDamage(event),
            turn: this.gameState.turn
        };
    }

    // Calculate actual damage based on event severity, climate intensity, and town's defenses
    calculateActualDamage(event) {
        const intensity = this.gameState.climateIntensity;
        const baseDamage = event.baseDamage;
        
        // Get town's effectiveness against this type of event
        let defenseEffectiveness = 0;
        if (event.type === EVENT_TYPES.FLOODING || event.type === EVENT_TYPES.STORM || event.type === EVENT_TYPES.HEATWAVE) {
            const effectiveness = this.projectManager.calculateTotalEffectiveness();
            defenseEffectiveness = effectiveness[event.type] || 0;
        }
        
        // Calculate damage reduction from defenses (0-90%)
        const damageReduction = defenseEffectiveness / 100;
        
        // Calculate final damage
        const intensityMultiplier = 1 + ((intensity - 1) * 0.2); // 1.0 to 1.8 based on intensity
        const randomVariation = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2 random factor
        
        let actualDamage = baseDamage * intensityMultiplier * randomVariation * (1 - damageReduction);
        
        // Round to nearest 1000
        actualDamage = Math.round(actualDamage / 1000) * 1000;
        
        return actualDamage;
    }

    // Apply event effects to the town
    applyEvents() {
        if (this.currentEvents.length === 0) {
            return {
                totalDamage: 0,
                damagedProjects: []
            };
        }
        
        let totalDamage = 0;
        const damagedProjects = [];
        
        // Process each event
        this.currentEvents.forEach(event => {
            // Apply financial damage
            totalDamage += event.actualDamage;
            
            // Apply damage to projects
            if (event.baseProjectDamage > 0) {
                const builtProjects = this.projectManager.getBuiltProjects();
                
                // Determine which projects might be damaged
                builtProjects.forEach(project => {
                    // Skip projects that can't be damaged (like education programs)
                    if (project.durability >= 100) return;
                    
                    // Calculate chance of damage based on project durability and event severity
                    const durabilityFactor = (100 - project.durability) / 100;
                    const severityFactor = 
                        event.severity === EVENT_SEVERITY.CATASTROPHIC ? 0.9 :
                        event.severity === EVENT_SEVERITY.MAJOR ? 0.6 :
                        event.severity === EVENT_SEVERITY.MODERATE ? 0.3 :
                        0.1;
                    
                    const damageChance = durabilityFactor * severityFactor;
                    
                    // Determine if project is damaged
                    if (Math.random() < damageChance) {
                        // Calculate damage amount
                        const baseDamage = event.baseProjectDamage;
                        const randomFactor = 0.7 + (Math.random() * 0.6); // 0.7 to 1.3
                        const damageAmount = Math.round(baseDamage * randomFactor);
                        
                        // Apply damage to project
                        const damageResult = this.projectManager.damageProject(project.id, damageAmount);
                        
                        if (damageResult) {
                            damagedProjects.push(damageResult);
                        }
                    }
                });
            }
            
            // Add event to history
            this.eventHistory.push({
                ...event,
                damagedProjects: [...damagedProjects]
            });
        });
        
        // Apply total damage to town funds
        this.gameState.money = Math.max(0, this.gameState.money - totalDamage);
        
        return {
            totalDamage,
            damagedProjects
        };
    }

    // Get event history for a specific turn
    getEventsForTurn(turn) {
        return this.eventHistory.filter(event => event.turn === turn);
    }

    // Get all event history
    getAllEvents() {
        return this.eventHistory;
    }
}
