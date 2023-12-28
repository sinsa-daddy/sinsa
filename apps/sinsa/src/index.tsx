import React from 'react';
import '@/plugins/dayjs';

export default async function bootstrap(
  _: React.ComponentType,
  innerBootStrap: () => void,
) {
  innerBootStrap();
}
