// Netlify Function to proxy requests to a remote Docker API
const { neon } = require('@netlify/neon');

// Configuration for remote Docker host
const DOCKER_API_URL = process.env.DOCKER_API_URL || 'https://your-docker-api-host.com';
const DOCKER_API_KEY = process.env.DOCKER_API_KEY;

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
    
    // Validate user authentication
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
      case 'create':
        const containerData = JSON.parse(event.body);
        result = await createContainer(containerData);
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

// Get mock Docker data for demo purposes
function getMockDockerData(path) {
  if (path.includes('containers')) {
    return getContainers();
  } else if (path.includes('status')) {
    return getDockerStatus();
  } else {
    return {
      demo: true,
      message: 'This is mock data for demonstration purposes',
      timestamp: new Date().toISOString()
    };
  }
}