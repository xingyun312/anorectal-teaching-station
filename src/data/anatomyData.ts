import { AnatomyStructure, ParksFistulaType } from '../types/clinical';

export const ANATOMY_STRUCTURES: AnatomyStructure[] = [
  {
    id: 'dentate-line',
    name: '齿状线（梳状线）',
    englishName: 'Dentate / Pectinate Line',
    category: 'landmark',
    summary: '直肠柱下端与肛瓣边缘共同围成的锯齿状环形解剖分界线，是胚胎期内外胚层交界处，距离肛缘约 1.5~2.0 cm。',
    clinicalSignificance: '肛肠外科最重要的解剖标志，决定了上皮类型、神经支配、血管回流及淋巴引流的截然不同。',
    surgicalWarning: '齿状线区分布有精细的肛门排便反射感受器，手术时应尽量保护齿状线及肛管移行上皮（ATZ），避免环形切除导致感觉性肛门失禁或直肠黏膜外翻。',
    aboveVsBelow: {
      above: '单层柱状上皮 | 内脏神经支配（对疼痛不敏感，对牵拉膨胀敏感）| 门静脉系统回流（直肠上静脉）| 淋巴主要向腹主动脉旁/肠系膜下淋巴结引流。',
      below: '复层扁平上皮（移行上皮/皮肤）| 躯体神经（阴部神经分支，痛觉极其敏锐）| 体静脉系统回流（直肠下静脉/肛门静脉→髂内静脉）| 淋巴向腹股沟淋巴结引流。'
    }
  },
  {
    id: 'anal-crypts',
    name: '肛隐窝（肛窦）与肛腺',
    englishName: 'Anal Crypts & Anal Glands',
    category: 'landmark',
    summary: '位于齿状线处相邻两肛柱基底之间、肛瓣后方的小凹陷，深约 3~5 mm，底部有肛腺导管开口（肛腺多穿过内括约肌延伸至括约肌间间隙）。',
    clinicalSignificance: '隐窝腺源性学说（Cryptoglandular Theory）的核心：约 90% 以上的肛周脓肿和肛瘘源于肛窦炎及肛腺导管阻塞感染。',
    surgicalWarning: '肛瘘或肛周脓肿手术成败的关键在于准确寻找并处理对应的感染内口（即原发肛窦），遗漏内口是术后复发的首要原因。'
  },
  {
    id: 'anorectal-ring',
    name: '肛管直肠环',
    englishName: 'Anorectal Ring',
    category: 'muscle',
    summary: '由耻骨直肠肌（肛提肌内侧部分）、肛门外括约肌深部、肛门内括约肌上缘及联合纵肌共同组成的强有力肌环，肛门指诊可触及明显的环状肌束。',
    clinicalSignificance: '维持肛门节制功能（控便能力）的最关键结构。高位与低位肛瘘、脓肿的临床分界常以肛管直肠环（或外括约肌深部）为重要参考。',
    surgicalWarning: '严禁一次性直接切断肛管直肠环！若瘘管穿过此环上方或深部，必须采用挂线疗法（Seton，利用慢性勒割使断端与周围组织粘连固定后再离断）或保留括约肌术式（LIFT、推移黏膜瓣等），否则将导致不可逆的肛门失禁。'
  },
  {
    id: 'ias',
    name: '肛门内括约肌 (IAS)',
    englishName: 'Internal Anal Sphincter',
    category: 'muscle',
    summary: '直肠壁环行平滑肌在肛管处增厚延续而成，属于不随意肌，受自主神经支配，主要维持肛管静息压（约占静息压的 70%~85%）。',
    clinicalSignificance: '内括约肌痉挛是慢性肛裂剧痛与难愈的重要原因；在括约肌间型肛瘘中，内括约肌常是首先受累的肌层。',
    surgicalWarning: '肛裂侧位内括约肌切开术（LIS）仅切断部分内括约肌下缘即可有效降压止痛；过度切断可能引起轻度漏气或渗液。'
  },
  {
    id: 'eas',
    name: '肛门外括约肌 (EAS)',
    englishName: 'External Anal Sphincter',
    category: 'muscle',
    summary: '围绕肛管的骨骼肌（横纹肌），受阴部神经支配，为随意肌，传统分为皮下部、浅部和深部三部分，负责肛管最大缩榨压（主动憋便）。',
    clinicalSignificance: '外括约肌皮下部切断通常不会引起失禁；浅部在肛尾韧带处附着于尾骨，是后正中线马蹄形感染扩散的重要通道；深部参与构成肛管直肠环。',
    surgicalWarning: '评估经括约肌肛瘘时，需通过指诊、ERUS 或盆腔 MRI 明确瘘管穿行外括约肌的比率（通常认为一次切断超过外括约肌 30% 时失禁风险显著升高）。'
  },
  {
    id: 'intersphincteric-space',
    name: '括约肌间间隙',
    englishName: 'Intersphincteric Space',
    category: 'space',
    summary: '位于肛门内括约肌与肛门外括约肌之间，内含联合纵肌及大多数肛腺体，向上与骨盆直肠间隙相通，向下可达肛周皮下。',
    clinicalSignificance: '肛腺感染的“第一站”。感染在此间隙形成括约肌间脓肿，可向下破溃成皮下脓肿，或穿破外括约肌进入坐骨直肠窝。',
    surgicalWarning: '高位括约肌间脓肿临床易漏诊（肛周皮肤红肿不明显，仅表现为深部胀痛与指诊条索状压痛）。'
  },
  {
    id: 'ischiorectal-fossa',
    name: '坐骨直肠窝（肛提肌下间隙）',
    englishName: 'Ischiorectal Fossa',
    category: 'space',
    summary: '位于肛提肌下方、肛管两侧的锥形疏松脂肪间隙，左右两侧可通过肛门后深间隙（Courtney 间隙）相互交通。',
    clinicalSignificance: '疏松脂肪组织抗感染能力弱，一旦脓肿形成常体积较大，且易经肛门后深间隙向对侧蔓延形成“马蹄形脓肿”或“半马蹄形肛瘘”。',
    surgicalWarning: '坐骨直肠窝脓肿切开引流需足够切口并打通纤维间隔，注意保护阴部内神经血管束（Alcock 管位于外侧壁）。'
  },
  {
    id: 'pelvirectal-space',
    name: '骨盆直肠间隙（肛提肌上间隙）',
    englishName: 'Pelvirectal / Supralevator Space',
    category: 'space',
    summary: '位于肛提肌上方、盆腔腹膜反折下方的深部潜在间隙。',
    clinicalSignificance: '深部高位脓肿发生部位，早期肛周局部体征常不明显，而以高热、寒战、直肠坠胀及里急后重等全身症状为主。',
    surgicalWarning: '处理骨盆直肠间隙脓肿前必须明确其来源（直肠内感染还是坐骨直肠窝向上穿破肛提肌），错误地经肛周皮肤盲目穿刺切开可能医源性制造难以愈合的“括约肌上型或括约肌外型复杂肛瘘”！'
  },
  {
    id: 'hemorrhoidal-plexus',
    name: '直肠下端痔静脉丛',
    englishName: 'Hemorrhoidal Venous Plexus & Cushions',
    category: 'vascular',
    summary: '齿状线上方为内痔静脉丛（肛垫支持结构），齿状线下方为外痔静脉丛；在截石位 3 点、7 点、11 点位因直肠上动脉分支解剖分布最易形成“母痔区”。',
    clinicalSignificance: '肛垫下移学说认为痔是正常肛垫支持组织（Treitz 肌）松弛下移与静脉曲张共同作用的结果，并非单纯“切除越多越好”。',
    surgicalWarning: '混合痔手术应遵循“保护肛垫、保留足够皮桥与黏膜桥”原则，防止术后肛门狭窄与精细控便功能减退。'
  }
];

