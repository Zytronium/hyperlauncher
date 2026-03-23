# Hyperlauncher

The Linux app launcher of the future.

Designed for use with the Copilot key as an alternate app launcher,
this fullscreen app launcher can display all apps detected on the 
system or just the apps you want there.

This app supports opening and closing via a custom keybind, i.e. the
Copilot key on some newer laptops. Here's a script that allows that
to work (Designed for KDE Plasma 6 on CachyOS)

> IMPORTANT: `APP_CMD` and (maybe) `APP_MATCH` will need to be edited to work on your computer.
```bash
#!/bin/bash

APP_CMD="/home/null/WebstormProjects/hyperlauncher/dist/Hyperlauncher-0.1.0.AppImage"
APP_MATCH="Hyperlauncher-0.1.0.AppImage"

# Find the main Electron process
MAIN_PID=$(pgrep -f "\.mount_Hyperl" | while read pid; do
    cmdline=$(cat /proc/$pid/cmdline 2>/dev/null | tr '\0' ' ')
    if [[ "$cmdline" != *"--type="* ]]; then
        echo "$pid"
        break
    fi
done)

if [ -n "$MAIN_PID" ]; then
    kill -USR1 "$MAIN_PID"
elif ! pgrep -f "$APP_MATCH" > /dev/null; then
    "$APP_CMD" &
fi

```
