FROM ubuntu:22.04

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Install necessary packages
RUN apt-get update && apt-get install -y \
    lxde \
    tightvncserver \
    novnc \
    websockify \
    net-tools \
    xterm \
    firefox \
    curl \
    wget \
    git \
    python3 \
    python3-pip \
    sudo \
    nano \
    vim \
    htop \
    nmap \
    wireshark \
    metasploit-framework \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set up VNC password
RUN mkdir -p /root/.vnc
RUN echo "hackbox" | vncpasswd -f > /root/.vnc/passwd
RUN chmod 600 /root/.vnc/passwd

# Set up noVNC
RUN mkdir -p /usr/share/novnc/utils
RUN ln -s /usr/share/novnc/vnc.html /usr/share/novnc/index.html

# Create startup script
RUN echo '#!/bin/bash\n\
vncserver :1 -geometry 1280x800 -depth 24 -localhost no\n\
websockify -D --web=/usr/share/novnc 8080 localhost:5901\n\
tail -f /dev/null' > /start.sh && chmod +x /start.sh

# Create a non-root user
RUN useradd -m -s /bin/bash hackbox && \
    echo "hackbox:hackbox" | chpasswd && \
    adduser hackbox sudo && \
    echo "hackbox ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Set up desktop environment
RUN mkdir -p /home/hackbox/Desktop
RUN echo '[Desktop Entry]\n\
Version=1.0\n\
Type=Application\n\
Name=Terminal\n\
Comment=Terminal Emulator\n\
Exec=xterm\n\
Icon=terminal\n\
Terminal=false\n\
Categories=Utility;TerminalEmulator;' > /home/hackbox/Desktop/terminal.desktop
RUN chmod +x /home/hackbox/Desktop/terminal.desktop

# Set up Firefox shortcut
RUN echo '[Desktop Entry]\n\
Version=1.0\n\
Type=Application\n\
Name=Firefox\n\
Comment=Web Browser\n\
Exec=firefox\n\
Icon=firefox\n\
Terminal=false\n\
Categories=Network;WebBrowser;' > /home/hackbox/Desktop/firefox.desktop
RUN chmod +x /home/hackbox/Desktop/firefox.desktop

# Set ownership
RUN chown -R hackbox:hackbox /home/hackbox

# Expose VNC and noVNC ports
EXPOSE 5901 8080

# Start VNC server and noVNC
CMD ["/start.sh"]