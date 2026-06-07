export type LocaleIndex = 0 | 1;
export type TextPair = [string, string];

export const PROMPT = '▸ ';

export const COMMANDS = [
  'whoami',
  'projects',
  'links',
  'status',
  'neofetch',
  'motd',
  'repo',
  'date',
  'clear',
  'help',
] as const;

export const T = {
  motd: [
    [
      'XiaoYuan151 — 17',
      'Guilin, Guangxi — zero-router BGP AS209601',
      null,
      'C#  Python  Rust  JavaScript',
      'BGP  RevEng  Audio  v2ray  infra',
      null,
      'Neuro-sama oshi — SiiWay — Bilibili',
    ],
    [
      '小源151 — 17岁',
      '广西桂林 — 零路由 BGP AS209601',
      null,
      'C#  Python  Rust  JavaScript',
      'BGP  逆向  混音  v2ray  基建',
      null,
      'Neuro-sama 单推 — SiiWay — B站',
    ],
  ],
  whoami_name: ['XiaoYuan151 / 小源151 / 源神987', '小源151 / 源神987 / XiaoYuan151'],
  whoami_info: [
    '17 · student · full-stack builder · AS209601 operator',
    '17岁 · 学生 · 全栈缝合怪 · AS209601 运营者',
  ],
  whoami_loc: ['Guilin, Guangxi, China', '中国广西桂林'],
  boot_hint: ["type help to see what's here", '输入 help 看看有什么'],

  help_whoami: ['whoami      who is this person', 'whoami      这是谁'],
  help_projects: ["projects    things I've shipped", 'projects    做过的东西'],
  help_links: ['links       where to find me', 'links       去哪找我'],
  help_status: ["status      what I'm up to", 'status      在忙什么'],
  help_neofetch: ['neofetch    the classic', 'neofetch    经典的那个'],
  help_motd: ['motd        message of the day', 'motd        每日消息'],
  help_repo: ['repo        view source', 'repo        查看源码'],
  help_date: ['date        current timestamp', 'date        当前时间戳'],
  help_clear: ['clear       wipe the screen', 'clear       清屏'],
  help_help: ["help        you're looking at it", 'help        你正在看的这个'],
  help_footer: ['try typing something unexpected', '试试输点别的'],

  proj_title: ['GyakutenNeuro — fan translation (zh-CN)', '逆转Neuro — 同人游戏中文化'],
  proj_tl: ['  shipped a significant chunk of the zh-CN translation', '  参与了大部分翻译工作'],
  proj_studio: ['XiaoYuan Studio — personal toolchain & infra', 'XiaoYuan Studio — 个人工具链与基建'],
  proj_ai: ['XiaoYuan AI — agentic playground', 'XiaoYuan AI — 智能体实验田'],
  proj_bgp: ['BGP — AS209601 · zero-router · bare metal peering', 'BGP — AS209601 · 零路由 · 裸金属对等'],
  proj_neuro: ['Neuro-sama fan edits & DJ mixes on Bilibili', 'Neuro-sama 二创 / DJ Mix @ B站'],
  proj_proxy: ['vless/vmess edge proxy fleet — always running', 'vless/vmess 边缘代理集群 — 持续运行'],
  proj_shizuku: [
    'Shizuku karaoke player — Neuro & Evil TL pipeline',
    'Shizuku 歌回播放器 — Neuro & Evil 翻译线',
  ],
  proj_hw: ['Bare metal lab — OC, silicon lottery, tech support', '裸金属实验室 — 超频 · 硅渣摸奖 · 技术支援'],

  status_doing: ['currently: shipping / debugging / vibing', '当前：交付中 / 调试中 / 摸鱼中'],
  status_cpu: ['cpu load: nominal — bare metal, stock clocks', 'CPU 负载：正常 — 裸金属 · 默频'],

  neofetch_user: ['xiaoyuan151@homepage', '小源151@homepage'],
  neofetch_os: ['OS: Guilin, Guangxi, China', 'OS: 中国广西桂林'],
  neofetch_up: ['Uptime: 17 years', 'Uptime: 17年'],
  neofetch_shell: ['Shell: zsh (with vibes)', 'Shell: zsh (带感)'],
  neofetch_de: ['DE: classroom — bedroom', 'DE: 教室 — 卧室'],
  neofetch_st: ['Status: ● online', 'Status: ● 在线'],

  sudo_msg: ['nice try — permission denied', '想多了 — 权限不足'],
  rm_msg: ['not today — operation not permitted', '今天不行 — 操作不允许'],
  exit_msg: ['there is no escape — not a login shell', '逃不掉的 — 不是登录 shell'],

  neuro_title: ['Hive / Drone | Neuro-sama community', '蜂群/工蜂 | Neuro-sama 社群'],
  neuro_stnc: ['STNC — Hive Tech Intel SIG', 'STNC — 蜂群技术情报 SIG'],
  neuro_tl: ['Neuro & Evil karaoke TL pipeline', 'Neuro & Evil 歌回翻译流水线'],
  neuro_osu: ['Osu! Osu! Osu!', 'Osu! Osu! Osu!'],

  darkweb_msg: ['wrong window, buddy', '走错片场了兄弟'],
  repo_title: ['source for this page:', '本页源码：'],
  love_msg: ['segfault at 0xDEADBEEF — core dumped', '段错误 0xDEADBEEF — 核心已转储'],

  cmd_notfound: ['zsh: command not found: ', 'zsh: 未找到命令: '],
  cmd_tryhelp: ['try help', '试试 help'],
} satisfies Record<string, TextPair | [Array<string | null>, Array<string | null>]>;

