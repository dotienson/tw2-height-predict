/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, Info, Calendar, Ruler, Activity, Baby, Users, Lock, Unlock, Copy, Check, Globe, AlertCircle } from 'lucide-react';
import { calculateAdultHeight, CalculationInput } from './utils/calculator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DateInput } from './components/DateInput';
import { differenceInMonths, parse } from 'date-fns';

type Language = 'vi' | 'en';

const translations = {
  vi: {
    title: 'Tanner Whitehouse Mark II',
    subtitle: '',
    author: 'ThS.BS. Đỗ Tiến Sơn © 2026',
    warningTitle: 'LƯU Ý KHI SỬ DỤNG',
    warningText: 'Ứng dụng đang thử nghiệm\nChỉ sủ dụng tham khảo nội bộ',
    unlock: 'Đồng ý & Bắt đầu',
    basicInfo: 'Thông tin cơ bản',
    gender: 'Giới tính',
    male: 'Nam',
    female: 'Nữ',
    currentHeight: 'Chiều cao hiện tại (cm)',
    chronologicalAge: 'Tuổi thực (năm)',
    boneAge: 'Tuổi xương hiện tại (năm)',
    menarcheStatus: 'Tình trạng kinh nguyệt',
    preMenarche: 'Chưa có kinh nguyệt',
    postMenarche: 'Đã có kinh nguyệt',
    ageAtMenarche: 'Tuổi có kinh lần đầu (năm)',
    optional: '(Tuỳ chọn)',
    previousData: 'Dữ liệu lần khám trước',
    hasData: 'Có dữ liệu',
    monthsSince: 'Khoảng cách (tháng)',
    prevHeight: 'Chiều cao lần trước (cm)',
    prevBoneAge: 'Tuổi xương lần trước',
    parentsHeight: 'Chiều cao bố mẹ',
    parentsHeightDesc: '',
    fatherHeight: 'Chiều cao của Bố (cm)',
    motherHeight: 'Chiều cao của Mẹ (cm)',
    calculateBtn: 'Tính toán dự đoán',
    resultTitle: 'Kết quả dự đoán PAH theo TW2',
    predictedHeight: 'Chiều cao trưởng thành',
    predictionRange: 'Khoảng dự đoán (±1 SD):',
    formulaInfo: 'Thông tin công thức',
    coefficientTable: 'Bảng hệ số:',
    sd: 'Độ lệch chuẩn (SD):',
    chartTitle: 'Biểu đồ so sánh',
    diff: 'Độ chênh lệch:',
    conclusionTitle: 'Kết luận sơ bộ:',
    copyBtn: 'Copy kết quả',
    copied: 'Đã copy!',
    errorMissing: 'Vui lòng nhập đầy đủ các thông số bắt buộc (Chiều cao, Tuổi thực, Tuổi xương).',
    errorLogic: 'Kiểm tra lại thông số đã nhập',
    errorBounds: 'Không có tham số phù hợp',
    errorGeneral: 'Có lỗi xảy ra khi tính toán. Vui lòng kiểm tra lại dữ liệu nhập.',
    highDiffWarning: 'Độ chênh so với MPH lớn, cần kiểm tra lại!',
    conclusionText: (pred: string, sd: string, mph: string) => `Nếu xét theo phương pháp Tanner Whitehouse Mark II, chiều cao dự đoán khi trưởng thành là ${pred} +/- ${sd}cm (MPH ${mph}cm +/- 7cm). Kết quả dựa theo công thức toán học, không mang tính tiên đoán, phục vụ theo dõi lâm sàng.`,
    warnHeight: 'Chiều cao nên trong khoảng 50-190 cm',
    warnAge: 'Tuổi thực nên trong khoảng 1-20 năm',
    warnBoneAge: 'Tuổi xương nên trong khoảng 1-19 năm',
    warnMenarche: 'Tuổi có kinh nên trong khoảng 9-16 năm',
    warnPrevHeight: 'Chiều cao lần trước phải nhỏ hơn chiều cao hiện tại',
    warnPrevBoneAge: 'Tuổi xương lần trước phải nhỏ hơn tuổi xương hiện tại'
  },
  en: {
    title: 'Tanner Whitehouse Mark II',
    subtitle: '',
    author: 'ThS.BS. Đỗ Tiến Sơn © 2026',
    warningTitle: 'USAGE NOTICE',
    warningText: 'Application is in testing phase\nFor internal reference only.',
    unlock: 'Agree & Start',
    basicInfo: 'Basic Information',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    currentHeight: 'Current Height (cm)',
    chronologicalAge: 'Chronological Age (years)',
    boneAge: 'Current Bone Age (years)',
    menarcheStatus: 'Menarche Status',
    preMenarche: 'Pre-menarche',
    postMenarche: 'Post-menarche',
    ageAtMenarche: 'Age at Menarche (years)',
    optional: '(Optional)',
    previousData: 'Previous Visit Data',
    hasData: 'Has Data',
    monthsSince: 'Interval (months)',
    prevHeight: 'Previous Height (cm)',
    prevBoneAge: 'Previous Bone Age',
    parentsHeight: 'Parents Height',
    parentsHeightDesc: '',
    fatherHeight: "Father's Height (cm)",
    motherHeight: "Mother's Height (cm)",
    calculateBtn: 'Calculate Prediction',
    resultTitle: 'PAH Prediction Result (TW2)',
    predictedHeight: 'Adult Height',
    predictionRange: 'Prediction Range (±1 SD):',
    formulaInfo: 'Formula Information',
    coefficientTable: 'Coefficient Table:',
    sd: 'Standard Deviation (SD):',
    chartTitle: 'Comparison Chart',
    diff: 'Difference:',
    conclusionTitle: 'Preliminary Conclusion:',
    copyBtn: 'Copy Result',
    copied: 'Copied!',
    errorMissing: 'Please fill in all required fields (Height, Chronological Age, Bone Age).',
    errorLogic: 'Please check the entered parameters again',
    errorBounds: 'No suitable parameters found',
    errorGeneral: 'An error occurred during calculation. Please check your input.',
    highDiffWarning: 'Large difference from MPH, please double check!',
    conclusionText: (pred: string, sd: string, mph: string) => `Based on the Tanner Whitehouse Mark II method, the predicted adult height is ${pred} +/- ${sd}cm (MPH ${mph}cm +/- 7cm). This result is based on a mathematical formula, is not predictive, and is for clinical monitoring purposes.`,
    warnHeight: 'Height should be between 50-190 cm',
    warnAge: 'Chronological age should be between 1-20 years',
    warnBoneAge: 'Bone age should be between 1-19 years',
    warnMenarche: 'Menarche age should be between 9-16 years',
    warnPrevHeight: 'Previous height must be less than current height',
    warnPrevBoneAge: 'Previous bone age must be less than current bone age'
  }
};

