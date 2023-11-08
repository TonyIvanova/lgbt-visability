export const topicsMap = {
    'Экономическое положение': 'economical_status',
    'Насилие': 'violence',
    'Дискриминация': 'discrimination',
    'Влияние войны в Украине': 'war_effects',
    'Открытость': 'opennes'
  }

  
export async function


const parseBarData = (res) => {
    if (res?.length === 0) return [];
    const fields = Object.keys(res[0])
      .filter((key) => key !== "District" && key !== "All")
      .map((key) => {
        return key;
      });
    const values = res.find((row) => row.District === "Все");
    const result = fields.map((field) => {
      return { name: field, value: parseFloat(values[field]) };
    });
    return result;
  };

  const parsePieData = (res) => {
    if (res?.length === 0) return [];
    const fields = Object.keys(res[0])
      .filter((key) => key !== "District" && key !== "All")
      .map((key) => {
        return key;
      });
    const values = res.find((row) => row.District === "Все");
    const result = fields.map((field) => {
      return { name: field, value: parseFloat(values[field]) };
    });
    return result;
  };

  const parseMapData = (res) => {
    const result = res.map((row) => {
      return {
        name: row.District,
        value: parseFloat(row[selectedQuestion]),
      };
    });
    return result;
  };


export  function getSubsetSheetName(whuchSubset, name) {
    switch (whuchSubset) {
      case 'cis':
        return name+whuchSubset;
      case 'trans':
        return name+whuchSubset;
      default:
        return name+'openness_friends';
    }
  }


export function getOpennessSheetName(opennessGroup) {
    switch (opennessGroup) {
      case 'family':
        return 'openness_family';
      case 'ass':
        return 'openness_associates';
      default:
        return 'openness_friends'; 
    }
  }