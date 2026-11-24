import { SurgeryChallenge } from '../types/clinical';

export interface SurgeryRuleInput {
  disease: 'hemorrhoid' | 'fistula' | 'abscess';
  hemorrhoidGrade?: 'I' | 'II' | 'III' | 'IV' | 'thrombosed';
  fistulaType?: 'low_simple' | 'high_transsphincteric' | 'suprasphincteric' | 'crohns';
  abscessType?: 'perianal_subcutaneous' | 'intersphincteric_high' | 'ischiorectal' | 'pelvirectal';
  specialCondition: 'none' | 'anticoagulant' | 'pregnancy' | 'weak_sphincter';
}

export interface SurgerySimulationResult {
  indicationLevel: '保守治疗为主' | '择期手术指征' | '限期/急诊手术指征' | '多学科协同/谨慎手术';
  recommendedProcedure: string;
  alternativeOptions: string[];
  contraindicatedOrAvoid: string[];
  rationale: string;
  specialNotes: string[];
}

export function evaluateSurgeryDecision(input: SurgeryRuleInput): SurgerySimulationResult {
  const specialNotes: string[] = [];
  if (input.specialCondition === 'anticoagulant') {
    specialNotes.push('【凝血/抗栓注意】术前需评估阿司匹林/氯吡格雷/华法林等停药或桥接窗口，术后严密监测创面继发性出血。');
  } else if (input.specialCondition === 'pregnancy') {
    specialNotes.push('【妊娠期注意】原则上以保守对症为主，尽量避免非急诊择期手术；若发生严重嵌顿坏死或急性脓肿，可在局麻下最小化引流/减压。');
  } else if (input.specialCondition === 'weak_sphincter') {
    specialNotes.push('【括约肌功能薄弱注意】高龄、既往产伤或肛门手术史患者静息压/缩榨压储备低，严禁大范围切开括约肌，优先选择保留括约肌术式或虚挂线。');
  }

  if (input.disease === 'hemorrhoid') {
    switch (input.hemorrhoidGrade) {
      case 'I':
        return {
          indicationLevel: '保守治疗为主',
          recommendedProcedure: '非手术治疗：高纤维饮食 + 温水坐浴 + 局部黏膜保护栓剂/软膏',
          alternativeOptions: ['若顽固性出血可考虑门诊硬化剂注射'],
          contraindicatedOrAvoid: ['外剥内扎术（过度医疗）', 'PPH 吻合器切除（无脱垂指征）'],
          rationale: 'Goligher I 度内痔仅便血无脱出，90% 以上可通过改善排便习惯和局部药物控制，不应轻易手术切除正常肛垫。',
          specialNotes
        };
      case 'II':
        return {
          indicationLevel: input.specialCondition === 'pregnancy' ? '保守治疗为主' : '择期手术指征',
          recommendedProcedure: '保守治疗无效时首选门诊微创：内痔套扎术（RBL）或硬化剂注射术',
          alternativeOptions: ['外痔明显时可小范围分段剥扎'],
          contraindicatedOrAvoid: ['大范围环状切除（易致狭窄与肛垫受损）'],
          rationale: 'II 度内痔脱出可自行还纳，保守无效时橡皮圈套扎（RBL）或硬化剂注射创伤极小、恢复快、保护肛垫。',
          specialNotes
        };
      case 'III':
        return {
          indicationLevel: input.specialCondition === 'pregnancy' ? '保守治疗为主' : '择期手术指征',
          recommendedProcedure: '外剥内扎术（Milligan-Morgan）或选择性痔上黏膜切除术（TST/PPH）联合外痔剥离',
          alternativeOptions: ['多普勒引导下痔动脉结扎术（DG-HAL）'],
          contraindicatedOrAvoid: ['环形一次性剥切不留皮桥（必致肛门狭窄）', '单靠药膏长期拖延伴贫血患者'],
          rationale: 'III 度混合痔需手托还纳，常伴出血或嵌顿风险。分段外剥内扎或 TST 可有效回纳肛垫并切除外痔，术中务必保留足够皮桥与黏膜桥。',
          specialNotes
        };
      case 'IV':
        return {
          indicationLevel: input.specialCondition === 'pregnancy' ? '多学科协同/谨慎手术' : '择期手术指征',
          recommendedProcedure: '分段外剥内扎术（精准保留皮桥/黏膜桥）或悬吊术联合外痔整形',
          alternativeOptions: ['TST + 外痔分段剥除'],
          contraindicatedOrAvoid: ['单纯套扎（对重度外痔及纤维化脱垂无效）', '破坏齿状线连续性'],
          rationale: 'IV 度混合痔长期脱出不能还纳，外痔成分多且常伴纤维化，外剥内扎术能同时彻底处理内外痔并重塑肛管外形。',
          specialNotes
        };
      case 'thrombosed':
        return {
          indicationLevel: '限期/急诊手术指征',
          recommendedProcedure: '发病 48~72h 内行血栓性外痔剥离摘除术（嵌顿痔可在麻醉下行分段剥扎+血栓清除）',
          alternativeOptions: ['超过 72h 且疼痛渐缓者可温水坐浴、消肿止痛保守等待吸收'],
          contraindicatedOrAvoid: ['无麻醉下暴力强行还纳嵌顿痔', '单纯切开不摘除血栓（极易复发）'],
          rationale: '早期（72h内）疼痛剧烈者完整摘除血栓可立即止痛；水肿明显时切皮务必“宁窄勿宽”，避免消肿后皮桥缺损。',
          specialNotes
        };
    }
  }

  if (input.disease === 'fistula') {
    switch (input.fistulaType) {
      case 'low_simple':
        return {
          indicationLevel: input.specialCondition === 'weak_sphincter' ? '多学科协同/谨慎手术' : '择期手术指征',
          recommendedProcedure: '肛瘘切开术或肛瘘切除术（彻底敞开瘘管并处理对应肛窦内口）',
          alternativeOptions: ['瘘管切开挂线（仅用于括约肌储备极差者）'],
          contraindicatedOrAvoid: ['仅切开外口不处理内口（极高复发率）', '探针暴力穿刺制造假道'],
          rationale: '低位单纯性肛瘘不穿过肛管直肠环，直接切开敞开引流即可一期治愈，愈合快且控便安全。',
          specialNotes
        };
      case 'high_transsphincteric':
        return {
          indicationLevel: '择期手术指征',
          recommendedProcedure: '切割/虚挂线疗法（Seton）或保留括约肌术式（LIFT 括约肌间瘘管结扎术 / 推移黏膜瓣术）',
          alternativeOptions: ['内口切开+支管对口引流/开窗'],
          contraindicatedOrAvoid: ['一次性直接切断全部受累外括约肌深部（导致严重肛门失禁）'],
          rationale: '高位经括约肌肛瘘累及较多外括约肌，术前应行 MRI/ERUS 评估，首选挂线或保留括约肌术式以平衡治愈率与控便功能。',
          specialNotes
        };
      case 'suprasphincteric':
        return {
          indicationLevel: '择期手术指征',
          recommendedProcedure: '分期切割挂线或长期引流挂线联合支管对口引流（结合 MRI 导航）',
          alternativeOptions: ['推移黏膜瓣修补内口+外侧引流'],
          contraindicatedOrAvoid: ['一次性切开肛管直肠环（绝对禁忌！）'],
          rationale: '括约肌上型肛瘘绕行耻骨直肠肌上方，任何一次性切断都将造成不可逆肛门失禁，必须借助挂线慢性粘连勒割或引流。',
          specialNotes
        };
      case 'crohns':
        return {
          indicationLevel: '多学科协同/谨慎手术',
          recommendedProcedure: '脓肿引流 + 宽松不切割挂线（Loose Seton）+ 消化内科生物制剂（MDT 联合）',
          alternativeOptions: ['待肠道黏膜完全愈合静止后，再评估推移瓣或生物材料封堵'],
          contraindicatedOrAvoid: ['活动期大范围根治性瘘管切开/切除术（创面不愈合并致失禁）'],
          rationale: '克罗恩病肛瘘的核心是全身免疫炎症控制，外科仅负责充分引流控制局部脓毒症，绝不可盲目扩大切开。',
          specialNotes
        };
    }
  }

  // abscess
  switch (input.abscessType) {
    case 'perianal_subcutaneous':
      return {
        indicationLevel: '限期/急诊手术指征',
        recommendedProcedure: '急诊脓肿切开引流术（若内口明确且低位，由专科评估行一期根治切开）',
        alternativeOptions: ['分期手术：先充分切开引流，形成低位肛瘘后再二期根治'],
        contraindicatedOrAvoid: ['单纯口服抗生素拖延等待破溃', '细针抽脓代替切开'],
        rationale: '肛周皮下脓肿表浅且痛剧，尽早充分切开引流可迅速止痛并阻断感染向深部间隙蔓延。',
        specialNotes
      };
    case 'intersphincteric_high':
      return {
        indicationLevel: '限期/急诊手术指征',
        recommendedProcedure: '经肛管内切开内括约肌引流（敞开括约肌间脓腔至肛管内）',
        alternativeOptions: ['超声引导下精准定位内口引流'],
        contraindicatedOrAvoid: ['经肛周外括约肌外侧盲目切开（易制造复杂经括约肌瘘）'],
        rationale: '高位括约肌间脓肿位于内外括约肌之间，向内切开内括约肌即可直接引流至肛管，避免损伤外括约肌。',
        specialNotes
      };
    case 'ischiorectal':
      return {
        indicationLevel: '限期/急诊手术指征',
        recommendedProcedure: '坐骨直肠窝充分切开引流（打通纤维间隔，马蹄形者行对口引流或后深间隙挂线）',
        alternativeOptions: ['若明确 6 点原发内口且经验充足，可行内口切开+侧方虚挂引流'],
        contraindicatedOrAvoid: ['切口过小导致引流不畅复发', '损伤外侧壁阴部内神经血管束'],
        rationale: '坐骨直肠窝脂肪疏松且常向后深间隙蔓延成马蹄形，充分敞开打通间隔并保持引流通畅是关键。',
        specialNotes
      };
    case 'pelvirectal':
    default:
      return {
        indicationLevel: '限期/急诊手术指征',
        recommendedProcedure: '先通过 MRI/ERUS 明确感染来源：原发盆腔/直肠源性者经直肠腔内引流；下方蔓延者经坐骨直肠窝引流',
        alternativeOptions: ['CT/超声引导穿刺置管引流作为危重患者过渡'],
        contraindicatedOrAvoid: ['来源不明时盲目经肛周皮肤穿刺穿透肛提肌（人为制造括约肌外型肛瘘）'],
        rationale: '骨盆直肠间隙位于肛提肌上方，错误的引流路径会造成灾难性的高位医源性肛瘘。',
        specialNotes
      };
  }
}

