export type TableRow = {
  age: number;
  a: number; // coef_height_cm
  b: number; // coef_chronological_age_yr
  c: number; // coef_bone_age_RUS_yr
  d?: number; // coef_delta_height_cm_per_year
  e?: number; // coef_delta_bone_age_yr_per_year
  f?: number; // coef_age_at_menarche_yr
  k: number; // constant
  sd: number; // residual_SD_cm
  r: number; // r
};

function parseCSV(csv: string, type: '3var' | '4var_dh' | '4var_am' | '5var'): TableRow[] {
  const lines = csv.trim().split('\n').slice(1);
  return lines.map(line => {
    const parts = line.split(',').map(Number);
    const row: any = {
      age: parts[0],
      a: parts[1],
      b: parts[2],
      c: parts[3],
    };
    
    if (type === '3var') {
      row.k = parts[4];
      row.sd = parts[5];
      row.r = parts[6];
    } else if (type === '4var_dh') {
      row.d = parts[4];
      row.k = parts[5];
      row.sd = parts[6];
      row.r = parts[7];
    } else if (type === '4var_am') {
      row.f = parts[4];
      row.k = parts[5];
      row.sd = parts[6];
      row.r = parts[7];
    } else if (type === '5var') {
      row.d = parts[4];
      row.e = parts[5];
      row.k = parts[6];
      row.sd = parts[7];
      row.r = parts[8];
    }
    return row as TableRow;
  });
}

// Table 2.1 (Male, 3 vars)
const table2_1_csv = `age_years,coef_height_cm,coef_chronological_age_yr,coef_bone_age_RUS_yr,constant,residual_SD_cm,r
6.0,+1.28,-7.5,-0.12,75,4.7,0.82
6.5,+1.25,-7.1,-0.13,75,4.7,0.82
7.0,+1.24,-6.6,-0.32,73,4.6,0.82
7.5,+1.28,-6.2,-0.67,69,4.6,0.82
8.0,+1.30,-5.8,-1.00,66,4.1,0.87
8.5,+1.27,-5.4,-1.25,68,4.1,0.87
9.0,+1.16,-5.0,-1.30,79,4.1,0.87
9.5,+1.13,-4.7,-1.25,80,4.1,0.87
10.0,+1.12,-4.4,-1.27,79,4.0,0.87
10.5,+1.12,-4.0,-1.50,77,4.0,0.87
11.0,+1.11,-3.6,-1.85,78,3.8,0.89
11.5,+1.09,-3.2,-2.37,82,3.8,0.89
12.0,+1.07,-2.8,-2.90,86,3.8,0.89
12.5,+1.04,-2.4,-3.45,92,3.8,0.89
13.0,+1.01,-2.1,-3.90,99,3.7,0.89
13.5,+0.98,-1.7,-4.25,104,3.7,0.89
14.0,+0.94,-1.4,-4.42,107,3.5,0.90
14.5,+0.87,-1.0,-4.17,108,3.5,0.90
15.0,+0.81,-0.8,-3.65,109,3.2,0.91
15.5,+0.80,-0.6,-3.07,98,3.2,0.91
16.0,+0.85,-0.4,-2.65,80,2.9,0.93
16.5,+0.90,-0.3,-2.27,64,2.9,0.93
17.0,+0.94,-0.2,-2.02,51,2.0,0.97
17.5,+0.96,-0.1,-1.90,43,2.0,0.97
18.0,+0.98,-0.0,-1.90,38,1.4,0.99
18.5,+0.98,-0.0,-1.90,37,1.4,0.99`;
export const table2_1 = parseCSV(table2_1_csv, '3var');

// Table 2.2 (Male, 4 vars + ΔH)
const table2_2_csv = `age_years,coef_height_cm,coef_chronological_age_yr,coef_bone_age_RUS_yr,coef_delta_height_cm_per_year,constant,residual_SD_cm,r
11.0,+1.19,-3.1,-1.50,-0.3,59,3.8,0.89
11.5,+1.20,-2.7,-1.92,-1.4,62,3.8,0.89
12.0,+1.15,-2.3,-2.73,-1.5,73,3.2,0.93
12.5,+1.09,-1.9,-3.03,-1.3,81,3.2,0.93
13.0,+1.03,-1.6,-3.57,-1.0,91,3.1,0.93
13.5,+0.99,-1.4,-4.17,-0.6,100,3.1,0.93
14.0,+0.95,-1.1,-4.73,-0.5,109,3.1,0.92
14.5,+0.92,-0.8,-4.82,-0.4,110,3.1,0.92
15.0,+0.89,-0.7,-3.68,-0.2,95,2.5,0.94
15.5,+0.83,-0.5,-2.58,-0.1,84,2.5,0.94
16.0,+0.78,-0.4,-2.25,0,84,2.8,0.91
16.5,+0.85,-0.4,-2.07,0,69,2.8,0.91
17.0,+0.93,-0.4,-1.90,0,54,1.6,0.97
17.5,+0.99,-0.3,-1.45,0,38,1.6,0.97
18.0,+1.01,-0.3,-0.55,0,14,0.7,0.99`;
export const table2_2 = parseCSV(table2_2_csv, '4var_dh');

