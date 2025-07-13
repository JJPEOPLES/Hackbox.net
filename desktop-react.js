// React component for the Ubuntu LXDE Desktop page
class DesktopApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLocal: false,
            loading: true,
            tools: [
                { name: 'Terminal', icon: '🖥️', description: 'Access the command line' },
                { name: 'Firefox', icon: '🦊', description: 'Web browser' },
                { name: 'Wireshark', icon: '🦈', description: 'Network protocol analyzer' },
                { name: 'Metasploit', icon: '🛡️', description: 'Penetration testing framework' },
                { name: 'Burp Suite', icon: '🐛', description: 'Web vulnerability scanner' },
                { name: 'OWASP ZAP', icon: '🕷️', description: 'Web app security scanner' }
            ]
        };
    }

    componentDidMount() {
        // Check if we're running locally
        const hostname = window.location.hostname;
        const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
        
        this.setState({ 
            isLocal: isLocal,
            loading: false
        });
        
        // If running locally, load the noVNC iframe
        if (isLocal) {
            this.loadNoVNCIframe();
        }
    }
    
    loadNoVNCIframe() {
        const novncContainer = document.getElementById('novnc-container');
        if (novncContainer) {
            // Clear the container
            novncContainer.innerHTML = '';
            
            // Create the iframe
            const iframe = document.createElement('iframe');
            iframe.id = 'novnc-frame';
            iframe.src = '/vnc.html?autoconnect=true&resize=remote&password=hackbox';
            
            // Add the iframe to the container
            novncContainer.appendChild(iframe);
            
            // Show the fullscreen button
            const fullscreenBtn = document.getElementById('fullscreen-btn');
            if (fullscreenBtn) {
                fullscreenBtn.style.display = 'inline-block';
            }
        }
    }
    
    handleFullscreen() {
        const iframe = document.getElementById('novnc-frame');
        if (iframe) {
            if (iframe.requestFullscreen) {
                iframe.requestFullscreen();
            } else if (iframe.webkitRequestFullscreen) {
                iframe.webkitRequestFullscreen();
            } else if (iframe.msRequestFullscreen) {
                iframe.msRequestFullscreen();
            }
        }
    }
    
    renderToolCard(tool) {
        return (
            <div className="tool-card" key={tool.name}>
                <div className="tool-icon">{tool.icon}</div>
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
            </div>
        );
    }
    
    renderLocalContent() {
        return (
            <div className="novnc-container" id="novnc-container">
                <div className="loading-message">Loading Ubuntu LXDE Desktop...</div>
            </div>
        );
    }
    
    renderRemoteContent() {
        return (
            <div className="desktop-placeholder">
                <div className="desktop-info">
                    <h2>Ubuntu LXDE Desktop</h2>
                    <p>The Ubuntu LXDE desktop environment is only available when running HackBox locally with Docker.</p>
                    
                    <div className="desktop-instructions">
                        <h3>How to Run Locally:</h3>
                        <ol>
                            <li>Clone the repository: <code>git clone https://github.com/JJPEOPLES/Hackbox.net</code></li>
                            <li>Navigate to the project: <code>cd Hackbox.net</code></li>
                            <li>Start the Docker container: <code>npm start</code></li>
                            <li>Access the desktop at: <code>http://localhost:8080</code></li>
                        </ol>
                    </div>
                    
                    <div className="tools-preview">
                        <h3>Available Tools:</h3>
                        <div className="tools-grid">
                            {this.state.tools.map(tool => this.renderToolCard(tool))}
                        </div>
                    </div>
                    
                    <div className="action-buttons">
                        <a href="index.html" className="back-button">Back to Home</a>
                        <a href="users.html" className="launch-button">Try User Management Demo</a>
                    </div>
                </div>
            </div>
        );
    }
    
    render() {
        if (this.state.loading) {
            return <div className="loading">Loading...</div>;
        }
        
        return (
            <div className="desktop-container">
                <div className="desktop-header">
                    <h1>HackBox Ubuntu LXDE</h1>
                    <div className="controls">
                        <a href="index.html">Back to Home</a>
                        {this.state.isLocal && (
                            <a href="#" id="fullscreen-btn" onClick={this.handleFullscreen}>Fullscreen</a>
                        )}
                    </div>
                </div>
                
                {this.state.isLocal ? this.renderLocalContent() : this.renderRemoteContent()}
            </div>
        );
    }
}

// Render the React component
ReactDOM.render(
    <DesktopApp />,
    document.getElementById('desktop-app')
);