import { ArrowRight, Play } from '@icon-park/react';
import type { HomeCarouselDataType } from '@/components/HomeCarousel/types';

export const HOME_DISPLAY_DATA: HomeCarouselDataType[] = [
  {
    key: 'final',
    title: '白夜极光国服停运公告',
    description: '再见了，空之末裔。再见了，导航员。',
    backgroundURL:
      '//i0.hdslb.com/bfs/article/c42419f5dd23f7f3079a04d713f7eae61436758643.jpg',
    link: 'https://www.bilibili.com/opus/1003568934644875286',
    label: '查看公告',
    labelIcon: <ArrowRight />,
  },
  {
    key: 'guide',
    title: '教学视频',
    description:
      '由红油扳手作业站站长配音解说红油扳手作业站正确使用姿势，助您抄作业事半功倍',
    backgroundURL:
      '//i0.hdslb.com/bfs/archive/6cc7f841b02d94dfe2f5030d196513d34f8caa9b.jpg',
    link: 'https://www.bilibili.com/video/BV17u4m1P7sq/',
    label: '观看视频',
    labelIcon: <Play />,
  },
  {
    key: 'chaomeixue',
    title: '“因为我们是超美学”',
    description:
      '讲述了一件虽然充了很多钱，但由于没有满破查莉娅，最终还是无法抄作业的事情',
    backgroundURL:
      '//i0.hdslb.com/bfs/archive/531a8948c93746990cda3802061344b32c3c3bc7.jpg',
    link: 'https://www.bilibili.com/video/BV1Sm411k7Qs/',
    label: '观看视频',
    labelIcon: <Play />,
  },
];
