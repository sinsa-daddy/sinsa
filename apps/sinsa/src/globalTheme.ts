import dayjs from 'dayjs';

export interface InnerTheme {
  primaryColor: string;
  primaryColorLight: string;
  primaryBackgroundColor: string;
}

const BaseTheme: InnerTheme = {
  primaryColor: '#DC5950',
  primaryColorLight: '#E3776B',
  primaryBackgroundColor: '#FFF',
};

const GreenTheme: InnerTheme = {
  primaryColor: '#06a17e',
  primaryColorLight: '#b8e986',
  primaryBackgroundColor: '#FFF',
};

const NOW = dayjs();

export const IS_FOOL = NOW.date() === 1 && NOW.month() === 3;

export const GLOBAL_THEME: InnerTheme = IS_FOOL ? GreenTheme : BaseTheme;
