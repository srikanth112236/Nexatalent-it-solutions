import { createApp } from './app/index.js';
import { config } from './config/index.js';

const app = createApp();

app.listen(config.port, () => {
  console.log(`🚀 NexaTalent Backend API running on http://localhost:${config.port}`);
  console.log(`   Environment: ${config.env}`);
});
