import { BlockFrostAPI } from '@blockfrost/blockfrost-js';

const blockfrostAPI = new BlockFrostAPI({
  projectId: process.env.PROJECT_ID || '',
});

export default blockfrostAPI;