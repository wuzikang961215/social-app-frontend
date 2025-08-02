export const mbtiTypes = [
  { type: 'INTJ', name: '建筑师', description: '富有想象力和战略性的思想家' },
  { type: 'INTP', name: '逻辑学家', description: '富有创造力的发明家' },
  { type: 'ENTJ', name: '指挥官', description: '大胆、富有想象力的领导者' },
  { type: 'ENTP', name: '辩论家', description: '聪明好奇的思想者' },
  { type: 'INFJ', name: '提倡者', description: '安静而神秘的理想主义者' },
  { type: 'INFP', name: '调停者', description: '诗意、善良的利他主义者' },
  { type: 'ENFJ', name: '主人公', description: '富有感召力的领导者' },
  { type: 'ENFP', name: '竞选者', description: '热情、有创造力的自由精神' },
  { type: 'ISTJ', name: '物流师', description: '实际且注重事实的个人' },
  { type: 'ISFJ', name: '守卫者', description: '非常专注而温暖的守护者' },
  { type: 'ESTJ', name: '总经理', description: '出色的管理者' },
  { type: 'ESFJ', name: '执政官', description: '极有同情心的合作者' },
  { type: 'ISTP', name: '鉴赏家', description: '大胆而实际的实验家' },
  { type: 'ISFP', name: '探险家', description: '灵活而有魅力的艺术家' },
  { type: 'ESTP', name: '企业家', description: '聪明、精力充沛的冒险家' },
  { type: 'ESFP', name: '表演者', description: '自发的、精力充沛的表演者' }
];

export const getMBTIDisplay = (mbtiType: string | null | undefined): string => {
  if (!mbtiType) return '未填写';
  const mbtiInfo = mbtiTypes.find(t => t.type === mbtiType);
  return mbtiInfo ? `${mbtiType} ${mbtiInfo.name}` : mbtiType;
};