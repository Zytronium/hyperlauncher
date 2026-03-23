const fs = require('fs');
const path = require('path');
const os = require('os');

const DESKTOP_DIRS = [
    '/usr/share/applications',
    '/usr/local/share/applications',
    path.join(os.homedir(), '.local/share/applications'),
    '/var/lib/flatpak/exports/share/applications',
    path.join(os.homedir(), '.local/share/flatpak/exports/share/applications'),
    '/var/lib/snapd/desktop/applications',
];

const ICON_DIRS = [
    path.join(os.homedir(), '.local/share/icons'),
    '/usr/share/icons/hicolor',
    '/usr/share/icons/Papirus',
    '/usr/share/icons',
    '/usr/share/pixmaps',
];

const ICON_SIZES = ['256x256', '128x128', '64x64', '48x48', '32x32', 'scalable'];
const ICON_EXTS = ['.png', '.svg', '.xpm'];

function parseDesktopFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const entry = {};
    let inDesktopEntry = false;

    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed === '[Desktop Entry]') {
            inDesktopEntry = true;
            continue;
        }
        if (trimmed.startsWith('[') && trimmed !== '[Desktop Entry]')
            inDesktopEntry = false;
        if (!inDesktopEntry || !trimmed || trimmed.startsWith('#'))
            continue;
        const eq = trimmed.indexOf('=');
        if (eq === -1)
            continue;
        const key = trimmed.substring(0, eq).trim();
        const val = trimmed.substring(eq + 1).trim();
        entry[key] = val;
    }

    return entry;
}

function resolveIcon(iconName) {
    if (!iconName)
        return undefined;

    // Already an absolute path
    if (path.isAbsolute(iconName) && fs.existsSync(iconName))
        return iconName;

    // Search icon theme dirs
    for (const dir of ICON_DIRS) {
        // Try sized subdirs
        for (const size of ICON_SIZES) {
            for (const category of ['apps', 'applications', '']) {
                const base = category
                    ? path.join(dir, size, category, iconName)
                    : path.join(dir, size, iconName);
                for (const ext of ICON_EXTS) {
                    const full = base + ext;
                    if (fs.existsSync(full))
                        return full;
                }
                // Maybe it already has an extension
                if (fs.existsSync(base))
                    return base;
            }
        }
        // Try flat in the dir itself (e.g. /usr/share/pixmaps)
        for (const ext of ICON_EXTS) {
            const full = path.join(dir, iconName + ext);
            if (fs.existsSync(full))
                return full;
        }
        if (fs.existsSync(path.join(dir, iconName)))
            return path.join(dir, iconName);
    }

    return undefined;
}

function cleanExec(exec) {
    // Strip field codes like %f %F %u %U %i %c %k
    return exec.replace(/%[fFuUickdDnNvm%]/g, '').replace(/\s+/g, ' ').trim();
}

function scanApps() {
    const seen = new Set();
    const apps = [];
    let id = 0;

    for (const dir of DESKTOP_DIRS) {
        if (!fs.existsSync(dir))
            continue;
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.desktop'));

        for (const file of files) {
            const filePath = path.join(dir, file);
            try {
                const entry = parseDesktopFile(filePath);

                // Skip hidden, nodisplay, or non-Application types
                if (entry['NoDisplay'] === 'true'
                 || entry['Hidden'] === 'true'
                 || (entry['Type'] && entry['Type'] !== 'Application')
                 || !entry['Name']
                 || !entry['Exec'])
                    continue;

                // Deduplicate by name
                if (seen.has(entry['Name']))
                    continue;
                seen.add(entry['Name']);

                apps.push({
                    id: id++,
                    name: entry['Name'],
                    description: entry['Comment'] || undefined,
                    image: resolveIcon(entry['Icon']),
                    exec_cmd: cleanExec(entry['Exec']),
                    exec_path: undefined,
                });
            } catch {
                // Skip malformed desktop files
            }
        }
    }

    return apps.sort((a, b) => a.name.localeCompare(b.name));
}

module.exports = { scanApps };
