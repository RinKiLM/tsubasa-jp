import { STAGE0_LESSONS_PART1 } from './lessonsPart1';
import { STAGE0_LESSONS_PART2 } from './lessonsPart2';
import type { Lesson } from '../types/curriculum';

export const ALL_LESSONS: Lesson[] = [...STAGE0_LESSONS_PART1, ...STAGE0_LESSONS_PART2];

export interface RoadmapStage {
  id: string;
  stage: string;
  title: string;
  level: string;
  status: 'active' | 'planned';
  summary: string;
  milestone: string;
}

export const ROADMAP_STAGES: RoadmapStage[] = [
  {
    id: 'stage-0',
    stage: 'Stage 0',
    title: '语法破冰骨架',
    level: '零语法 → 底层贯通',
    status: 'active',
    summary: '语序、三大句型、は/が本质、7 大格助词、形容词与动词分类变形、て形音便、定语从句与名词化。',
    milestone: '彻底告别靠猜，能结构化拆解日常日语句子（当前 MVP v0.1 已全部上线）'
  },
  {
    id: 'stage-1',
    stage: 'Stage 1',
    title: '实用地基与场景精读',
    level: 'N5 – N4 核心',
    status: 'planned',
    summary: '授受动词、可能/被动/使役、四大条件句（と/ば/たら/なら）、FSRS 间隔复习队列 + 日本旅游/Live 场景精读馆。',
    milestone: '日本自由行点餐、交通、购票、读懂活动公告基本无压力'
  },
  {
    id: 'stage-2',
    stage: 'Stage 2',
    title: '实战自由与口语进阶',
    level: 'N3 – N2 核心',
    status: 'planned',
    summary: '复合助词、敬语体系（尊敬/谦让）、动漫口语缩略还原、长定语从句阅读、近义语法对比矩阵。',
    milestone: '达成日本旅游基本无语言障碍，看番刷日推开始脱离中文字幕'
  },
  {
    id: 'stage-3',
    stage: 'Stage 3',
    title: 'N1 冲刺与插件联动',
    level: 'JLPT N1 通关',
    status: 'planned',
    summary: 'N1 书面语法深度辨析、新闻/评论长难句结构剖析、JLPT 星号排序专项刷题 + 浏览器划词语法插件。',
    milestone: '具备稳定通过 JLPT N1 的语法与长难句阅读能力'
  }
];
