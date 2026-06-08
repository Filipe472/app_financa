// Categorias de gastos com ícones e cores
export const CATEGORIES = [
  { id: 'alimentacao', label: 'Alimentação', icon: 'restaurant', color: '#FF6B6B' },
  { id: 'transporte', label: 'Transporte', icon: 'directions-car', color: '#4ECDC4' },
  { id: 'lazer', label: 'Lazer', icon: 'sports-esports', color: '#45B7D1' },
  { id: 'saude', label: 'Saúde', icon: 'local-hospital', color: '#96CEB4' },
  { id: 'educacao', label: 'Educação', icon: 'school', color: '#FFEAA7' },
  { id: 'moradia', label: 'Moradia', icon: 'home', color: '#DDA0DD' },
  { id: 'vestuario', label: 'Vestuário', icon: 'checkroom', color: '#F0E68C' },
  { id: 'contas', label: 'Contas', icon: 'receipt', color: '#FFB347' },
  { id: 'outros', label: 'Outros', icon: 'more-horiz', color: '#B0BEC5' },
];

export const getCategoryById = (id) => {
  return CATEGORIES.find((cat) => cat.id === id) || CATEGORIES[CATEGORIES.length - 1];
};
