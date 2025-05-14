/**
 * Projects available for the player to build in the coastal town
 */

// Project categories
const PROJECT_CATEGORIES = {
    COASTAL: 'coastal',
    INFRASTRUCTURE: 'infrastructure',
    COMMUNITY: 'community',
    EMERGENCY: 'emergency'
};

// Project types
const PROJECT_TYPES = {
    PROTECTION: 'protection',
    COOLING: 'cooling',
    DRAINAGE: 'drainage',
    POWER: 'power',
    HEALTH: 'health',
    EDUCATION: 'education'
};

// Project status
const PROJECT_STATUS = {
    AVAILABLE: 'available',
    BUILT: 'built',
    DAMAGED: 'damaged',
    DESTROYED: 'destroyed'
};

// Define all available projects
const PROJECTS = [
    {
        id: 'seawall',
        name: 'Seawall',
        category: PROJECT_CATEGORIES.COASTAL,
        type: PROJECT_TYPES.PROTECTION,
        description: 'Reinforced coastal fortification designed to withstand the relentless advance of rising tides and increasingly powerful storm surges.',
        cost: 250000,
        maintenanceCost: 15000,
        durability: 80,
        effectiveness: {
            flooding: 70,
            storm: 60,
            heatwave: 0
        },
        unlockTurn: 1,
        position: { x: 0, y: 270, width: 300, height: 30 } // Seawall at the bottom of the map (coastline)
    },
    {
        id: 'levee',
        name: 'Levee System',
        category: PROJECT_CATEGORIES.COASTAL,
        type: PROJECT_TYPES.PROTECTION,
        description: 'Strategic earthen barriers that channel floodwaters away from vulnerable areas, creating a natural defense against the encroaching waters.',
        cost: 180000,
        maintenanceCost: 10000,
        durability: 60,
        effectiveness: {
            flooding: 65,
            storm: 40,
            heatwave: 0
        },
        unlockTurn: 1,
        position: { x: 50, y: 230, width: 200, height: 20 } // Levee system positioned near the coast
    },
    {
        id: 'drainage',
        name: 'Improved Drainage System',
        category: PROJECT_CATEGORIES.INFRASTRUCTURE,
        type: PROJECT_TYPES.DRAINAGE,
        description: 'Network of advanced water management channels that divert the increasingly unpredictable deluge of rainfall away from critical infrastructure.',
        cost: 120000,
        maintenanceCost: 8000,
        durability: 70,
        effectiveness: {
            flooding: 50,
            storm: 30,
            heatwave: 0
        },
        unlockTurn: 1,
        position: { x: 75, y: 180, width: 150, height: 15 } // Drainage system spread across the town
    },
    {
        id: 'cooling_center',
        name: 'Community Cooling Center',
        category: PROJECT_CATEGORIES.COMMUNITY,
        type: PROJECT_TYPES.COOLING,
        description: 'Climate-controlled sanctuary offering respite from the increasingly brutal summer heat waves that threaten the most vulnerable citizens.',
        cost: 80000,
        maintenanceCost: 12000,
        durability: 90,
        effectiveness: {
            flooding: 0,
            storm: 0,
            heatwave: 60
        },
        unlockTurn: 2,
        position: { x: 180, y: 120, width: 60, height: 50 } // Cooling center in the central area of town
    },
    {
        id: 'emergency_shelter',
        name: 'Emergency Shelter',
        category: PROJECT_CATEGORIES.EMERGENCY,
        type: PROJECT_TYPES.PROTECTION,
        description: 'Fortified haven designed to withstand nature\'s fury, providing sanctuary for displaced citizens when the inevitable disasters strike.',
        cost: 150000,
        maintenanceCost: 5000,
        durability: 85,
        effectiveness: {
            flooding: 0,
            storm: 20,
            heatwave: 30
        },
        unlockTurn: 2,
        position: { x: 80, y: 70, width: 70, height: 60 } // Emergency shelter on higher ground
    },
    {
        id: 'solar_grid',
        name: 'Community Solar Grid',
        category: PROJECT_CATEGORIES.INFRASTRUCTURE,
        type: PROJECT_TYPES.POWER,
        description: 'Decentralized power network harnessing the sun\'s energy, providing resilience against the increasingly frequent grid failures as extreme weather events intensify.',
        cost: 200000,
        maintenanceCost: 10000,
        durability: 75,
        effectiveness: {
            flooding: 0,
            storm: 10,
            heatwave: 20
        },
        unlockTurn: 3,
        position: { x: 230, y: 40, width: 60, height: 60 } // Solar grid on the outskirts of town with good sun exposure
    },
    {
        id: 'elevated_buildings',
        name: 'Elevated Building Foundations',
        category: PROJECT_CATEGORIES.INFRASTRUCTURE,
        type: PROJECT_TYPES.PROTECTION,
        description: 'Architectural adaptation that lifts essential structures beyond the reach of the ever-rising floodwaters that threaten to consume our coastal communities.',
        cost: 300000,
        maintenanceCost: 5000,
        durability: 95,
        effectiveness: {
            flooding: 80,
            storm: 30,
            heatwave: 0
        },
        unlockTurn: 4,
        position: { x: 130, y: 100, width: 100, height: 40 } // Elevated buildings in the central residential area
    },
    {
        id: 'education_program',
        name: 'Climate Education Program',
        category: PROJECT_CATEGORIES.COMMUNITY,
        type: PROJECT_TYPES.EDUCATION,
        description: 'Knowledge initiative that empowers citizens with the critical awareness and survival skills needed to navigate our increasingly hostile climate reality.',
        cost: 50000,
        maintenanceCost: 20000,
        durability: 100, // Can't be damaged
        effectiveness: {
            flooding: 10,
            storm: 10,
            heatwave: 10
        },
        unlockTurn: 3,
        position: { x: 30, y: 100, width: 50, height: 50 } // Education program in a school/community center location
    },
    {
        id: 'health_system',
        name: 'Enhanced Health System',
        category: PROJECT_CATEGORIES.COMMUNITY,
        type: PROJECT_TYPES.HEALTH,
        description: 'Modernized medical infrastructure capable of responding to the surge in climate-related ailments, from heat stroke to waterborne diseases that emerge from our changing world.',
        cost: 180000,
        maintenanceCost: 25000,
        durability: 85,
        effectiveness: {
            flooding: 0,
            storm: 15,
            heatwave: 50
        },
        unlockTurn: 5,
        position: { x: 160, y: 150, width: 70, height: 60 } // Health system in a central, accessible location
    },
    {
        id: 'mangrove',
        name: 'Mangrove Restoration',
        category: PROJECT_CATEGORIES.COASTAL,
        type: PROJECT_TYPES.PROTECTION,
        description: 'Revival of ancient coastal guardians whose tangled roots form a living shield against the ocean\'s increasingly violent assaults, while sequestering carbon from our troubled atmosphere.',
        cost: 100000,
        maintenanceCost: 5000,
        durability: 50,
        effectiveness: {
            flooding: 40,
            storm: 35,
            heatwave: 10
        },
        unlockTurn: 4,
        position: { x: 0, y: 210, width: 120, height: 50 } // Mangrove restoration along the coastline, just above the seawall
    }
];

