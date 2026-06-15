import DocRawPayload from './DocRawPayload.svelte';

const defaultPayload = {
  layers: [
    {
      id: 'layer-1',
      name: 'Background',
      type: 'rectangle',
      width: 512,
      height: 512,
      x: 0,
      y: 0,
      fill: '#FF0000'
    }
  ],
  canvas: {
    width: 512,
    height: 512
  }
};

export default {
  title: 'Editor/DocRawPayload',
  component: DocRawPayload,
  args: {
    documentId: 'doc-123',
    initialPayload: JSON.stringify(defaultPayload, null, 2),
    onSaveNewPayload: () => {}
  }
};

export const Default = {
  args: {
    documentId: 'doc-123',
    initialPayload: JSON.stringify(defaultPayload, null, 2)
  }
};

export const EmptyPayload = {
  args: {
    documentId: 'doc-456',
    initialPayload: '{}'
  }
};

export const ComplexPayload = {
  args: {
    documentId: 'doc-789',
    initialPayload: JSON.stringify(
      {
        version: '1.0',
        layers: [
          {
            id: 'layer-1',
            name: 'Background',
            type: 'rectangle',
            width: 1024,
            height: 768,
            x: 0,
            y: 0,
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeWidth: 2
          },
          {
            id: 'layer-2',
            name: 'Title',
            type: 'text',
            x: 50,
            y: 50,
            width: 900,
            height: 100,
            text: 'My Design',
            fontSize: 48,
            fontFamily: 'Arial',
            fill: '#000000'
          },
          {
            id: 'layer-3',
            name: 'Image',
            type: 'image',
            x: 100,
            y: 200,
            width: 800,
            height: 500,
            src: 'image-placeholder.jpg'
          }
        ],
        canvas: {
          width: 1024,
          height: 768
        },
        metadata: {
          created: '2026-06-14T12:00:00Z',
          modified: '2026-06-14T14:30:00Z',
          author: 'Designer'
        }
      },
      null,
      2
    )
  }
};

export const InvalidJSON = {
  args: {
    documentId: 'doc-invalid',
    initialPayload: '{ invalid json here'
  }
};

export const LargePayload = {
  args: {
    documentId: 'doc-large',
    initialPayload: JSON.stringify(
      {
        layers: Array.from({ length: 50 }, (_, i) => ({
          id: `layer-${i}`,
          name: `Layer ${i + 1}`,
          type: 'rectangle',
          x: i * 10,
          y: i * 10,
          width: 100,
          height: 100,
          fill: `hsl(${(i * 360) / 50}, 100%, 50%)`
        })),
        canvas: {
          width: 2000,
          height: 2000
        }
      },
      null,
      2
    )
  }
};
