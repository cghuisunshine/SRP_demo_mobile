use bevy_ecs::prelude::*;
use serde::Serialize;

// --- Components ---

#[derive(Component, Debug, Serialize, Clone)]
pub struct Inspector {
    pub id: String,
    pub name: String,
    pub current_location: (f32, f32), // Lat/Long mock
    pub skill_level: u8,
}

#[derive(Component, Debug, Serialize, Clone)]
pub struct InspectionJob {
    pub id: String,
    pub location: (f32, f32),
    pub priority: u8,
    pub estimated_duration_hours: f32,
    pub required_skill_level: u8,
}

#[derive(Component, Debug, Serialize, Clone)]
#[allow(dead_code)]
pub struct AvailabilitySlot {
    pub inspector_id: String,
    pub date: String,
    pub is_blocked: bool,
}

// Result component attached to jobs after assignment
#[derive(Component, Debug, Serialize, Clone)]
pub struct AssignmentResult {
    pub assigned_inspector_id: String,
    pub score: f32,
}

// --- Systems ---

// 1. Scoring System: Calculates fitness of each inspector for each unassigned job
// In a real spatial ECS, this would use a QuadTree or k-d tree for proximity queries
pub fn assignment_scoring_system(
    mut commands: Commands,
    jobs: Query<(Entity, &InspectionJob), Without<AssignmentResult>>,
    inspectors: Query<&Inspector>,
) {
    for (job_entity, job) in jobs.iter() {
        let mut best_score = -1.0;
        let mut best_inspector_id = None;

        for inspector in inspectors.iter() {
            // Simple logic: Can they do the job?
            if inspector.skill_level < job.required_skill_level {
                continue;
            }

            // Distance Metric (Euclidean mock)
            let dist = ((inspector.current_location.0 - job.location.0).powi(2) 
                      + (inspector.current_location.1 - job.location.1).powi(2)).sqrt();
            
            // Score = 100 - Distance (Closure is better) + Priority Bonus
            let score = 100.0 - (dist * 10.0) + (job.priority as f32 * 5.0);

            if score > best_score {
                best_score = score;
                best_inspector_id = Some(inspector.id.clone());
            }
        }

        if let Some(insp_id) = best_inspector_id {
            // "Assign" the job
            println!("ECS: Assigned Job {} to Inspector {} (Score: {:.2})", job.id, insp_id, best_score);
            commands.entity(job_entity).insert(AssignmentResult {
                assigned_inspector_id: insp_id,
                score: best_score,
            });
        }
    }
}

// --- World Wrapper ---

pub struct SchedulerWorld {
    pub world: World,
    pub schedule: Schedule,
}

impl SchedulerWorld {
    pub fn new() -> Self {
        let mut world = World::new();
        let mut schedule = Schedule::default();

        schedule.add_systems(assignment_scoring_system);

        Self { world, schedule }
    }

    pub fn seed_simulation(&mut self) {
        // Spawn Inspectors
        self.world.spawn(Inspector { 
            id: "insp-1".into(), name: "Alice".into(), current_location: (49.2827, -123.1207), skill_level: 5 // Downtown
        });
        self.world.spawn(Inspector { 
            id: "insp-2".into(), name: "Bob".into(), current_location: (49.1666, -123.1336), skill_level: 3 // Richmond
        });

        // Spawn Jobs
        self.world.spawn(InspectionJob {
            id: "job-A".into(), location: (49.2606, -123.2460), priority: 2, estimated_duration_hours: 2.0, required_skill_level: 2 // UBC (Closer to Alice)
        });
        self.world.spawn(InspectionJob {
            id: "job-B".into(), location: (49.1304, -123.0697), priority: 5, estimated_duration_hours: 4.0, required_skill_level: 3 // Delta (Closer to Bob)
        });
    }

    pub fn run(&mut self) {
        self.schedule.run(&mut self.world);
    }
    
    // ✅ FIXED: Proper immutable iteration
    pub fn get_assignments(&mut self) -> Vec<(InspectionJob, AssignmentResult)> {
        let mut query = self.world.query::<(&InspectionJob, &AssignmentResult)>();
        let mut results = Vec::new();

        for (job, assignment) in query.iter(&self.world) {
            results.push((job.clone(), assignment.clone()));
        }
        results
    }
}
