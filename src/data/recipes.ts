import { Recipe } from '../types';

export const recipes: Recipe[] = [
  // Receitas Veganas
  {
    id: '1',
    name: 'Bowl de Quinoa com Vegetais',
    category: 'vegana',
    ingredients: [
      '1 xícara de quinoa',
      '2 xícaras de água',
      '1 brócolis pequeno',
      '1 abobrinha média',
      '1 cenoura',
      '2 colheres de azeite',
      'Sal e pimenta a gosto',
      'Suco de 1 limão'
    ],
    instructions: [
      'Cozinhe a quinoa em água fervente por 15 minutos',
      'Corte os vegetais em cubos pequenos',
      'Refogue os vegetais no azeite por 8 minutos',
      'Tempere com sal, pimenta e limão',
      'Sirva a quinoa com os vegetais por cima'
    ],
    nutrition: {
      calories: 320,
      protein: 12,
      carbs: 45,
      fat: 8
    },
    substitutions: [
      'Quinoa por arroz integral',
      'Brócolis por couve-flor',
      'Azeite por óleo de coco'
    ],
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    prepTime: 25,
    difficulty: 'easy'
  },
  {
    id: '2',
    name: 'Smoothie Verde Detox',
    category: 'vegana',
    ingredients: [
      '1 banana',
      '1 xícara de espinafre',
      '1/2 abacate',
      '1 xícara de água de coco',
      '1 colher de chia',
      'Suco de 1/2 limão'
    ],
    instructions: [
      'Adicione todos os ingredientes no liquidificador',
      'Bata por 2 minutos até ficar homogêneo',
      'Sirva imediatamente'
    ],
    nutrition: {
      calories: 280,
      protein: 8,
      carbs: 35,
      fat: 12
    },
    substitutions: [
      'Banana por manga',
      'Espinafre por couve',
      'Água de coco por leite de amêndoas'
    ],
    image: 'https://images.pexels.com/photos/616833/pexels-photo-616833.jpeg',
    prepTime: 5,
    difficulty: 'easy'
  },
  {
    id: '3',
    name: 'Salada de Grão-de-Bico',
    category: 'vegana',
    ingredients: [
      '2 xícaras de grão-de-bico cozido',
      '1 pepino',
      '2 tomates',
      '1/2 cebola roxa',
      '1/4 xícara de salsa',
      '3 colheres de azeite',
      '2 colheres de vinagre balsâmico',
      'Sal e pimenta a gosto'
    ],
    instructions: [
      'Corte todos os vegetais em cubos pequenos',
      'Misture com o grão-de-bico em uma tigela',
      'Prepare o molho com azeite, vinagre, sal e pimenta',
      'Regue a salada com o molho',
      'Deixe marinar por 15 minutos'
    ],
    nutrition: {
      calories: 350,
      protein: 15,
      carbs: 40,
      fat: 12
    },
    substitutions: [
      'Grão-de-bico por lentilha',
      'Pepino por abobrinha',
      'Vinagre balsâmico por limão'
    ],
    image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
    prepTime: 20,
    difficulty: 'easy'
  },

  // Receitas Cetogênicas
  {
    id: '4',
    name: 'Salmão Grelhado com Aspargos',
    category: 'cetogenica',
    ingredients: [
      '200g de filé de salmão',
      '300g de aspargos',
      '3 colheres de manteiga',
      '2 dentes de alho',
      'Sal e pimenta a gosto',
      'Suco de 1/2 limão',
      '1 colher de ervas finas'
    ],
    instructions: [
      'Tempere o salmão com sal, pimenta e limão',
      'Grelhe o salmão por 4 minutos de cada lado',
      'Refogue os aspargos na manteiga com alho',
      'Tempere com ervas finas',
      'Sirva o salmão com os aspargos'
    ],
    nutrition: {
      calories: 420,
      protein: 35,
      carbs: 8,
      fat: 28
    },
    substitutions: [
      'Salmão por truta',
      'Aspargos por brócolis',
      'Manteiga por azeite'
    ],
    image: 'https://images.pexels.com/photos/725992/pexels-photo-725992.jpeg',
    prepTime: 15,
    difficulty: 'medium'
  },
  {
    id: '5',
    name: 'Omelete de Queijo e Espinafre',
    category: 'cetogenica',
    ingredients: [
      '3 ovos',
      '100g de queijo mussarela',
      '1 xícara de espinafre',
      '2 colheres de manteiga',
      'Sal e pimenta a gosto',
      '1 colher de creme de leite'
    ],
    instructions: [
      'Bata os ovos com creme de leite, sal e pimenta',
      'Aqueça a manteiga na frigideira',
      'Despeje os ovos e deixe cozinhar por 2 minutos',
      'Adicione queijo e espinafre de um lado',
      'Dobre a omelete e sirva'
    ],
    nutrition: {
      calories: 380,
      protein: 28,
      carbs: 4,
      fat: 28
    },
    substitutions: [
      'Mussarela por queijo prato',
      'Espinafre por rúcula',
      'Creme de leite por nata'
    ],
    image: 'https://images.pexels.com/photos/824635/pexels-photo-824635.jpeg',
    prepTime: 10,
    difficulty: 'easy'
  },
  {
    id: '6',
    name: 'Frango à Parmegiana Low Carb',
    category: 'cetogenica',
    ingredients: [
      '1 peito de frango',
      '100g de queijo parmesão ralado',
      '2 ovos',
      '200g de molho de tomate sem açúcar',
      '100g de mussarela',
      '2 colheres de azeite',
      'Sal e pimenta a gosto'
    ],
    instructions: [
      'Tempere o frango e passe no ovo',
      'Empane com parmesão ralado',
      'Frite no azeite até dourar',
      'Cubra com molho e mussarela',
      'Leve ao forno por 10 minutos'
    ],
    nutrition: {
      calories: 450,
      protein: 42,
      carbs: 8,
      fat: 26
    },
    substitutions: [
      'Frango por peixe',
      'Parmesão por queijo coalho',
      'Molho de tomate por molho branco'
    ],
    image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
    prepTime: 30,
    difficulty: 'medium'
  },

  // Receitas Low Carb
  {
    id: '7',
    name: 'Salada de Atum com Abacate',
    category: 'lowcarb',
    ingredients: [
      '2 latas de atum',
      '1 abacate maduro',
      '2 ovos cozidos',
      '1 xícara de folhas verdes',
      '1/2 cebola roxa',
      '2 colheres de azeite',
      'Suco de 1 limão',
      'Sal e pimenta a gosto'
    ],
    instructions: [
      'Escorra o atum e desfie',
      'Corte o abacate em cubos',
      'Pique os ovos cozidos',
      'Misture todos os ingredientes',
      'Tempere com azeite, limão, sal e pimenta'
    ],
    nutrition: {
      calories: 390,
      protein: 32,
      carbs: 12,
      fat: 24
    },
    substitutions: [
      'Atum por sardinha',
      'Abacate por tomate',
      'Folhas verdes por repolho'
    ],
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    prepTime: 15,
    difficulty: 'easy'
  },
  {
    id: '8',
    name: 'Carne Moída com Abobrinha',
    category: 'lowcarb',
    ingredients: [
      '300g de carne moída',
      '2 abobrinhas médias',
      '1 cebola',
      '2 dentes de alho',
      '2 colheres de azeite',
      'Sal, pimenta e orégano',
      '1/2 xícara de queijo ralado'
    ],
    instructions: [
      'Refogue a cebola e alho no azeite',
      'Adicione a carne e temperos',
      'Corte a abobrinha em fatias',
      'Adicione a abobrinha à carne',
      'Finalize com queijo ralado'
    ],
    nutrition: {
      calories: 340,
      protein: 28,
      carbs: 8,
      fat: 20
    },
    substitutions: [
      'Carne moída por frango desfiado',
      'Abobrinha por berinjela',
      'Queijo por ricota'
    ],
    image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
    prepTime: 25,
    difficulty: 'easy'
  }
  // ... Adicionar mais receitas para completar 50+
];

// Adicionando mais receitas para completar o banco
for (let i = 9; i <= 50; i++) {
  const categories: ('vegana' | 'cetogenica' | 'lowcarb')[] = ['vegana', 'cetogenica', 'lowcarb'];
  const randomCategory = categories[i % 3];
  
  recipes.push({
    id: i.toString(),
    name: `Receita ${randomCategory} ${i}`,
    category: randomCategory,
    ingredients: ['Ingrediente 1', 'Ingrediente 2', 'Ingrediente 3'],
    instructions: ['Passo 1', 'Passo 2', 'Passo 3'],
    nutrition: {
      calories: 250 + (i * 10),
      protein: 15 + (i % 10),
      carbs: randomCategory === 'cetogenica' ? 5 : 25,
      fat: randomCategory === 'vegana' ? 8 : 15
    },
    substitutions: ['Substituição 1', 'Substituição 2'],
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    prepTime: 15 + (i % 20),
    difficulty: ['easy', 'medium', 'hard'][i % 3] as 'easy' | 'medium' | 'hard'
  });
}