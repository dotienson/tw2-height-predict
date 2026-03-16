import {
  TableRow,
  table2_1,
  table2_2,
  table3_1a,
  table3_1b,
  table3_1c,
  table3_2a,
  table3_2b,
  table3_3a,
  table3_3b,
} from '../data/tables';

export type CalculationInput = {
  gender: 'male' | 'female';
  currentHeight: number;
  chronologicalAge: number;
  boneAgeRUS: number;
  hasPreviousData: boolean;
  deltaHeight?: number; // cm/yr
  deltaRUS?: number; // yr/yr
  isPostMenarche?: boolean;
  ageAtMenarche?: number;
};

export type CalculationResult = {
  predictedHeight: number;
  sd: number;
  tableName: string;
};

function findClosestRow(table: TableRow[], age: number): TableRow {
  if (table.length === 0) throw new Error('Empty table');
  
  // If age is greater than max age in table, use the last row
  if (age >= table[table.length - 1].age) {
    return table[table.length - 1];
  }
  
  // If age is less than min age in table, use the first row
  if (age <= table[0].age) {
    return table[0];
  }

  let closest = table[0];
  let minDiff = Math.abs(age - closest.age);
  
  for (const row of table) {
    const diff = Math.abs(age - row.age);
    if (diff < minDiff) {
      minDiff = diff;
      closest = row;
    }
  }
  
  return closest;
}

export function calculateAdultHeight(input: CalculationInput): CalculationResult {
  const {
    gender,
    currentHeight: H,
    chronologicalAge: CA,
    boneAgeRUS: RUS,
    hasPreviousData,
    deltaHeight: dH,
    deltaRUS: dRUS,
    isPostMenarche,
    ageAtMenarche: AM,
  } = input;

  const hasDH = hasPreviousData && dH !== undefined && !isNaN(dH);
  const hasDRUS = hasPreviousData && dRUS !== undefined && !isNaN(dRUS);
  const hasAM = isPostMenarche && AM !== undefined && !isNaN(AM);

  let selectedTable: TableRow[] = [];
  let tableName = '';

  if (gender === 'male') {
    if (CA < 11.0 || !hasDH) {
      selectedTable = table2_1;
      tableName = 'Bảng 02 (Table 2.1)';
    } else {
      selectedTable = table2_2;
      tableName = 'Bảng 03 (Table 2.2)';
    }
  } else {
    // Female
    if (CA < 8.0) {
      selectedTable = table3_1a;
      tableName = 'Bảng 04 (Table 3.1a)';
    } else if (!isPostMenarche) {
      // Pre-menarche
      if (hasDH && hasDRUS && CA >= 10.0) {
        selectedTable = table3_3a;
        tableName = 'Bảng 09 (Table 3.3a)';
      } else if (hasDH) {
        selectedTable = table3_2a;
        tableName = 'Bảng 07 (Table 3.2a)';
      } else {
        selectedTable = table3_1a;
        tableName = 'Bảng 04 (Table 3.1a)';
      }
    } else {
      // Post-menarche
      if (hasDH && hasDRUS && CA >= 11.5) {
        selectedTable = table3_3b;
        tableName = 'Bảng 10 (Table 3.3b)';
      } else if (hasDH) {
        selectedTable = table3_2b;
        tableName = 'Bảng 08 (Table 3.2b)';
      } else if (hasAM) {
        selectedTable = table3_1c;
        tableName = 'Bảng 06 (Table 3.1c)';
      } else {
        selectedTable = table3_1b;
        tableName = 'Bảng 05 (Table 3.1b)';
      }
    }
  }

  const row = findClosestRow(selectedTable, CA);

  const minAge = selectedTable[0].age;
  const maxAge = selectedTable[selectedTable.length - 1].age;
  
  if (CA < minAge || CA > maxAge) {
    throw new Error('OUT_OF_BOUNDS');
  }

  let predictedHeight = 0;
  
  // Base formula: a*H + b*CA + c*RUS + k
  predictedHeight = row.a * H + row.b * CA + row.c * RUS + row.k;

  // Add delta height if applicable
  if (row.d !== undefined && hasDH) {
    predictedHeight += row.d * dH;
  }

  // Add delta RUS if applicable
  if (row.e !== undefined && hasDRUS) {
    predictedHeight += row.e * dRUS;
  }

  // Add age at menarche if applicable
  if (row.f !== undefined && hasAM) {
    predictedHeight += row.f * AM;
  }

  return {
    predictedHeight,
    sd: row.sd,
    tableName: `${tableName} (Mốc tuổi: ${row.age})`,
  };
}