export default function App() {
  const [lang, setLang] = useState<Language>('vi');
  const t = translations[lang];

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [copied, setCopied] = useState(false);

  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [currentHeight, setCurrentHeight] = useState<string>('');
  
  const [ageInputMode, setAgeInputMode] = useState<'manual' | 'dob'>('manual');
  const [chronologicalAge, setChronologicalAge] = useState<string>('');
  const [manualAgeYears, setManualAgeYears] = useState<string>('');
  const [manualAgeMonths, setManualAgeMonths] = useState<string>('');
  
  const [dob, setDob] = useState({ day: '', month: '', year: '' });
  const [examDate, setExamDate] = useState({ day: '', month: '', year: '' });
  const [calculatedAgeDisplay, setCalculatedAgeDisplay] = useState('');

  const [boneAgeRUS, setBoneAgeRUS] = useState<string>('');
  
  const [hasPreviousData, setHasPreviousData] = useState(false);
  const [previousHeight, setPreviousHeight] = useState<string>('');
  const [previousBoneAgeRUS, setPreviousBoneAgeRUS] = useState<string>('');
  const [monthsSincePrevious, setMonthsSincePrevious] = useState<string>('12');

  const [isPostMenarche, setIsPostMenarche] = useState(false);
  const [ageAtMenarche, setAgeAtMenarche] = useState<string>('');

  const [fatherHeight, setFatherHeight] = useState<string>('');
  const [motherHeight, setMotherHeight] = useState<string>('');

  const [result, setResult] = useState<{ predictedHeight: number; sd: number; tableName: string; mph: number | null } | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  // Auto-calculate age from dates or manual inputs
  useEffect(() => {
    if (ageInputMode === 'manual') {
      const y = parseFloat(manualAgeYears) || 0;
      const m = parseFloat(manualAgeMonths) || 0;
      if (manualAgeYears === '' && manualAgeMonths === '') {
        setChronologicalAge('');
        setCalculatedAgeDisplay('');
      } else {
        setChronologicalAge((y + m / 12).toFixed(2));
        setCalculatedAgeDisplay(`${Math.floor(y)} tuổi ${Math.floor(m)} tháng`);
      }
    } else if (ageInputMode === 'dob' && dob.day && dob.month && dob.year && examDate.day && examDate.month && examDate.year) {
      const dobDate = parse(`${dob.year}-${dob.month}-${dob.day}`, 'yyyy-MM-dd', new Date());
      const examDateObj = parse(`${examDate.year}-${examDate.month}-${examDate.day}`, 'yyyy-MM-dd', new Date());
      
      if (!isNaN(dobDate.getTime()) && !isNaN(examDateObj.getTime())) {
        const diffMonths = differenceInMonths(examDateObj, dobDate);
        if (diffMonths > 0) {
          const years = diffMonths / 12;
          setChronologicalAge(years.toFixed(2));
          const y = Math.floor(diffMonths / 12);
          const m = diffMonths % 12;
          setCalculatedAgeDisplay(`${y} tuổi ${m} tháng`);
        } else {
          setCalculatedAgeDisplay('Ngày khám phải sau ngày sinh');
        }
      }
    }
  }, [dob, examDate, ageInputMode, manualAgeYears, manualAgeMonths]);

  // Validation warnings
  const warnings = useMemo(() => {
    const w: string[] = [];
    const H = parseFloat(currentHeight);
    const CA = parseFloat(chronologicalAge);
    const RUS = parseFloat(boneAgeRUS);
    const AM = parseFloat(ageAtMenarche);
    const H_prev = parseFloat(previousHeight);
    const RUS_prev = parseFloat(previousBoneAgeRUS);

    if (currentHeight && (isNaN(H) || H < 50 || H > 190)) w.push(t.warnHeight);
    if (chronologicalAge && (isNaN(CA) || CA < 1 || CA > 20)) w.push(t.warnAge);
    if (boneAgeRUS && (isNaN(RUS) || RUS < 1 || RUS > 19)) w.push(t.warnBoneAge);
    
    if (gender === 'female' && isPostMenarche && ageAtMenarche && (isNaN(AM) || AM < 9 || AM > 16)) {
      w.push(t.warnMenarche);
    }

    if (hasPreviousData) {
      if (previousHeight && currentHeight && !isNaN(H) && !isNaN(H_prev) && H_prev >= H) {
        w.push(t.warnPrevHeight);
      }
      if (previousBoneAgeRUS && boneAgeRUS && !isNaN(RUS) && !isNaN(RUS_prev) && RUS_prev >= RUS) {
        w.push(t.warnPrevBoneAge);
      }
    }
    return w;
  }, [currentHeight, chronologicalAge, boneAgeRUS, gender, isPostMenarche, ageAtMenarche, hasPreviousData, previousHeight, previousBoneAgeRUS, t]);

  // Auto-calculate when inputs change
  useEffect(() => {
    setCalcError(null);
    setResult(null);

    const H = parseFloat(currentHeight);
    const CA = parseFloat(chronologicalAge);
    const RUS = parseFloat(boneAgeRUS);

    if (isNaN(H) || isNaN(CA) || isNaN(RUS)) return;
    if (warnings.length > 0) return; // Don't calculate if there are basic logic errors

    let dH: number | undefined = undefined;
    let dRUS: number | undefined = undefined;

    if (hasPreviousData) {
      const H_prev = parseFloat(previousHeight);
      const RUS_prev = parseFloat(previousBoneAgeRUS);
      const months = parseFloat(monthsSincePrevious);

      if (!isNaN(months) && months > 0) {
        const dt = months / 12;
        if (!isNaN(H_prev)) {
          dH = (H - H_prev) / dt;
        }
        if (!isNaN(RUS_prev)) {
          dRUS = (RUS - RUS_prev) / dt;
        }
      }
    }

    const AM = parseFloat(ageAtMenarche);

    const input: CalculationInput = {
      gender,
      currentHeight: H,
      chronologicalAge: CA,
      boneAgeRUS: RUS,
      hasPreviousData,
      deltaHeight: dH,
      deltaRUS: dRUS,
      isPostMenarche,
      ageAtMenarche: isNaN(AM) ? undefined : AM,
    };

    let mph: number | null = null;
    const fH = parseFloat(fatherHeight);
    const mH = parseFloat(motherHeight);
    if (!isNaN(fH) && !isNaN(mH)) {
      if (gender === 'male') {
        mph = (fH + mH + 13) / 2;
      } else {
        mph = (fH + mH - 13) / 2;
      }
    }

    try {
      const res = calculateAdultHeight(input);
      setResult({ ...res, mph });
    } catch (error: any) {
      if (error.message === 'OUT_OF_BOUNDS') {
        setCalcError(t.errorBounds);
      } else {
        console.error(error);
        setCalcError(t.errorGeneral);
      }
    }
  }, [currentHeight, chronologicalAge, boneAgeRUS, gender, hasPreviousData, previousHeight, previousBoneAgeRUS, monthsSincePrevious, isPostMenarche, ageAtMenarche, fatherHeight, motherHeight, warnings, t]);

  const handleCopy = () => {
    if (!result || !result.mph) return;
    const text = t.conclusionText(result.predictedHeight.toFixed(1), result.sd.toString(), result.mph.toFixed(1));
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const themeColor = gender === 'male' ? 'blue' : 'pink';
  const bgClass = gender === 'male' ? 'bg-blue-50' : 'bg-pink-50';
  const borderClass = gender === 'male' ? 'border-blue-200' : 'border-pink-200';
  const textClass = gender === 'male' ? 'text-blue-900' : 'text-pink-900';
  const btnClass = gender === 'male' ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : 'bg-pink-600 hover:bg-pink-700 focus:ring-pink-500';
  const iconClass = gender === 'male' ? 'text-blue-500' : 'text-pink-500';
  const chartColor = gender === 'male' ? '#3b82f6' : '#ec4899';

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Info className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">{t.warningTitle}</h2>
            <p className="text-slate-600 text-sm mb-8 leading-relaxed whitespace-pre-line">
              {t.warningText}
            </p>
            <button
              onClick={() => setIsUnlocked(true)}
              className="w-full inline-flex items-center justify-center px-6 py-3 font-medium text-white bg-blue-600 rounded-xl transition-colors hover:bg-blue-700"
            >
              {t.unlock}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgClass} py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-900 transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto">
        {/* Language Switcher */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
            className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Globe className="w-4 h-4" />
            {lang === 'vi' ? 'EN' : 'VI'}
          </button>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl tracking-tight">
            {t.title}
          </h1>
          {t.subtitle && (
            <p className="mt-2 text-lg text-slate-600 font-medium">
              {t.subtitle}
            </p>
          )}
          <p className="mt-2 text-base font-medium text-slate-600">
            {t.author}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Inputs */}
          <div className={`bg-white rounded-2xl shadow-sm border ${borderClass} overflow-hidden transition-colors duration-500 h-fit`}>
            <div className="p-6 sm:p-8">
              <div className="space-y-8">
                
                {/* Warnings Display */}
                {warnings.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
                    {warnings.map((w, i) => (
                      <div key={i} className="flex items-start gap-2 text-amber-800 text-sm">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{w}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Section 1: Basic Info */}
              <div className="space-y-6">
                <h2 className={`text-xl font-semibold ${textClass} flex items-center gap-2 border-b pb-2`}>
                  <Baby className={`w-5 h-5 ${iconClass}`} />
                  {t.basicInfo}
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t.gender}</label>
                    <div className="flex rounded-lg shadow-sm">
                      <button
                        type="button"
                        onClick={() => setGender('male')}
                        className={`flex-1 py-2.5 text-sm font-medium rounded-l-lg border ${
                          gender === 'male'
                            ? 'bg-blue-50 border-blue-200 text-blue-700 z-10'
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {t.male}
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender('female')}
                        className={`flex-1 py-2.5 text-sm font-medium rounded-r-lg border-y border-r border-l-0 ${
                          gender === 'female'
                            ? 'bg-pink-50 border-pink-200 text-pink-700 z-10'
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {t.female}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t.currentHeight} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Ruler className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={currentHeight}
                        onChange={(e) => setCurrentHeight(e.target.value)}
                        className="focus:ring-slate-500 focus:border-slate-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2.5 border"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t.chronologicalAge} <span className="text-red-500">*</span>
                    </label>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <label className="flex items-center gap-2 text-sm text-slate-600">
                        <input 
                          type="radio" 
                          checked={ageInputMode === 'manual'} 
                          onChange={() => setAgeInputMode('manual')}
                          className={`focus:ring-${themeColor}-500 text-${themeColor}-600`}
                        />
                        Nhập thủ công
                      </label>
                      <label className="flex items-center gap-2 text-sm text-slate-600">
                        <input 
                          type="radio" 
                          checked={ageInputMode === 'dob'} 
                          onChange={() => setAgeInputMode('dob')}
                          className={`focus:ring-${themeColor}-500 text-${themeColor}-600`}
                        />
                        Tính từ ngày sinh
                      </label>
                    </div>

                    {ageInputMode === 'manual' ? (
                      <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="block text-xs text-slate-500 mb-1">Tuổi (năm)</label>
                            <input
                              type="number"
                              min="0"
                              value={manualAgeYears}
                              onChange={(e) => setManualAgeYears(e.target.value)}
                              className="focus:ring-slate-500 focus:border-slate-500 block w-full sm:text-sm border-slate-300 rounded-lg py-2 border px-3"
                              placeholder="VD: 10"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs text-slate-500 mb-1">Tháng</label>
                            <input
                              type="number"
                              min="0"
                              max="11"
                              value={manualAgeMonths}
                              onChange={(e) => setManualAgeMonths(e.target.value)}
                              className="focus:ring-slate-500 focus:border-slate-500 block w-full sm:text-sm border-slate-300 rounded-lg py-2 border px-3"
                              placeholder="VD: 6"
                            />
                          </div>
                        </div>
                        {calculatedAgeDisplay && (
                          <div className="text-sm font-medium text-indigo-600 mt-2">
                            {calculatedAgeDisplay} {chronologicalAge && `(${chronologicalAge} năm)`}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Ngày sinh</label>
                          <DateInput 
                            day={dob.day} month={dob.month} year={dob.year}
                            onChange={(f, v) => setDob(p => ({ ...p, [f]: v }))}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Ngày khám</label>
                          <DateInput 
                            day={examDate.day} month={examDate.month} year={examDate.year}
                            onChange={(f, v) => setExamDate(p => ({ ...p, [f]: v }))}
                          />
                        </div>
                        {calculatedAgeDisplay && (
                          <div className="text-sm font-medium text-indigo-600 mt-2">
                            {calculatedAgeDisplay} {chronologicalAge && `(${chronologicalAge} năm)`}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col h-full">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t.boneAge} <span className="text-red-500">*</span>
                    </label>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex-1 flex flex-col justify-center">
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Activity className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={boneAgeRUS}
                          onChange={(e) => setBoneAgeRUS(e.target.value)}
                          className="focus:ring-slate-500 focus:border-slate-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2.5 border bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Female Specific */}
              {gender === 'female' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t.menarcheStatus}</label>
                    <div className="flex rounded-lg shadow-sm">
                      <button
                        type="button"
                        onClick={() => setIsPostMenarche(false)}
                        className={`flex-1 py-2 text-sm font-medium rounded-l-lg border ${
                          !isPostMenarche
                            ? 'bg-pink-100 border-pink-300 text-pink-800 z-10'
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {t.preMenarche}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsPostMenarche(true)}
                        className={`flex-1 py-2 text-sm font-medium rounded-r-lg border-y border-r border-l-0 ${
                          isPostMenarche
                            ? 'bg-pink-100 border-pink-300 text-pink-800 z-10'
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {t.postMenarche}
                      </button>
                    </div>
                  </div>

                  {isPostMenarche && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        {t.ageAtMenarche} <span className="text-slate-400 font-normal">{t.optional}</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={ageAtMenarche}
                        onChange={(e) => setAgeAtMenarche(e.target.value)}
                        className="focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-slate-300 rounded-lg py-2.5 px-3 border"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Section 3: Previous Data */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-2">
                  <h2 className={`text-xl font-semibold ${textClass} flex items-center gap-2`}>
                    <Calendar className={`w-5 h-5 ${iconClass}`} />
                    {t.previousData} <span className="text-sm font-normal text-slate-500">{t.optional}</span>
                  </h2>
                  <div className="flex items-center h-5">
                    <input
                      id="hasPreviousData"
                      type="checkbox"
                      checked={hasPreviousData}
                      onChange={(e) => setHasPreviousData(e.target.checked)}
                      className={`focus:ring-${themeColor}-500 h-5 w-5 text-${themeColor}-600 border-slate-300 rounded`}
                    />
                    <label htmlFor="hasPreviousData" className="ml-2 text-sm text-slate-600 cursor-pointer">
                      {t.hasData}
                    </label>
                  </div>
                </div>

                {hasPreviousData && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-200">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        {t.monthsSince}
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={monthsSincePrevious}
                        onChange={(e) => setMonthsSincePrevious(e.target.value)}
                        className="focus:ring-slate-500 focus:border-slate-500 block w-full sm:text-sm border-slate-300 rounded-lg py-2.5 px-3 border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        {t.prevHeight}
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={previousHeight}
                        onChange={(e) => setPreviousHeight(e.target.value)}
                        className="focus:ring-slate-500 focus:border-slate-500 block w-full sm:text-sm border-slate-300 rounded-lg py-2.5 px-3 border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        {t.prevBoneAge}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={previousBoneAgeRUS}
                        onChange={(e) => setPreviousBoneAgeRUS(e.target.value)}
                        className="focus:ring-slate-500 focus:border-slate-500 block w-full sm:text-sm border-slate-300 rounded-lg py-2.5 px-3 border"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Section 4: Parents Height */}
              <div className="space-y-6">
                <h2 className={`text-xl font-semibold ${textClass} flex items-center gap-2 border-b pb-2`}>
                  <Users className={`w-5 h-5 ${iconClass}`} />
                  {t.parentsHeight} <span className="text-sm font-normal text-slate-500">{t.optional}</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t.fatherHeight}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={fatherHeight}
                      onChange={(e) => setFatherHeight(e.target.value)}
                      className="focus:ring-slate-500 focus:border-slate-500 block w-full sm:text-sm border-slate-300 rounded-lg py-2.5 px-3 border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t.motherHeight}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={motherHeight}
                      onChange={(e) => setMotherHeight(e.target.value)}
                      className="focus:ring-slate-500 focus:border-slate-500 block w-full sm:text-sm border-slate-300 rounded-lg py-2.5 px-3 border"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Results */}
          <div className="space-y-8">
            {calcError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                <p className="text-red-700 font-medium">{calcError}</p>
              </div>
            )}

            {!result && !calcError && (
              <div className={`bg-white rounded-2xl shadow-sm border ${borderClass} p-12 text-center flex flex-col items-center justify-center h-full min-h-[400px]`}>
                <Calculator className={`w-12 h-12 ${iconClass} opacity-20 mb-4`} />
                <p className="text-slate-500 font-medium">Nhập đầy đủ thông tin để xem kết quả dự đoán</p>
              </div>
            )}

            {result && (
              <div className={`bg-white rounded-2xl shadow-sm border ${borderClass} overflow-hidden transition-colors duration-500`}>
                <div className={`${bgClass} px-6 py-4 border-b ${borderClass} flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <Activity className={`w-5 h-5 ${iconClass}`} />
                    <h3 className={`text-lg font-medium ${textClass}`}>{t.resultTitle}</h3>
                  </div>
                </div>
                <div className="p-6 sm:p-8 text-center">
              <div className="text-sm text-slate-500 mb-2 uppercase tracking-wider font-semibold">{t.predictedHeight}</div>
              <div className="text-5xl sm:text-6xl font-bold text-slate-900 mb-4 font-mono">
                {result.predictedHeight.toFixed(1)} <span className="text-2xl sm:text-3xl text-slate-500 font-sans">cm</span>
              </div>
              
              {result.mph && Math.abs(result.predictedHeight - result.mph) > 10 && (
                <div className="inline-block mb-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium border border-red-200">
                  {t.highDiffWarning}
                </div>
              )}

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-slate-700 font-medium">
                <span>{t.predictionRange}</span>
                <span className={`font-bold ${textClass}`}>
                  {(result.predictedHeight - result.sd).toFixed(1)} - {(result.predictedHeight + result.sd).toFixed(1)} cm
                </span>
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-100 text-left">
                <h4 className="text-sm font-medium text-slate-700 flex items-center gap-1.5 mb-3">
                  <Info className="w-4 h-4 text-slate-400" />
                  {t.formulaInfo}
                </h4>
                <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600 space-y-2">
                  <p><span className="font-medium text-slate-700">{t.coefficientTable}</span> {result.tableName}</p>
                  <p><span className="font-medium text-slate-700">{t.sd}</span> {result.sd} cm</p>
                </div>
              </div>

              {/* Chart Section */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <h4 className="text-sm font-medium text-slate-700 mb-6 text-left">{t.chartTitle}</h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: 'TW2',
                          height: Number(result.predictedHeight.toFixed(1)),
                          fill: chartColor
                        },
                        ...(result.mph ? [{
                          name: 'MPH',
                          height: Number(result.mph.toFixed(1)),
                          fill: '#94a3b8' // slate-400
                        }] : [])
                      ]}
                      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <YAxis domain={['dataMin - 10', 'dataMax + 10']} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <Tooltip 
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [`${value} cm`, 'Chiều cao']}
                      />
                      <Bar dataKey="height" radius={[4, 4, 0, 0]} maxBarSize={60}>
                        {
                          [
                            { fill: chartColor },
                            ...(result.mph ? [{ fill: '#94a3b8' }] : [])
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))
                        }
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {result.mph && (
                  <div className="text-sm text-slate-500 mt-2">
                    {t.diff} <span className="font-medium">{Math.abs(result.predictedHeight - result.mph).toFixed(1)} cm</span>
                  </div>
                )}
              </div>

                {/* Conclusion Box */}
                {result.mph && (
                  <div className={`mt-6 ${bgClass} rounded-xl p-5 border ${borderClass} text-left relative`}>
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className={`text-sm font-semibold ${textClass}`}>{t.conclusionTitle}</h4>
                      <button
                        onClick={handleCopy}
                        className={`flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-md ${
                          copied ? 'bg-green-100 text-green-700' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                        } transition-colors`}
                      >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copied ? t.copied : t.copyBtn}
                      </button>
                    </div>
                    <p className={`text-sm ${textClass} leading-relaxed opacity-90`}>
                      {t.conclusionText(result.predictedHeight.toFixed(1), result.sd.toString(), result.mph.toFixed(1))}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
        <div className="mt-12 text-center pb-8">
          <p className="text-sm text-slate-500 font-medium">{t.author} - TAHN</p>
          <a href="https://dotienson.com/app" target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-500 hover:text-indigo-600 hover:underline mt-1 inline-block">
            dotienson.com/app
          </a>
        </div>
      </div>
    </div>
  );
}

