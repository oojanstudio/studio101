import DocSummaryBox from './DocSummaryBox.svelte';
import DocSummaryBoxStoryFrame from './DocSummaryBoxStoryFrame.svelte';

const mockThumbnail = (id, sequence, url) => ({
  id,
  sequence_number: sequence,
  file_name: `design-${sequence}.png`,
  mime_type: 'image/png',
  size_bytes: 245000,
  storage_path: `user-media/doc-123/design-${sequence}.png`,
  created_at: new Date().toISOString(),
  thumbnail_url: url
});

const baseDocument = {
  id: 'doc-123',
  title: 'My Design 01',
  updated_at: new Date(Date.now() - 10 * 60 * 1000).toISOString()
};

export default {
  title: 'Dashboard/DocSummaryBox',
  component: DocSummaryBox,
  render: (args) => ({
    Component: DocSummaryBoxStoryFrame,
    props: args
  }),
  args: {
    document: baseDocument,
    thumbnails: [],
    selected: false,
    onSelect: () => {}
  }
};

export const NoThumbnail = {
  args: {
    document: baseDocument,
    thumbnails: [],
    selected: false
  }
};

export const SingleThumbnail = {
  args: {
    document: baseDocument,
    thumbnails: [
      mockThumbnail('thumb-1', 1, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDQwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyNjciIGZpbGw9IiNGRjZCMkMiLz48L3N2Zz4=')
    ],
    selected: false
  }
};

export const ThreeThumbnails = {
  args: {
    document: baseDocument,
    thumbnails: [
      mockThumbnail('thumb-1', 1, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDQwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyNjciIGZpbGw9IiNGRjZCMkMiLz48L3N2Zz4='),
      mockThumbnail('thumb-2', 2, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDQwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyNjciIGZpbGw9IiMwMDcxQTUiLz48L3N2Zz4='),
      mockThumbnail('thumb-3', 3, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDQwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyNjciIGZpbGw9IiM0OEM5QzEiLz48L3N2Zz4=')
    ],
    selected: false
  }
};

export const Unselected = {
  args: {
    document: baseDocument,
    thumbnails: [
      mockThumbnail('thumb-1', 1, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDQwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyNjciIGZpbGw9IiNGRjZCMkMiLz48L3N2Zz4=')
    ],
    selected: false
  }
};

export const Selected = {
  args: {
    document: baseDocument,
    thumbnails: [
      mockThumbnail('thumb-1', 1, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDQwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyNjciIGZpbGw9IiNGRjZCMkMiLz48L3N2Zz4=')
    ],
    selected: true
  }
};

export const SecondsAgo = {
  args: {
    document: {
      ...baseDocument,
      updated_at: new Date(Date.now() - 30 * 1000).toISOString()
    },
    thumbnails: [
      mockThumbnail('thumb-1', 1, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDQwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyNjciIGZpbGw9IiNGRjZCMkMiLz48L3N2Zz4=')
    ],
    selected: false
  }
};

export const HoursAgo = {
  args: {
    document: {
      ...baseDocument,
      updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    },
    thumbnails: [
      mockThumbnail('thumb-1', 1, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDQwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyNjciIGZpbGw9IiNGRjZCMkMiLz48L3N2Zz4=')
    ],
    selected: false
  }
};

export const DaysAgo = {
  args: {
    document: {
      ...baseDocument,
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    thumbnails: [
      mockThumbnail('thumb-1', 1, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDQwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyNjciIGZpbGw9IiNGRjZCMkMiLz48L3N2Zz4=')
    ],
    selected: false
  }
};

export const ThumbnailNavigation = {
  args: {
    document: baseDocument,
    thumbnails: [
      mockThumbnail('thumb-1', 1, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDQwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyNjciIGZpbGw9IiNGRjZCMkMiLz48L3N2Zz4='),
      mockThumbnail('thumb-2', 2, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDQwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyNjciIGZpbGw9IiMwMDcxQTUiLz48L3N2Zz4='),
      mockThumbnail('thumb-3', 3, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDQwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyNjciIGZpbGw9IiM0OEM5QzEiLz48L3N2Zz4=')
    ],
    selected: false
  }
};
