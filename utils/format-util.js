export const formatComboBox = (itemData, cateCode, cateName) => {
  // Transform list data master to dropdown list
  const formatData = itemData.map(item => ({
    ...item,
    display: item[cateName] || item.categoryName || item.typeName || item.display,
    value: item[cateCode] || item.categoryCode || item.typeCode || item.value,
  }));
  return formatData;
};

export const formatDropdownList = (data, cateCode, cateName) => {
  // Format support display code + description
  const formatData = formatComboBox(data, cateCode, cateName).map(item => ({
    ...item,
    display: `${item.value} - ${item.display}`,
    item: `${item.value} - ${item.display}`,
  }));
  return formatData;
};

export const mapColumnAndDataForMessageSAP = data => {
  const messageTableTitle = 'Message from SAP';
  let columnsArray = [
    'TYPE',
    'MESSAGE',
    'MESSAGE_V1',
    'MESSAGE_V2',
    'MESSAGE_V3',
    'MESSAGE_V4',
    'PARAMETER',
    'ROW',
    'FIELD',
  ];

  let formatData = [];
  let dataArray = data;

  let messageTableColumns = columnsArray.map(item => ({
    title: item,
    field: item,
    width: item === 'TYPE' ? 60 : undefined,
  }));

  dataArray.forEach(item => {
    formatData.push(item.errorSAPRestVO);
  });

  let messageTableData = {
    data: formatData,
  };

  return {messageTableTitle, messageTableColumns, messageTableData};
};
