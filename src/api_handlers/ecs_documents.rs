use bevy_ecs::prelude::*;
use serde::Serialize;

// --- Components ---

// The raw content of a document (simulated)
#[derive(Component, Debug)]
pub struct RawContent(pub String);

// Metadata for the document
#[derive(Component, Debug, Clone, Serialize)]
pub struct DocumentMetadata {
    pub id: String,
    pub filename: String,
    pub file_type: String, // pdf, docx, etc.
}

// Status component to track processing state
#[derive(Component, Debug, Clone, PartialEq, Serialize)]
#[allow(dead_code)]
pub enum ProcessingStatus {
    Pending,
    Analyzing,
    Completed,
    Failed,
}

// Result component: The output of our analysis
#[derive(Component, Debug, Default, Serialize)]
pub struct AnalysisResult {
    pub word_count: usize,
    pub key_entities: Vec<String>,
    pub sentiment_score: f32,
    pub summary: String,
}

// --- Systems ---

// System 1: Ingest "Pending" documents and mark them as "Analyzing"
pub fn ingestion_system(mut query: Query<(Entity, &mut ProcessingStatus), With<RawContent>>) {
    // In a real ECS, this runs in parallel with other systems
    for (entity, mut status) in query.iter_mut() {
        if *status == ProcessingStatus::Pending {
            println!("ECS: Ingesting Entity {:?}", entity);
            *status = ProcessingStatus::Analyzing;
        }
    }
}

// System 2: perform heavy analysis on "Analyzing" documents
// This demonstrates the "Parallel" advantage. We can iterate over chunks of entities.
pub fn analysis_system(
    mut query: Query<(&RawContent, &mut AnalysisResult, &mut ProcessingStatus)>
) {
    // Rayon or other parallel iterators could be used here for massive datasets
    for (content, mut result, mut status) in query.iter_mut() {
        if *status == ProcessingStatus::Analyzing {
            println!("ECS: Analyzing content...");
            
            // SIMULATED HEAVY WORK (e.g., OCR, NLP)
            let text = &content.0;
            result.word_count = text.split_whitespace().count();
            
            // Simple keyword extraction mock
            if text.contains("Strata") {
                result.key_entities.push("Strata Corp".to_string());
            }
            if text.contains("Budget") {
                result.key_entities.push("Financials".to_string());
            }

            // Fake sentiment analysis
            result.sentiment_score = 0.85; 
            
            // Mark as done
            *status = ProcessingStatus::Completed;
        }
    }
}

// --- World Wrapper ---

pub struct DocumentWorld {
    pub world: World,
    pub schedule: Schedule,
}

impl DocumentWorld {
    pub fn new() -> Self {
        let mut world = World::new();
        let mut schedule = Schedule::default();

        // Add our systems to the schedule
        schedule.add_systems((ingestion_system, analysis_system).chain());

        Self { world, schedule }
    }

    // specific method to add a doc
    pub fn add_document(&mut self, id: String, filename: String, content: String) {
        self.world.spawn((
            DocumentMetadata { id, filename, file_type: "pdf".to_string() },
            RawContent(content),
            ProcessingStatus::Pending,
            AnalysisResult::default(),
        ));
    }

    pub fn run(&mut self) {
        self.schedule.run(&mut self.world);
    }
    
    // ✅ FIXED: Use immutable iteration pattern
    pub fn get_results(&mut self) -> Vec<(DocumentMetadata, ProcessingStatus, AnalysisResult)> {
        let mut results = Vec::new();
        let mut query = self.world.query::<(&DocumentMetadata, &ProcessingStatus, &AnalysisResult)>();
        
        for (meta, status, res) in query.iter(&self.world) {
            results.push((meta.clone(), status.clone(), AnalysisResult {
                word_count: res.word_count,
                key_entities: res.key_entities.clone(),
                sentiment_score: res.sentiment_score,
                summary: res.summary.clone(),
            }));
        }
        results
    }
}
