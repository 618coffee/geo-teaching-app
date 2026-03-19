import type { Region } from '../data/demoData';

interface MapBoardProps {
  regions: Region[];
  selectedId: string;
  onSelect: (id: string) => void;
  mode?: 'realistic' | 'abstract';
}

export function MapBoard({ regions, selectedId, onSelect, mode = 'realistic' }: MapBoardProps) {
  return (
    <div className={`map-board ${mode}`}>
      <div className="map-board__overlay">
        <div>
          <div className="eyebrow">{mode === 'realistic' ? '实景地图模拟' : '抽象地图模拟'}</div>
          <h3>点击地图选择工厂位置</h3>
          <p>已用示意热区模拟铁路、公路、河流、城镇中心、高新区等区位要素。</p>
        </div>
      </div>
      {regions.map((region) => (
        <button
          key={region.id}
          className={`map-node ${selectedId === region.id ? 'active' : ''}`}
          style={{ left: `${region.x}%`, top: `${region.y}%` }}
          onClick={() => onSelect(region.id)}
        >
          <span>{region.name}</span>
        </button>
      ))}
      <div className="map-legend">
        <span>铁路枢纽</span>
        <span>城镇中心</span>
        <span>工业带</span>
        <span>生态区</span>
      </div>
    </div>
  );
}
