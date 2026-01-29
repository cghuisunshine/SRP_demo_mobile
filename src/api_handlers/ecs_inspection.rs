use bevy_ecs::prelude::*;
use serde::Serialize;
use rand::Rng;

// --- Components ---

#[derive(Component, Debug, Serialize, Clone)]
pub struct BuildingElement {
    pub name: String,
    pub category: String, // e.g. "Envelope", "Mechanical"
    pub age_years: u32,
}

#[derive(Component, Debug, Serialize, Clone)]
pub struct SimulatedFinding {
    pub condition_score: u8, // 0-100
    pub observation: String,
    pub recommendation: String,
    pub estimated_cost: u32,
}

// --- Systems ---

pub fn finding_simulation_system(
    mut commands: Commands,
    query: Query<(Entity, &BuildingElement), Without<SimulatedFinding>>,
) {
    // ✅ FIXED: rand::thread_rng() -> rand::rng()
    let mut rng = rand::rng();

    for (entity, element) in query.iter() {
        // Simulation Logic: Older elements get worse scores
        let age_factor = element.age_years as f32 * 2.5;
        // ✅ FIXED: gen_range() -> random_range()
        let random_factor: f32 = rng.random_range(0.0..20.0);
        let score = (100.0 - age_factor - random_factor).max(0.0) as u8;

        let (obs, rec, cost) = match score {
            90..=100 => ("Excellent condition. No visible wear.", "Monitor.", 0),
            70..=89 => ("Good condition. Minor cosmetic weathering.", "Routine maintenance.", 500),
            40..=69 => ("Fair condition. Signs of aging present.", "Plan for repairs in 3-5 years.", 5000),
            _ => ("Poor condition. Immediate attention required.", "Replace within 12 months.", 25000),
        };

        commands.entity(entity).insert(SimulatedFinding {
            condition_score: score,
            observation: obs.to_string(),
            recommendation: rec.to_string(),
            estimated_cost: cost,
        });
    }
}

// --- World Wrapper ---

pub struct InspectionWorld {
    pub world: World,
    pub schedule: Schedule,
}

impl InspectionWorld {
    pub fn new() -> Self {
        let mut world = World::new();
        let mut schedule = Schedule::default();
        schedule.add_systems(finding_simulation_system);
        Self { world, schedule }
    }

    pub fn seed_mock_elements(&mut self) {
        // Seed some mock building elements to simulate inspecting
        self.world.spawn(BuildingElement { name: "Asphalt Shingle Roof".into(), category: "Envelope".into(), age_years: 18 });
        self.world.spawn(BuildingElement { name: "Boiler Room #1".into(), category: "Mechanical".into(), age_years: 5 });
        self.world.spawn(BuildingElement { name: "Underground Parkade Membrane".into(), category: "Structure".into(), age_years: 25 });
        self.world.spawn(BuildingElement { name: "Lobby Interiors".into(), category: "Cosmetic".into(), age_years: 10 });
    }

    pub fn run(&mut self) {
        self.schedule.run(&mut self.world);
    }
    
    // ✅ FIXED: Proper mutable borrow pattern
    pub fn get_results(&mut self) -> Vec<(BuildingElement, SimulatedFinding)> {
        let mut query = self.world.query::<(&BuildingElement, &SimulatedFinding)>();
        let mut results = Vec::new();
        for (elem, finding) in query.iter(&self.world) {
            results.push((elem.clone(), finding.clone()));
        }
        results
    }
}
