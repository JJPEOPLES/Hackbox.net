// Netlify Function to proxy requests to a remote Docker API and manage Docker VMs
const { neon } = require('@netlify/neon');

// Configuration for remote Docker host
const DOCKER_API_URL = process.env.DOCKER_API_URL || 'https://your-docker-api-host.com';
const DOCKER_API_KEY = process.env.DOCKER_API_KEY;

// VM templates
const VM_TEMPLATES = {
  'ubuntu-lxde': {
    name: 'Ubuntu LXDE',
    image: 'hackbox/ubuntu-lxde:latest',
    description: 'Ubuntu with LXDE desktop environment',
    ports: ['8080:80', '2222:22'],
    resources: {
      cpus: 2,
      memory: '1024m',
      storage: '10g'
    }
  },
  'kali-linux': {
    name: 'Kali Linux',
    image: 'kalilinux/kali-rolling:latest',
    description: 'Penetration testing and ethical hacking Linux distribution',
    ports: ['8081:80', '2223:22'],
    resources: {
      cpus: 2,
      memory: '2048m',
      storage: '20g'
    }
  },
  'parrot-sec': {
    name: 'Parrot Security',
    image: 'parrotsec/security:latest',
    description: 'Security-focused Linux distribution',
    ports: ['8082:80', '2224:22'],
    resources: {
      cpus: 2,
      memory: '2048m',
      storage: '20g'
    }
  }
};

exports.handler = async function(event, context) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }

  try {
    // Get the Docker action from the path parameter
    const path = event.path.replace('/.netlify/functions/docker-proxy/', '');
    const action = path || 'status';

    // Get user authentication from headers or query parameters
    const authToken = event.headers.authorization || event.queryStringParameters?.token;
    
    // Validate user authentication (skip for demo)
    // In production, uncomment this check
    /*
    if (!await validateUserAuth(authToken)) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ 
          error: 'Unauthorized',
          message: 'Valid authentication is required to access Docker functionality'
        })
      };
    }
    */

    // Process the Docker action
    let result;
    switch (action) {
      case 'status':
        result = await getDockerStatus();
        break;
      case 'containers':
        result = await getContainers();
        break;
      case 'start':
        result = await startContainer(event.queryStringParameters?.id);
        break;
      case 'stop':
        result = await stopContainer(event.queryStringParameters?.id);
        break;
      case 'restart':
        result = await restartContainer(event.queryStringParameters?.id);
        break;
      case 'create':
        const containerData = JSON.parse(event.body || '{}');
        result = await createContainer(containerData);
        break;
      case 'vm/templates':
        result = getVMTemplates();
        break;
      case 'vm/create':
        const vmData = JSON.parse(event.body || '{}');
        result = await createVM(vmData);
        break;
      case 'vm/start':
        result = await startVM(event.queryStringParameters?.id);
        break;
      case 'vm/stop':
        result = await stopVM(event.queryStringParameters?.id);
        break;
      case 'vm/status':
        result = await getVMStatus(event.queryStringParameters?.id);
        break;
      case 'vm/terminal':
        // This would normally create a WebSocket connection
        // For demo, we'll return connection info
        result = getTerminalConnection(event.queryStringParameters?.id);
        break;
      case 'vm/desktop':
        // This would normally return noVNC connection info
        // For demo, we'll return connection info
        result = getDesktopConnection(event.queryStringParameters?.id);
        break;
      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Invalid action',
            message: `Action '${action}' is not supported`
          })
        };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Docker proxy error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Server error',
        message: error.message,
        // For demo purposes, return mock data
        demoData: getMockDockerData(event.path)
      })
    };
  }
};

// Validate user authentication
async function validateUserAuth(token) {
  // In a real implementation, validate the token against your database
  // For demo purposes, we'll accept any non-empty token
  return !!token;
}

// Get Docker status
async function getDockerStatus() {
  // In a real implementation, make an API call to the Docker host
  // For demo purposes, return mock data
  return {
    status: 'running',
    version: '20.10.12',
    containers: {
      running: 3,
      stopped: 2,
      total: 5
    },
    images: 12,
    cpu_usage: '23%',
    memory_usage: '1.2GB / 8GB',
    timestamp: new Date().toISOString()
  };
}

// Get containers
async function getContainers() {
  // In a real implementation, make an API call to the Docker host
  // For demo purposes, return mock data
  return {
    containers: [
      {
        id: 'c1',
        name: 'ubuntu-lxde',
        image: 'hackbox/ubuntu-lxde:latest',
        status: 'running',
        created: '2023-07-01T10:00:00Z',
        ports: ['8080:80', '2222:22']
      },
      {
        id: 'c2',
        name: 'kali-linux',
        image: 'kalilinux/kali-rolling:latest',
        status: 'running',
        created: '2023-07-02T11:30:00Z',
        ports: ['8081:80']
      },
      {
        id: 'c3',
        name: 'metasploit',
        image: 'metasploitframework/metasploit-framework:latest',
        status: 'stopped',
        created: '2023-07-03T09:15:00Z',
        ports: []
      }
    ]
  };
}

// Start container
async function startContainer(id) {
  // In a real implementation, make an API call to the Docker host
  // For demo purposes, return mock data
  if (!id) {
    throw new Error('Container ID is required');
  }
  
  return {
    id,
    action: 'start',
    status: 'success',
    message: `Container ${id} started successfully`,
    timestamp: new Date().toISOString()
  };
}