export const SOCIAL_LINKS = [
  ['GitHub', 'https://github.com/XiaoYuan151', 'github.com/XiaoYuan151'],
  ['Bilibili', 'https://space.bilibili.com/488570832', 'space.bilibili.com/488570832'],
  ['YouTube', 'https://www.youtube.com/channel/UCGcp7a2Cu2q-XtvOCSIs1Rw', 'youtube.com/@xiaoyuan151'],
  ['X', 'https://x.com/XiaoYuan151', 'x.com/XiaoYuan151'],
  ['Twitch', 'https://www.twitch.tv/xiaoyuan_151', 'twitch.tv/xiaoyuan_151'],
  ['TikTok', 'https://www.tiktok.com/@xiaoyuan151', 'tiktok.com/@xiaoyuan151'],
  ['Instagram', 'https://www.instagram.com/xiaoyuan_151', 'instagram.com/xiaoyuan_151'],
  ['Discord', 'https://discord.gg/JPsX7Nm5Yk', 'discord.gg/JPsX7Nm5Yk'],
  ['Telegram', 'https://t.me/xiaoyuan151_group', 't.me/xiaoyuan151_group'],
  ['QQ Group', 'https://qm.qq.com/q/9QUMsoK4Le', 'qm.qq.com/q/9QUMsoK4Le'],
  ['Patreon', 'https://www.patreon.com/xiaoyuan151', 'patreon.com/xiaoyuan151'],
  ['Facebook', 'https://www.facebook.com/XiaoYuan151', 'facebook.com/XiaoYuan151'],
  ['Snapchat', 'https://www.snapchat.com/add/xiaoyuan151', 'snapchat.com/add/xiaoyuan151'],
  ['Blog', 'https://blog.xiaoyuan151.com', 'blog.xiaoyuan151.com'],
] as const;

export const HIDDEN_COMMANDS = new Map<string, 'sudo' | 'rm' | 'exit' | 'neuro' | 'darkweb' | 'love'>([
  ['sudo', 'sudo'],
  ['rm', 'rm'],
  ['rm -rf', 'rm'],
  ['rm -rf /', 'rm'],
  ['exit', 'exit'],
  ['logout', 'exit'],
  ['neuro', 'neuro'],
  ['nt', 'neuro'],
  ['蜂群', 'neuro'],
  ['暗网', 'darkweb'],
  ['恋爱', 'love'],
  ['戀愛', 'love'],
]);

export function selectLocale(): LocaleIndex {
  return (navigator.language || 'en').startsWith('zh') ? 1 : 0;
}

export function tr(key: keyof typeof T, locale: LocaleIndex): string {
  return T[key][locale] as string;
}

export function motdLines(locale: LocaleIndex): Array<string | null> {
  return T.motd[locale];
}
