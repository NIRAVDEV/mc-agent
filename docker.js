const Docker = require('dockerode');
const docker = new Docker();

module.exports = {
  createContainer: async ({ name, port }) => {
    return docker.createContainer({
      Image: 'itzg/minecraft-server',
      name,
      Tty: true,
      Env: ['EULA=TRUE'],
      HostConfig: {
        PortBindings: {
          '25565/tcp': [{ HostPort: port.toString() }]
        }
      }
    }).then(container => container.start());
  },

  stopContainer: async (name) => {
    const container = docker.getContainer(name);
    return container.stop();
  },

  deleteContainer: async (name) => {
    const container = docker.getContainer(name);
    return container.remove({ force: true });
  }
};
