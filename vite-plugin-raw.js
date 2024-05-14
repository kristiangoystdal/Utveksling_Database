// vite-plugin-raw.js
export default function rawPlugin() {
    return {
      name: 'vite-plugin-raw',
      transform(src, id) {
        if (id.endsWith('.txt')) {
          return `export default ${JSON.stringify(src)}`;
        }
      }
    };
  }