export enum Shell {
    PowerShell,
    Cmd,
    Shell,
    Wsl
}

export function escapeSpaces(s, shell) {
    if (!s.includes(' ')) {
        return s;
    }
    switch (shell) {
        case Shell.PowerShell:
            // Unescape
            s = s.replace(new RegExp('` ', 'g'), ' ');
            // Escape
            return s.replace(new RegExp(' ', 'g'), '` ');
        case Shell.Cmd:
            s = s.concat();
            if (!s.startsWith('"')) {
                s = '"'.concat(s);
            }
            if (!s.endsWith('"')) {
                s = s.concat('"');
            }
            return s;
        case Shell.Shell:
        case Shell.Wsl:
            s = s.concat();
            if (!s.startsWith('\'')) {
                s = '\''.concat(s);
            }
            if (!s.endsWith('\'')) {
                s = s.concat('\'');
            }
            return s;
    }
}


export function getCommandForArgs(shell, args) {
    args = args.map((a: any) => escapeSpaces(a, shell));
    return args.join(' ');
}

function correctPath(path) {
    const disk = path.substr(0, 1).toLowerCase(); // For `C:\\Directory` it will be `C`
    path = path.replace(new RegExp('\\\\', 'g'), '/'); // After the line it will look like `C:/Directory`
    const pathWithoutDisk = path.substring(path.indexOf('/') + 1); // For `C:/Directory` it will be `Directory`
    return `/mnt/${disk}/${pathWithoutDisk}`;
}

export function getCommandToChangeWorkingDirectory(
    shell,
    workingDirectory
) {
    if (shell === Shell.Wsl) {
        workingDirectory = correctPath(workingDirectory);
    }
    return getCommandForArgs(shell, ['cd', workingDirectory]);
}