// Class to manage projects
class ProjectManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.projects = this.initializeProjects();
    }

    // Initialize all projects with default status
    initializeProjects() {
        return PROJECTS.map(project => ({
            ...project,
            status: PROJECT_STATUS.AVAILABLE,
            health: 100, // Full health when built
            built: false,
            damage: 0
        }));
    }

    // Get all projects available at the current turn
    getAvailableProjects() {
        const currentTurn = this.gameState.turn;
        return this.projects.filter(project => 
            project.unlockTurn <= currentTurn && 
            project.status === PROJECT_STATUS.AVAILABLE
        );
    }

    // Get all built projects
    getBuiltProjects() {
        return this.projects.filter(project => 
            project.built && 
            project.status !== PROJECT_STATUS.DESTROYED
        );
    }

    // Build a project
    buildProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        
        if (!project) {
            console.error(`Project with ID ${projectId} not found`);
            return false;
        }
        
        if (project.built) {
            console.error(`Project ${project.name} is already built`);
            return false;
        }
        
        if (project.cost > this.gameState.money) {
            console.error(`Not enough money to build ${project.name}`);
            return false;
        }
        
        // Update project status
        project.built = true;
        project.status = PROJECT_STATUS.BUILT;
        project.health = 100;
        project.damage = 0;
        
        // Deduct cost from town funds
        this.gameState.money -= project.cost;
        
        return true;
    }

    // Apply damage to a project
    damageProject(projectId, damageAmount) {
        const project = this.projects.find(p => p.id === projectId);
        
        if (!project || !project.built) {
            return false;
        }
        
        project.damage += damageAmount;
        project.health = Math.max(0, 100 - project.damage);
        
        // Update status based on health
        if (project.health <= 0) {
            project.status = PROJECT_STATUS.DESTROYED;
            project.built = false;
        } else if (project.health < 50) {
            project.status = PROJECT_STATUS.DAMAGED;
        }
        
        return {
            projectName: project.name,
            damage: damageAmount,
            newHealth: project.health,
            destroyed: project.status === PROJECT_STATUS.DESTROYED
        };
    }

    // Repair a damaged project
    repairProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        
        if (!project || !project.built || project.status === PROJECT_STATUS.DESTROYED) {
            return false;
        }
        
        const repairCost = Math.ceil((project.damage / 100) * project.cost * 0.6); // 60% of original cost based on damage
        
        if (repairCost > this.gameState.money) {
            console.error(`Not enough money to repair ${project.name}`);
            return false;
        }
        
        // Update project status
        project.damage = 0;
        project.health = 100;
        project.status = PROJECT_STATUS.BUILT;
        
        // Deduct repair cost
        this.gameState.money -= repairCost;
        
        return {
            projectName: project.name,
            repairCost: repairCost
        };
    }

    // Calculate maintenance costs for all built projects
    calculateMaintenanceCosts() {
        const builtProjects = this.getBuiltProjects();
        let totalCost = 0;
        
        builtProjects.forEach(project => {
            // Damaged projects cost more to maintain
            const maintenanceMultiplier = project.status === PROJECT_STATUS.DAMAGED ? 1.5 : 1;
            totalCost += project.maintenanceCost * maintenanceMultiplier;
        });
        
        return totalCost;
    }

    // Calculate total effectiveness against different event types
    calculateTotalEffectiveness() {
        const builtProjects = this.getBuiltProjects();
        const effectiveness = {
            flooding: 0,
            storm: 0,
            heatwave: 0
        };
        
        builtProjects.forEach(project => {
            // Effectiveness is reduced for damaged projects
            const effectivenessMultiplier = project.status === PROJECT_STATUS.DAMAGED ? 0.5 : 1;
            
            effectiveness.flooding += project.effectiveness.flooding * effectivenessMultiplier;
            effectiveness.storm += project.effectiveness.storm * effectivenessMultiplier;
            effectiveness.heatwave += project.effectiveness.heatwave * effectivenessMultiplier;
        });
        
        // Cap effectiveness at 90% to ensure some risk remains
        return {
            flooding: Math.min(90, effectiveness.flooding),
            storm: Math.min(90, effectiveness.storm),
            heatwave: Math.min(90, effectiveness.heatwave)
        };
    }
}
