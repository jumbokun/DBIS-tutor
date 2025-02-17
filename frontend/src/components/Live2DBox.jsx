import React, { useState } from 'react';
import { Stage } from '@pixi/react';
import { Live2DModel } from 'pixi-live2d-display';
import * as PIXI from 'pixi.js';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const DraggableLive2DModel = ({ modelPath }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'MODEL',
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [model, setModel] = useState(null);

  React.useEffect(() => {
    const loadModel = async () => {
      try {
        const live2DModel = await Live2DModel.from(modelPath);
        live2DModel.scale.set(0.3);
        setModel(live2DModel);
      } catch (error) {
        console.error('Failed to load Live2D model:', error);
      }
    };

    loadModel();
  }, [modelPath]);

  return (
    <div
      ref={dragRef}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        width: '500px',
        height: '500px',
      }}
    >
      {model && <Stage width={500} height={500} options={{ backgroundAlpha: 0 }}>
        <primitive object={model} />
      </Stage>}
    </div>
  );
};

const Live2DBox = () => {
  const [, dropRef] = useDrop(() => ({ accept: 'MODEL' }));

  return (
    <div ref={dropRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <DraggableLive2DModel modelPath="/live2d-model/hijiki/runtime/hijiki.model3.json" />
    </div>
  );
};

const App = () => (
  <DndProvider backend={HTML5Backend}>
    <Live2DBox />
  </DndProvider>
);

export default App;