// Stop container
async function stopContainer(id) {
  // In a real implementation, make an API call to the Docker host
  // For demo purposes, return mock data
  if (!id) {
    throw new Error('Container ID is required');
  }
  
  return {
    id,
    action: 'stop',
    status: 'success',
    message: `Container ${id} stopped successfully`,
    timestamp: new Date().toISOString()
  };
}

// Create container
async function createContainer(data) {
  // In a real implementation, make an API call to the Docker host
  // For demo purposes, return mock data
  if (!data || !data.image) {
    throw new Error('Container image is required');
  }
  
  return {
    id: 'c' + Math.floor(Math.random() * 1000),
    name: data.name || `container-${Date.now()}`,
    image: data.image,
    status: 'created',
    message: 'Container created successfully',
    timestamp: new Date().toISOString()
  };
}

// Get VM templates
function getVMTemplates() {
  return {
    templates: VM_TEMPLATES
  };
}

// Create a new VM
async function createVM(data) {
  // In a real implementation, make an API call to the Docker host
  // For demo purposes, return mock data
  if (!data || !data.template) {
    throw new Error('VM template is required');
  }
  
  const template = VM_TEMPLATES[data.template];
  if (!template) {
    throw new Error(`Template '${data.template}' not found`);
  }
  
  const vmId = 'vm-' + Math.floor(Math.random() * 1000);
  const vmName = data.name || `${template.name.toLowerCase()}-${Date.now()}`;
  
  return {
    id: vmId,
    name: vmName,
    template: data.template,
    image: template.image,
    status: 'created',
    resources: {
      cpus: data.cpus || template.resources.cpus,
      memory: data.memory || template.resources.memory,
      storage: data.storage || template.resources.storage
    },
    ports: template.ports,
    message: 'VM created successfully',
    timestamp: new Date().toISOString()
  };
}

// Start a VM
async function startVM(id) {
  // In a real implementation, make an API call to the Docker host
  // For demo purposes, return mock data
  if (!id) {
    throw new Error('VM ID is required');
  }
  
  return {
    id,
    action: 'start',
    status: 'running',
    ip: '192.168.1.' + Math.floor(Math.random() * 254 + 1),
    message: `VM ${id} started successfully`,
    timestamp: new Date().toISOString()
  };
}

// Stop a VM
async function stopVM(id) {
  // In a real implementation, make an API call to the Docker host
  // For demo purposes, return mock data
  if (!id) {
    throw new Error('VM ID is required');
  }
  
  return {
    id,
    action: 'stop',
    status: 'stopped',
    message: `VM ${id} stopped successfully`,
    timestamp: new Date().toISOString()
  };
}

// Get VM status
async function getVMStatus(id) {
  // In a real implementation, make an API call to the Docker host
  // For demo purposes, return mock data
  if (!id) {
    throw new Error('VM ID is required');
  }
  
  // Randomly choose a status for demo purposes
  const statuses = ['running', 'stopped'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    id,
    status,
    ip: status === 'running' ? '192.168.1.' + Math.floor(Math.random() * 254 + 1) : null,
    resources: {
      cpus: 2,
      memory: '1024m',
      storage: '10g',
      cpu_usage: status === 'running' ? Math.floor(Math.random() * 100) + '%' : '0%',
      memory_usage: status === 'running' ? Math.floor(Math.random() * 1024) + 'MB / 1024MB' : '0MB / 1024MB'
    },
    uptime: status === 'running' ? Math.floor(Math.random() * 86400) : 0,
    timestamp: new Date().toISOString()
  };
}

// Get terminal connection info
function getTerminalConnection(id) {
  // In a real implementation, this would return WebSocket connection info
  // For demo purposes, return mock data
  if (!id) {
    throw new Error('VM ID is required');
  }
  
  return {
    id,
    connection_type: 'websocket',
    url: `wss://docker-vm.example.com/terminal/${id}`,
    token: 'demo-token-' + Date.now(),
    message: 'Use this connection info to connect to the VM terminal',
    demo_mode: true
  };
}

// Get desktop connection info
function getDesktopConnection(id) {
  // In a real implementation, this would return noVNC connection info
  // For demo purposes, return mock data
  if (!id) {
    throw new Error('VM ID is required');
  }
  
  return {
    id,
    connection_type: 'novnc',
    url: `https://docker-vm.example.com/desktop/${id}`,
    token: 'demo-token-' + Date.now(),
    message: 'Use this connection info to connect to the VM desktop',
    demo_mode: true
  };
}

// Restart container
async function restartContainer(id) {
  // In a real implementation, make an API call to the Docker host
  // For demo purposes, return mock data
  if (!id) {
    throw new Error('Container ID is required');
  }
  
  return {
    id,
    action: 'restart',
    status: 'success',
    message: `Container ${id} restarted successfully`,
    timestamp: new Date().toISOString()
  };
}

// Get mock Docker data for demo purposes
function getMockDockerData(path) {
  if (path.includes('containers')) {
    return getContainers();
  } else if (path.includes('status')) {
    return getDockerStatus();
  } else if (path.includes('vm/templates')) {
    return getVMTemplates();
  } else if (path.includes('vm/status')) {
    return getVMStatus('vm-demo');
  } else if (path.includes('vm/terminal')) {
    return getTerminalConnection('vm-demo');
  } else if (path.includes('vm/desktop')) {
    return getDesktopConnection('vm-demo');
  } else {
    return {
      demo: true,
      message: 'This is mock data for demonstration purposes',
      timestamp: new Date().toISOString()
    };
  }
}