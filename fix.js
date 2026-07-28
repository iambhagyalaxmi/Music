const fs = require('fs');

const updateFile = (path, replaceFn) => {
  let content = fs.readFileSync(path, 'utf8');
  content = replaceFn(content);
  fs.writeFileSync(path, content, 'utf8');
};

// 1. community/page.tsx
updateFile('apps/web/app/community/page.tsx', c => {
  return c
    .replace(/import \{ SubscriptionGuard \} from '\.\.\/\.\.\/lib\/SubscriptionGuard';/, "import { DashboardLayout } from '@/components/layout/DashboardLayout';")
    .replace(/<SubscriptionGuard>[\s\S]*?<div className=\"community-container.*?>[\s\S]*?<Sidebar \/>/, '<DashboardLayout>')
    .replace(/<\/main>[\s\S]*?<\/div>[\s\S]*?<\/SubscriptionGuard>/, '</DashboardLayout>');
});

// 2. rooms/page.tsx
updateFile('apps/web/app/rooms/page.tsx', c => {
  return c
    .replace(/import \{ SubscriptionGuard \} from '\.\.\/\.\.\/lib\/SubscriptionGuard';/, "import { DashboardLayout } from '@/components/layout/DashboardLayout';")
    .replace(/<SubscriptionGuard>[\s\S]*?<div className=\"rooms-container.*?>[\s\S]*?<Sidebar \/>/, '<DashboardLayout>')
    .replace(/<\/main>[\s\S]*?<\/div>[\s\S]*?<\/SubscriptionGuard>/, '</DashboardLayout>');
});

// 3. friends/page.tsx
updateFile('apps/web/app/friends/page.tsx', c => {
  return c
    .replace(/import \{ SubscriptionGuard \} from '\.\.\/\.\.\/lib\/SubscriptionGuard';/, "import { DashboardLayout } from '@/components/layout/DashboardLayout';")
    .replace(/<SubscriptionGuard>[\s\S]*?<div className=\"dashboard-layout.*?>[\s\S]*?<Sidebar \/>/, '<DashboardLayout>')
    .replace(/<\/main>[\s\S]*?<\/div>[\s\S]*?<\/SubscriptionGuard>/, '</DashboardLayout>');
});

// 4. profile/page.tsx
updateFile('apps/web/app/profile/page.tsx', c => {
  return c
    .replace(/(import \{ ProfileTabs \} from '\.\.\/\.\.\/components\/profile\/ProfileTabs';)/, "$1\nimport { DashboardLayout } from '@/components/layout/DashboardLayout';")
    .replace(/return \(\s*<div style=\{\{ minHeight: '100vh'.*?\}\}>/, 'return (<DashboardLayout><div className="flex-1">')
    .replace(/<\/div>\s*<\/div>\s*\);\s*\}/, '</div></div></DashboardLayout>);\n}');
});

// 5. settings/layout.tsx
updateFile('apps/web/app/settings/layout.tsx', c => {
  return c
    .replace(/(import \{ SettingsProvider \} from '\.\.\/\.\.\/components\/settings\/SettingsContext';)/, "$1\nimport { DashboardLayout } from '@/components/layout/DashboardLayout';")
    .replace(/return \(\s*<SettingsProvider>/, 'return (<DashboardLayout><SettingsProvider>')
    .replace(/<\/SettingsProvider>\s*\);\s*\}/, '</SettingsProvider></DashboardLayout>);\n}');
});
