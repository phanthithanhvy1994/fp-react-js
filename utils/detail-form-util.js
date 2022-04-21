export const updateConfigStep = (listStep, listDataChanged) => {
  const tempConfigStep = [...listStep];
  listDataChanged.forEach(el => {
    const index = tempConfigStep.findIndex(temp => temp.fieldName === el.fieldName);
    tempConfigStep[index] && (tempConfigStep[index] = {
      ...tempConfigStep[index],
      ...el
    });
  });
  return tempConfigStep;
}