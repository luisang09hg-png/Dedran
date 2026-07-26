for (const file of ['src/pages/Auth/Login.jsx', 'src/pages/Auth/Register.jsx', 'src/pages/Applications/Applications.jsx', 'src/pages/Courses/Courses.jsx', 'src/pages/Galaxy/Galaxy.jsx', 'src/pages/Landing/Landing.jsx', 'src/pages/Profile/Profile.jsx', 'src/pages/Search/SearchResults.jsx', 'src/pages/Settings/Settings.jsx', 'src/pages/Messages/Messages.jsx', 'src/pages/Feed/Feed.jsx', 'src/components/layout/Sidebar.jsx']) {
  console.log(`\n=== Checking ${file} ===`);
  const content = require('fs').readFileSync(file, 'utf8');

  const hasNamedExport = /export\s+(const\s+\w+\s*\(\s*\)\s*{|export function\s+\w+|export const\s+\w+).*?(?=\s+\n\s*[a-z]|\s+export\s+default|\s+export\s+{\s*\n|\s*})/s.exec(content);
  const hasDefaultExport = /export default\s+\w+/s.exec(content);

  console.log(hasNamedExport ? `✓ Has named export: ${hasNamedExport[0].substring(0, 80)}...` : '✓ Has default export' || (hasDefaultExport ? `✓ Has default export: ${hasDefaultExport[0]}` : '❌ Missing proper export'));
}