export const PARKS_FISTULA_TYPES: ParksFistulaType[] = [
  {
    id: 'intersphincteric',
    name: 'I 型：括约肌间型肛瘘',
    englishName: 'Intersphincteric Fistula',
    proportion: '约占 45%~70%',
    pathDescription: '瘘管穿过肛门内括约肌后，沿括约肌间间隙向下穿出肛缘皮肤，不穿过肛门外括约肌。',
    surgicalStrategy: '绝大多数为低位单纯性肛瘘，可直接行肛瘘切开术或切除术（仅涉及部分内括约肌，对控便影响极小）。',
    riskLevel: '低'
  },
  {
    id: 'transsphincteric',
    name: 'II 型：经括约肌型肛瘘',
    englishName: 'Transsphincteric Fistula',
    proportion: '约占 20%~30%',
    pathDescription: '瘘管穿过内括约肌后，横穿肛门外括约肌进入坐骨直肠窝，再穿出肛周皮肤。可合并高位盲端或马蹄形支管。',
    surgicalStrategy: '低位（穿行外括约肌皮下部/浅部下缘）可切开；中高位需评估受累外括约肌比例，采用切割/引流挂线、LIFT（括约肌间瘘管结扎术）或推移黏膜瓣术。',
    riskLevel: '中'
  },
  {
    id: 'suprasphincteric',
    name: 'III 型：括约肌上型肛瘘',
    englishName: 'Suprasphincteric Fistula',
    proportion: '约占 5%~20%',
    pathDescription: '瘘管在括约肌间间隙向上行至耻骨直肠肌上方，绕过外括约肌深部与耻骨直肠肌后向下穿出坐骨直肠窝至皮肤。',
    surgicalStrategy: '属于高位复杂性肛瘘，严禁一次性切开！必须使用挂线疗法（分期切割或长期引流挂线）或联合保留括约肌手术。',
    riskLevel: '高'
  },
  {
    id: 'extrasphincteric',
    name: 'IV 型：括约肌外型肛瘘',
    englishName: 'Extrasphincteric Fistula',
    proportion: '约占 2%~5%',
    pathDescription: '瘘管完全位于内外括约肌之外，穿过肛提肌直接通向直肠壁（常见于医源性损伤、克罗恩病、异物穿孔或骨盆直肠间隙脓肿）。',
    surgicalStrategy: '不能按普通腺源性肛瘘切开，需首先处理原发病因（如克罗恩病内科生物制剂控制+宽松挂线引流，或直肠内修补）。',
    riskLevel: '高'
  }
];
