const { readCobitFile, writeCobitFile, fileExistsOrExit } = require('./utils');

module.exports = function add(filenames) {
  const cobit = readCobitFile();
  if (!cobit) {
    console.log('❌ No Cobit repo found. Run `cobit init` first.');
    return;
  }

  const toStage = [];
  for (const f of filenames) {
    fileExistsOrExit(f);
    if (!cobit.staged.includes(f)) toStage.push(f);
  }

  if (!toStage.length) {
    console.log('ℹ️ Nothing new to stage.');
    return;
  }

  cobit.staged.push(...toStage);
  writeCobitFile(cobit);
  console.log(`✅ Staged: ${toStage.join(', ')}`);
  if (cobit.staged.length > 1) {
    console.log('⚠️ Note: Cobit pushes only the FIRST staged file (API is single-snippet).');
  }
};
