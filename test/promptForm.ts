/*
 * @Author             : Felix
 * @Email              : 307253927@qq.com
 * @Date               : 2024-07-16 18:52:34
 * @LastEditors        : Felix
 * @LastEditTime       : 2024-07-16 19:03:54
 */

/** Prompt 表单配置项 */
type PromptFormItem = {
  type: "input" | "inputNumber" | "select" | "textarea"; // 表单类型
  label: string; // 字段名称
  field: string; // 字段名
  value?: string | number; // 默认值
  placeholder?: string; // 输入框提示词
  maxLength?: number; // 输入框字符限制
  required?: boolean;
  options?: Array<{ label: string; value: string | number }>; // select 配置项
};

const codeGenerationList: PromptFormItem[] = [
  {
    type: "select",
    label: "编程语言",
    field: "",
    placeholder: "请选择编程语言",
    required: true,
    options: [
      { label: "C语言", value: "C语言" },
      { label: "Jave", value: "Jave" },
      { label: "Python", value: "Python" },
      { label: "C++", value: "C++" },
      { label: "JavaScript", value: "JavaScript" },
      { label: "PHP", value: "PHP" }
    ]
  },
  {
    type: "textarea",
    label: "需求描述",
    field: "",
    placeholder: "请输入您的需求描述",
    required: true,
    maxLength: 500
  }
];
const codeDefectDetectionList: PromptFormItem[] = [
  {
    type: "textarea",
    label: "需要检测的代码",
    field: "",
    placeholder: "请输入需要检测的代码",
    required: true,
    maxLength: 500
  }
];
const codeOptimizationList: PromptFormItem[] = [
  {
    type: "textarea",
    label: "需要优化的代码",
    field: "",
    placeholder: "请输入需要优化的代码",
    required: true,
    maxLength: 500
  }
];
const codeInterpretationList: PromptFormItem[] = [
  {
    type: "textarea",
    label: "需要检测的代码",
    field: "",
    placeholder: "请输入需要检测的代码",
    required: true,
    maxLength: 500
  }
];
const sloganCreativeGenerationList: PromptFormItem[] = [
  {
    type: "input",
    label: "产品名称",
    field: "",
    placeholder: "请输入产品名称",
    required: true,
    maxLength: 30
  },
  {
    type: "textarea",
    label: "用户画像",
    field: "",
    placeholder: "请输入用户画像",
    required: true,
    maxLength: 500
  },
  {
    type: "textarea",
    label: "品牌用户画像",
    field: "",
    placeholder: "请输入品牌的用户画像",
    required: true,
    maxLength: 500
  },
  {
    type: "textarea",
    label: "产品特点与优势",
    field: "",
    placeholder: "请输入产品特点与优势",
    required: true,
    maxLength: 500
  },
  {
    type: "textarea",
    label: "希望传达的信息",
    field: "",
    placeholder: "请输入希望传达的信息",
    required: true,
    maxLength: 500
  },
  {
    type: "textarea",
    label: "品牌价值观",
    field: "",
    placeholder: "请输入品牌价值观",
    required: true,
    maxLength: 500
  },
  {
    type: "inputNumber",
    label: "广告的口号字数",
    field: "",
    placeholder: "请输入广告的口号字数",
    required: true,
    maxLength: 30
  },
  {
    type: "inputNumber",
    label: "生成条数",
    field: "",
    placeholder: "请输入生成条数",
    required: true,
    maxLength: 30
  }
];
const productNameCreativeGenerationList: PromptFormItem[] = [
  {
    type: "textarea",
    label: "行业或市场定位",
    field: "",
    placeholder: "请输入品牌所在的行业或市场定位",
    required: true,
    maxLength: 500
  },
  {
    type: "input",
    label: "关键词或品牌特点",
    field: "",
    placeholder: "请输入品牌关键词或品牌特点",
    required: true,
    maxLength: 30
  },
  {
    type: "textarea",
    label: "品牌用户画像",
    field: "",
    placeholder: "请输入品牌的用户画像",
    required: true,
    maxLength: 500
  },
  {
    type: "textarea",
    label: "起名要求",
    field: "",
    placeholder: "请输入品牌起名要求",
    required: true,
    maxLength: 500
  },
  {
    type: "select",
    label: "语言",
    field: "",
    placeholder: "请选择语言",
    required: true,
    options: [
      { label: "中文", value: "中文" },
      { label: "英文", value: "英文" }
    ]
  }
];
const jobDescriptionList: PromptFormItem[] = [
  {
    type: "input",
    label: "招聘职位",
    field: "",
    placeholder: "请输入招聘职位",
    required: true,
    maxLength: 30
  },
  {
    type: "textarea",
    label: "招聘要求",
    field: "",
    placeholder: "请输入招聘要求",
    required: true,
    maxLength: 500
  }
];
const administrativeNoticeList: PromptFormItem[] = [
  {
    type: "select",
    label: "通知类型",
    field: "",
    placeholder: "请选择通知类型",
    required: true,
    options: [
      { label: "放假通知", value: "放假通知" },
      { label: "调岗通知", value: "调岗通知" },
      { label: "停电停水通知", value: "停电停水通知" },
      { label: "活动通知", value: "活动通知" },
      { label: "其他类型通知", value: "其他类型通知" }
    ]
  },
  {
    type: "textarea",
    label: "补充信息",
    field: "",
    placeholder: "请输入补充信息",
    required: true,
    maxLength: 500
  },
  {
    type: "select",
    label: "通知语言",
    field: "",
    placeholder: "请选择通知语言",
    required: true,
    options: [
      { label: "中文", value: "中文" },
      { label: "英文", value: "英文" }
    ]
  }
];

export const AgentFormItemMap = new Map<string, PromptFormItem[]>([
  ["代码生成", codeGenerationList],
  ["代码缺陷检测", codeDefectDetectionList],
  ["代码优化", codeOptimizationList],
  ["代码解读", codeInterpretationList],
  ["Slogan创意生成", sloganCreativeGenerationList],
  ["产品名创意生成", productNameCreativeGenerationList],
  ["招聘职位描述", jobDescriptionList],
  ["行政通知", administrativeNoticeList]
]);
