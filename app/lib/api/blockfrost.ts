import Blockfrost from '@blockfrost/blockfrost-js';

const blockfrostAPI = new Blockfrost.BlockFrostAPI({
  projectId: process.env.PROJECT_ID || '',
});

export default blockfrostAPI;