// Table 3.1a (Female pre-menarche, 3 vars)
const table3_1a_csv = `age_years,coef_height_cm,coef_chronological_age_yr,coef_bone_age_RUS_yr,constant,residual_SD_cm,r
5.0,+0.89,-3.7,-0.80,90,3.7,0.78
5.5,+0.89,-3.5,-1.00,90,3.7,0.78
6.0,+0.89,-3.3,-1.15,89,3.5,0.80
6.5,+0.89,-3.1,-1.25,89,3.5,0.80
7.0,+0.89,-2.9,-1.33,87,3.5,0.82
7.5,+0.89,-2.6,-1.50,85,3.5,0.82
8.0,+0.89,-2.2,-1.73,84,3.4,0.85
8.5,+0.90,-1.9,-2.00,82,3.4,0.85
9.0,+0.92,-1.7,-2.40,81,3.6,0.85
9.5,+0.92,-1.6,-2.83,83,3.6,0.85
10.0,+0.91,-1.6,-3.03,86,3.3,0.87
10.5,+0.91,-1.7,-3.13,88,3.3,0.87
11.0,+0.91,-1.7,-3.33,90,3.0,0.90
11.5,+0.93,-1.7,-3.68,91,3.0,0.90
12.0,+0.96,-1.7,-3.90,89,3.0,0.90
12.5,+0.96,-1.6,-3.55,84,3.0,0.90
13.0,+0.94,-1.4,-3.15,79,2.9,0.94
13.5,+0.92,-1.0,-3.43,79,2.9,0.94
14.0,+0.90,-0.6,-3.65,79,2.4,0.95
14.5,+0.88,-0.1,-3.88,79,2.4,0.95`;
export const table3_1a = parseCSV(table3_1a_csv, '3var');

// Table 3.1b (Female post-menarche, 3 vars)
const table3_1b_csv = `age_years,coef_height_cm,coef_chronological_age_yr,coef_bone_age_RUS_yr,constant,residual_SD_cm,r
11.5,+0.98,-2.2,-1.05,49,1.9,0.96
12.0,+1.00,-1.4,-1.15,38,1.8,0.96
12.5,+1.00,-0.8,-1.35,32,1.8,0.96
13.0,+1.01,-0.2,-1.50,26,1.8,0.97
13.5,+1.02,-0.1,-1.45,21,1.8,0.97
14.0,+1.04,0.0,-1.25,15,1.4,0.98
14.5,+1.08,0.0,-1.00,5,1.4,0.98
15.0,+1.05,0.0,-0.70,4,0.9,0.99
15.5,+1.02,0.0,-0.75,10,0.9,0.99
16.0,+1.00,0.0,-1.35,22,1.1,0.99
16.5,+1.02,0.0,-1.95,28,1.1,0.99`;
export const table3_1b = parseCSV(table3_1b_csv, '3var');

// Table 3.1c (Female post-menarche + AM)
const table3_1c_csv = `age_years,coef_height_cm,coef_chronological_age_yr,coef_bone_age_RUS_yr,coef_age_at_menarche_yr,constant,residual_SD_cm,r
11.5,+1.05,-4.4,-0.12,+2.0,+29,1.9,0.96
12.0,+1.02,-3.5,-0.23,+1.6,+29,1.7,0.96
12.5,+0.98,-2.8,-0.60,+1.4,+34,1.7,0.96
13.0,+1.01,-2.2,-0.90,+1.3,+28,1.7,0.98
13.5,+1.05,-1.5,-0.68,+1.4,+7,1.7,0.98
14.0,+1.09,-0.8,-0.47,+1.3,-11,1.2,0.99
14.5,+1.12,-0.4,-0.48,+1.2,-20,1.2,0.99
15.0,+1.08,-0.2,-0.65,+0.7,-8,0.9,0.99
15.5,+1.02,0.0,-1.05,+0.1,+12,0.9,0.99
16.0,+1.00,0.0,-1.50,0.0,+24,1.1,0.99
16.5,+1.03,0.0,-2.00,0.0,+24,1.1,0.99`;
export const table3_1c = parseCSV(table3_1c_csv, '4var_am');

