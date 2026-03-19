import { useEffect, useState } from 'react';
import { getAnalysis } from './demoData';

const STORAGE_KEY = 'geo-teaching-demo-state';

interface DemoState {
  classCode: string;
  factoryType: '食品厂' | '服装厂' | '化工厂' | '钢铁厂' | '高新技术厂';
  regionId: string;
}

const defaultState: DemoState = {
  classCode: '230315',
  factoryType: '食品厂',
  regionId: 'r4',
};

export function useDemoState() {
  const [state, setState] = useState<DemoState>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return {
    state,
    setState,
    analysis: getAnalysis(state.factoryType, state.regionId),
  };
}