export const SURGERY_CHALLENGES: SurgeryChallenge[] = [
  {
    id: 'sc-1',
    title: '妊娠 28 周突发 II 度内痔脱出伴少量滴血',
    difficulty: 'assistant_gp',
    patientSummary: '28 岁女性，孕 28 周，排便偏干后出现内痔脱出可自行还纳，伴少许滴鲜血，无剧痛及嵌顿。',
    keyFindings: ['妊娠中晚期腹压增高', 'II 度内痔无嵌顿坏死', '胎儿及孕妇安全优先'],
    options: [
      { name: '立即行外剥内扎术彻底根治', isRecommended: false, rationale: '妊娠期非急症手术麻醉及应激风险高，且产后腹压下降痔核常明显回缩。' },
      { name: '高纤维饮食、乳果糖通便、温水坐浴等保守治疗，产后再评估', isRecommended: true, rationale: '妊娠期痔病以安全保守对症为原则，改善排便、减轻盆底充血即可平稳度过孕期。' },
      { name: '行 PPH 吻合器痔上黏膜环切术', isRecommended: false, rationale: '妊娠期严禁常规行吻合器择期手术。' }
    ],
    correctIndex: 1,
    indicationSummary: '妊娠期痔病：非急诊嵌顿坏死一律保守为主，避免不必要手术刺激诱发宫缩。'
  },
  {
    id: 'sc-2',
    title: '68 岁高龄女性产伤史合并高位经括约肌肛瘘',
    difficulty: 'visiting_doctor',
    patientSummary: '68 岁女性，既往顺产会阴撕裂史，偶有稀便漏气感，现左侧高位经括约肌肛瘘（MRI 示穿过外括约肌约 45%）。',
    keyFindings: ['基础括约肌功能已减退', '穿过外括约肌比例高', '控便安全为第一底线'],
    options: [
      { name: '行一次性肛瘘切开术以防复发', isRecommended: false, rationale: '括约肌储备已差，直接切断 45% 外括约肌极易导致不可逆大便失禁。' },
      { name: '行保留括约肌术式（LIFT / 推移黏膜瓣）或长期虚挂线引流', isRecommended: true, rationale: '在保护残余括约肌完整性的前提下控制感染或闭合内口，守住控便底线。' },
      { name: '仅使用外用消炎药膏', isRecommended: false, rationale: '药物无法治愈已上皮化的肛瘘管腔。' }
    ],
    correctIndex: 1,
    indicationSummary: '控便储备差的患者（高龄、产伤、既往多次手术）处理高位肛瘘必须首选保留括约肌术式或虚挂线。'
  },
  {
    id: 'sc-3',
    title: '口服阿司匹林患者 Goligher III 度混合痔反复出血',
    difficulty: 'visiting_doctor',
    patientSummary: '64 岁男性，冠心病支架术后长期口服阿司匹林，III 度混合痔便后出血伴贫血，拟行手术。',
    keyFindings: ['抗血小板药物使用史', '围手术期出血风险极高', '需心血管科评估停药/桥接'],
    options: [
      { name: '不停用阿司匹林直接行外剥内扎术', isRecommended: false, rationale: '抗血小板药未评估停药窗口直接手术，术中及术后继发大出血风险极高。' },
      { name: '请心内科评估抗栓风险，按规范停药或桥接后再行微创/精细电凝止血手术，术后严密监测创面', isRecommended: true, rationale: '兼顾支架血栓风险与肛肠术后创面大出血风险，是规范的围手术期管理。' },
      { name: '终身禁止任何痔疮治疗', isRecommended: false, rationale: '患者已合并出血贫血，经多学科评估调整抗栓方案后完全可以安全手术。' }
    ],
    correctIndex: 1,
    indicationSummary: '抗栓/抗凝患者肛肠手术必须多学科评估停药窗口与术后迟发性出血预警。'
  }
];
