import { CopilotAurorianSummaryType } from '@sinsa/schema';

export interface BilibiliVideoType {
  bvid: `BV${string}`;
  aid: 579847514;
  tname: '手机游戏';
  pic: 'http://i2.hdslb.com/bfs/archive/cbc0a76a2c8893ee28aba487fbc3971f29d43647.jpg';
  title: string;
  pubdate: 1702562517;
  ctime: 1702562517;
  desc: string;
  duration: 313;
  owner: {
    mid: 454028395;
    name: string;
    face: 'https://i1.hdslb.com/bfs/face/5e42d80229d037e4249a398172ed726d15a66c00.jpg';
  };
  stat: {
    aid: 579847514;
    view: 611;
    danmaku: 0;
    reply: 29;
    favorite: 11;
    coin: 27;
    share: 4;
    now_rank: 0;
    his_rank: 0;
    like: 55;
    dislike: 0;
    evaluation: '';
    vt: 0;
  };
  pages: [
    {
      cid: 1367117220;
      page: 1;
      from: 'vupload';
      part: 'v1.1';
      duration: 313;
      vid: '';
      weblink: '';
      dimension: {
        width: 1920;
        height: 1080;
        rotate: 0;
      };
      first_frame: 'http://i2.hdslb.com/bfs/storyff/n231214a239kwchvgg0r41aoet8finfg_firsti.jpg';
    },
  ];
}

export interface FormValues {
  term: number;
  rerun_terms?: number[];
  bv: `BV${string}`;
  duplicate: boolean;
  title: string;
  description: string;
  author: string;
  upload_time: number;
  score: number;
  aurorian_summaries: [
    CopilotAurorianSummaryType,
    CopilotAurorianSummaryType,
    CopilotAurorianSummaryType,
    CopilotAurorianSummaryType,
    CopilotAurorianSummaryType,
  ];
}
