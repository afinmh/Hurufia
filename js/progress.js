/**
 * Hurufia Progress Management System
 * Manages learning progress using local storage
 */

// Store module names and their IDs for consistency across the application
const MODULES = {
    'nun': {
        id: 'nun',
        name: 'Nun Mati',
        totalSteps: 6
    },
    'mim': {
        id: 'mim',
        name: 'Mim Mati',
        totalSteps: 4
    },
    'lam': {
        id: 'lam',
        name: 'Lam Ta\'rif',
        totalSteps: 3
    },
    'mad': {
        id: 'mad',
        name: 'Mad',
        totalSteps: 4
    },
    'tafkhim': {
        id: 'tafkhim',
        name: 'Tafkhim/Tarqiq',
        totalSteps: 3
    },
    'qolqolah': {
        id: 'qolqolah',
        name: 'Qolqolah',
        totalSteps: 3
    }
};

// Local storage key for progress data
const PROGRESS_KEY = 'hurufia_progress';

/**
 * Get module progress from local storage
 * @param {string} moduleId - ID of the module (e.g., 'nun', 'mim')
 * @returns {Object} Progress object
 */
function getModuleProgress(moduleId) {
    const allProgress = getAllProgress();
    return allProgress[moduleId] || { completed: false, completedSteps: 0, score: 0, lastVisit: null };
}

/**
 * Get all progress data from local storage
 * @returns {Object} All progress data
 */
function getAllProgress() {
    try {
        const progressData = localStorage.getItem(PROGRESS_KEY);
        return progressData ? JSON.parse(progressData) : {};
    } catch (error) {
        console.error('Error getting progress data:', error);
        return {};
    }
}

/**
 * Save module progress to local storage
 * @param {string} moduleId - ID of the module
 * @param {number} completedSteps - Number of completed steps
 * @param {number} score - Test score (0-5)
 * @param {boolean} completed - Whether the module is fully completed
 */
function saveModuleProgress(moduleId, completedSteps, score = 0, completed = false) {
    try {
        if (!MODULES[moduleId]) {
            console.error('Invalid module ID:', moduleId);
            return;
        }

        const allProgress = getAllProgress();
        
        // Calculate progress percentage
        const totalSteps = MODULES[moduleId].totalSteps;
        const percentage = Math.min(Math.round((completedSteps / totalSteps) * 100), 100);
        
        allProgress[moduleId] = {
            completed: completed,
            completedSteps: completedSteps,
            percentage: percentage,
            score: score,
            lastVisit: new Date().toISOString()
        };

        localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
        
        // Trigger custom event for progress update
        const event = new CustomEvent('progress-updated', { 
            detail: { moduleId, progress: allProgress[moduleId] } 
        });
        document.dispatchEvent(event);
        
        return percentage;
    } catch (error) {
        console.error('Error saving progress:', error);
    }
}

/**
 * Track step completion
 * @param {string} moduleId - ID of the module
 * @param {number} stepNumber - Current step number
 */
function trackStepCompletion(moduleId, stepNumber) {
    const currentProgress = getModuleProgress(moduleId);
    const completedSteps = Math.max(currentProgress.completedSteps, stepNumber);
    
    // Only update if we've progressed further
    if (completedSteps > currentProgress.completedSteps) {
        saveModuleProgress(moduleId, completedSteps);
    }
}

/**
 * Complete module after successful test
 * @param {string} moduleId - ID of the module
 * @param {number} score - Test score (0-5)
 * @param {boolean} passed - Whether the test was passed
 */
function completeModule(moduleId, score, passed) {
    const module = MODULES[moduleId];
    if (!module) return;
    
    saveModuleProgress(
        moduleId, 
        passed ? module.totalSteps : module.totalSteps - 1, 
        score,
        passed
    );
}

/**
 * Reset progress for a specific module
 * @param {string} moduleId - ID of the module to reset
 */
function resetModuleProgress(moduleId) {
    const allProgress = getAllProgress();
    if (allProgress[moduleId]) {
        delete allProgress[moduleId];
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
    }
}

/**
 * Reset all progress data
 */
function resetAllProgress() {
    localStorage.removeItem(PROGRESS_KEY);
}

/**
 * Update the UI to reflect the current progress
 * Only used on the main material page
 */
function updateProgressUI() {
    const allProgress = getAllProgress();
    
    // Update progress for each module card
    Object.keys(MODULES).forEach(moduleId => {
        const moduleCard = document.querySelector(`.materi-card a[href="${moduleId}.html"]`)?.closest('.materi-card');
        if (!moduleCard) return;
        
        const progress = allProgress[moduleId] || { percentage: 0 };
        const progressBar = moduleCard.querySelector('.progress');
        const progressText = moduleCard.querySelector('.progress-text');
        
        if (progressBar) {
            progressBar.style.width = `${progress.percentage || 0}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${progress.percentage || 0}%`;
        }
        
        // Add completed badge if module is completed
        if (progress.completed) {
            const existingBadge = moduleCard.querySelector('.completed-badge');
            if (!existingBadge) {
                const badge = document.createElement('div');
                badge.className = 'completed-badge';
                badge.innerHTML = '<i class="fas fa-check-circle"></i> Selesai';
                moduleCard.appendChild(badge);
            }
        }
    });
}