// Table 3.2a (Female pre-menarche, 4 vars + ΔH)
const table3_2a_csv = `age_years,coef_height_cm,coef_chronological_age_yr,coef_bone_age_RUS_yr,coef_delta_height_cm_per_year,constant,residual_SD_cm,r
8.0,+0.80,-3.4,-1.80,+1.1,99,3.2,0.87
8.5,+0.90,-3.2,-1.95,-1.0,98,3.2,0.87
9.0,+0.95,-2.9,-2.15,-2.0,96,3.2,0.87
9.5,+0.97,-2.7,-2.30,-1.8,92,3.2,0.87
10.0,+0.94,-2.4,-2.35,-1.6,92,3.2,0.87
10.5,+0.89,-2.2,-2.40,-1.3,95,2.9,0.92
11.0,+0.91,-1.9,-2.45,-1.3,90,2.9,0.92
11.5,+0.94,-1.7,-2.90,-1.3,88,2.9,0.92
12.0,+0.96,-1.4,-3.55,-0.9,86,3.0,0.81
12.5,+0.98,-1.2,-3.80,-0.4,80,3.0,0.81`;
export const table3_2a = parseCSV(table3_2a_csv, '4var_dh');

// Table 3.2b (Female post-menarche, 4 vars + ΔH)
const table3_2b_csv = `age_years,coef_height_cm,coef_chronological_age_yr,coef_bone_age_RUS_yr,coef_delta_height_cm_per_year,constant,residual_SD_cm,r
11.5,+0.99,-1.5,-0.00,+0.6,20,1.5,0.96
12.0,+1.05,-1.1,-0.00,+0.8,6,1.1,0.98
12.5,+1.02,-0.7,-0.00,+1.0,5,1.1,0.98
13.0,+1.00,-0.5,-0.00,+1.0,6,1.2,0.98
13.5,+0.99,-0.2,-0.00,+1.0,3,1.2,0.98
14.0,+1.00,-0.1,-0.00,+0.9,1,0.8,0.99
14.5,+1.01,-0.1,-0.15,+0.8,2,0.8,0.99
15.0,+1.03,-0.0,-0.50,+0.6,3,0.5,0.99
15.5,+1.07,-0.0,-0.90,+0.1,4,0.5,0.99
16.0,+1.10,-0.0,-1.30,+0.0,5,0.4,0.99`;
export const table3_2b = parseCSV(table3_2b_csv, '4var_dh');

// Table 3.3a (Female pre-menarche, 5 vars + ΔH + ΔRUS)
const table3_3a_csv = `age_years,coef_height_cm,coef_chronological_age_yr,coef_bone_age_RUS_yr,coef_delta_height_cm_per_year,coef_delta_bone_age_yr_per_year,constant,residual_SD_cm,r
10.0,+0.92,-2.4,-2.50,-1.6,+0.3,+95,3.0,0.87
10.5,+0.92,-2.3,-2.75,-1.4,+0.8,+94,3.0,0.87
11.0,+0.91,-1.8,-2.95,-1.3,+1.2,+93,2.7,0.89
11.5,+0.87,-1.5,-3.20,-1.1,+1.6,+95,2.7,0.89
12.0,+0.85,-1.1,-3.60,-0.8,+1.9,+96,2.6,0.89
12.5,+0.88,-0.7,-3.90,-0.5,+2.1,+89,2.6,0.89
13.0,+0.97,-0.5,-4.15,-0.3,+2.2,+74,2.1,0.93
13.5,+1.09,-0.3,-4.35,-0.2,+2.5,+54,2.1,0.93
14.0,+1.21,-0.1,-4.55,-0.1,+2.6,+35,1.8,0.95
14.5,+1.31,-0.0,-4.75,-0.1,+2.7,+19,1.8,0.95`;
export const table3_3a = parseCSV(table3_3a_csv, '5var');

// Table 3.3b (Female post-menarche, 5 vars + ΔH + ΔRUS)
const table3_3b_csv = `age_years,coef_height_cm,coef_chronological_age_yr,coef_bone_age_RUS_yr,coef_delta_height_cm_per_year,coef_delta_bone_age_yr_per_year,constant,residual_SD_cm,r
11.5,+1.11,-0.0,-0.50,+0.7,+2.2,-14,1.2,0.98
12.0,+1.07,-0.0,-0.40,+0.7,+1.5,-7,1.1,0.98
12.5,+1.03,-0.0,-0.40,+0.8,+0.9,-7,1.1,0.98
13.0,+1.00,-0.0,-0.25,+0.8,+0.5,+4,1.1,0.98
13.5,+0.99,-0.0,-0.20,+0.8,+0.3,+4,1.1,0.98`;
export const table3_3b = parseCSV(table3_3b_csv, '5var');
