import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Documentation',
          ['Props'],
          'Components',
          ['ReactJsonView', 'Themes', 'LargeData', 'AsyncSuspense']
        ]
      }
    }
  }
};

export default preview;
