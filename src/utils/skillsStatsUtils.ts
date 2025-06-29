
import { SkillAssessment, OrganizationalSkill, TrainingProgram } from '@/types/skillsManagement';

export const calculateSkillStats = (
  organizationalSkills: OrganizationalSkill[],
  skillAssessments: SkillAssessment[],
  trainingPrograms: TrainingProgram[]
) => {
  const totalSkills = organizationalSkills.length;
  const criticalGaps = skillAssessments.filter(assessment => 
    (assessment.target_level - assessment.current_level) >= 30
  ).length;
  const inTraining = trainingPrograms.filter(program => program.status === 'active')
    .reduce((sum, program) => sum + program.current_participants, 0);
  const avgProgress = skillAssessments.length > 0 
    ? Math.round(skillAssessments.reduce((sum, assessment) => 
        sum + (assessment.current_level / assessment.target_level * 100), 0
      ) / skillAssessments.length)
    : 0;

  return {
    totalSkills,
    criticalGaps,
    inTraining,
    avgProgress
  };
};
