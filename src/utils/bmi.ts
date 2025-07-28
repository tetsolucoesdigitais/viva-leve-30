import { BMIResult } from '../types';

export function calculateBMI(weight: number, height: number): BMIResult {
  const bmi = weight / (height * height);
  
  let classification: string;
  let message: string;
  let color: string;

  if (bmi < 18.5) {
    classification = 'Baixo peso';
    message = 'Que tal adicionar mais calorias saudáveis à sua dieta? Consulte um nutricionista!';
    color = 'text-blue-600';
  } else if (bmi < 25) {
    classification = 'Peso normal';
    message = 'Parabéns! Seu peso está na faixa ideal. Continue mantendo hábitos saudáveis!';
    color = 'text-green-600';
  } else if (bmi < 30) {
    classification = 'Sobrepeso';
    message = 'Você está no caminho certo! Com dedicação e as receitas certas, logo alcançará seu objetivo!';
    color = 'text-yellow-600';
  } else {
    classification = 'Obesidade';
    message = 'Não desista! Cada pequeno passo conta. Estamos aqui para te apoiar nessa jornada!';
    color = 'text-red-600';
  }

  return {
    bmi: Math.round(bmi * 10) / 10,
    classification,
    message,
    color
  };
}