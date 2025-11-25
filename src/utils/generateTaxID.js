export const generateTaxID = (taxType, taxYear) => {
  const taxTypeMap = {
    "Yearly Tax": "0001",
    "Rice Tax": "0002", 
    "Asanam Tax": "0003",
    "Christmas Tax": "0004"
  };
  
  const typeCode = taxTypeMap[taxType];
  return `TID${taxYear}${typeCode}`;
};