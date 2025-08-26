const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { writeCobitFile, getSnippetUrl } = require('./utils');

module.exports = async function clone(repoId) {
  const folderName = `cobit-${repoId}`;
  const repoPath = path.join(process.cwd(), folderName);

  if (fs.existsSync(repoPath)) {
    console.log(`❌ Folder already exists: ${folderName}`);
    return;
  }

  try {
    const res = await axios.get(getSnippetUrl(repoId));
    const snippet = res.data;

    if (!snippet || !snippet.id) {
      console.log('❌ Clone failed: snippet not found.');
      return;
    }

    fs.mkdirSync(repoPath, { recursive: true });

    // Decide local filename
    let filename = (snippet.title || 'snippet').trim();
    if (!path.extname(filename)) {
      // no extension? default to .txt
      filename += '.txt';
    }

    // Write code file
    const filePath = path.join(repoPath, filename);
    fs.writeFileSync(filePath, snippet.code || '', 'utf-8');

    // Write .cobit
    const cobit = { id: snippet.id, staged: [], commits: [] };
    fs.writeFileSync(path.join(repoPath, '.cobit'), JSON.stringify(cobit, null, 2));

    console.log(`✅ Cloned ${repoId} -> ${folderName}/${filename}`);
  } catch (err) {
    console.log('❌ Clone failed:', err.response?.data || err.message);
  }
};
