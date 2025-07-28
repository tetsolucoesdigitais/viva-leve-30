import { User, Achievement, WeightEntry } from '../types';

export function checkAchievements(user: User): Achievement[] {
  const newAchievements: Achievement[] = [];
  
  // Check for discipline achievement (4 weeks consecutive)
  if (user.weights.length >= 4) {
    const hasConsecutiveWeeks = checkConsecutiveWeeks(user.weights);
    const hasDisciplineAchievement = user.achievements.some(a => a.type === 'discipline');
    
    if (hasConsecutiveWeeks && !hasDisciplineAchievement) {
      newAchievements.push({
        id: Date.now().toString(),
        type: 'discipline',
        title: 'Disciplina',
        description: 'Registrou peso por 4 semanas consecutivas',
        unlockedAt: new Date()
      });
    }
  }
  
  // Check for transformation achievement (5kg lost)
  if (user.weights.length >= 2) {
    const firstWeight = user.weights[0].weight;
    const lastWeight = user.weights[user.weights.length - 1].weight;
    const weightLoss = firstWeight - lastWeight;
    const hasTransformationAchievement = user.achievements.some(a => a.type === 'transformation');
    
    if (weightLoss >= 5 && !hasTransformationAchievement) {
      newAchievements.push({
        id: Date.now().toString(),
        type: 'transformation',
        title: 'Transformação',
        description: 'Perdeu 5kg ou mais',
        unlockedAt: new Date()
      });
    }
  }
  
  return newAchievements;
}

function checkConsecutiveWeeks(weights: WeightEntry[]): boolean {
  if (weights.length < 4) return false;
  
  const sortedWeights = weights.sort((a, b) => a.date.getTime() - b.date.getTime());
  
  for (let i = 1; i < 4; i++) {
    const daysDiff = Math.abs(sortedWeights[i].date.getTime() - sortedWeights[i-1].date.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff > 10) return false; // Allow some flexibility (within 10 days)
  }
  
  return true;
}

export function getMotivationalMessage(weightChange: number): { message: string; type: 'success' | 'warning' | 'info' } {
  if (weightChange < -2) {
    return {
      message: `🎉 Parabéns! Você perdeu ${Math.abs(weightChange).toFixed(1)} kg!`,
      type: 'success'
    };
  } else if (weightChange < -0.5) {
    return {
      message: `✅ Ótimo progresso! Você perdeu ${Math.abs(weightChange).toFixed(1)} kg!`,
      type: 'success'
    };
  } else if (weightChange > 2) {
    return {
      message: `⚠️ Atenção! Você ganhou ${weightChange.toFixed(1)} kg. Que tal revisar sua alimentação?`,
      type: 'warning'
    };
  } else if (weightChange > 0.5) {
    return {
      message: `📈 Você ganhou ${weightChange.toFixed(1)} kg. Continue focado no seu objetivo!`,
      type: 'warning'
    };
  } else {
    return {
      message: `💪 Peso estável! Consistência é a chave para o sucesso!`,
      type: 'info'
    };
  }
}